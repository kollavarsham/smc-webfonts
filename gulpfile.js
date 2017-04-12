const babel = require('gulp-babel');
const bump = require('gulp-bump');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const del = require('del');
const eslint = require('gulp-eslint');
const formatter = require('eslint-friendly-formatter');
const fs = require('fs');
const ghPages = require('gulp-gh-pages');
const git = require('gulp-git');
const gulp = require('gulp');
const print = require('gulp-print');
const pump = require('pump');
const rename = require('gulp-rename');
const rework = require('gulp-rework');
const replace = require('gulp-string-replace');
const runSequence = require('run-sequence');
const tagVersion = require('gulp-tag-version');
const uglify = require('gulp-uglify');
const url = require('rework-plugin-url');
const vinylPaths = require('vinyl-paths');

const currentDirectory = './';
const distDirectory = './dist';
const githubCacheDirectory = './.github';

const githubRepoUrl = `https://${process.env.GITHUB_REPO_TOKEN}@github.com/kollavarsham/smc-webfonts.git`;

const masterBranch = 'master';

// clean the 'dist' dir
gulp.task('clean', () => {
  return gulp.src([distDirectory, githubCacheDirectory, 'scripts/bookmarklet.js', 'scripts/script.js', 'scripts/*.es5.*', 'fonts/*.min.css', 'styles/*.min.css', 'smc-webfonts*.css'])
    .pipe(print(file => `deleting: ${file}`))
    .pipe(vinylPaths(del));
});

// merge fontCollection into bookmarklet
gulp.task('weave-fonts-into-bookmarklet', () => {
  return gulp.src(['scripts/fontCollection.js_', 'scripts/bookmarklet.js_'])
    .pipe(concat('bookmarklet.js'))
    .pipe(print(file => `created: ${file}`))
    .pipe(gulp.dest('scripts'));
});

// merge fontCollection into script
gulp.task('weave-fonts-into-script', () => {
  return gulp.src(['scripts/fontCollection.js_', 'scripts/script.js_'])
    .pipe(concat('script.js'))
    .pipe(print(file => `created: ${file}`))
    .pipe(gulp.dest('scripts'));
});

// lint
gulp.task('lint', ['weave-fonts-into-bookmarklet', 'weave-fonts-into-script'], () => {
  return gulp.src(['scripts/bookmarklet.js', 'scripts/script.js', 'gulpfile.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format(formatter))
    .pipe(eslint.failAfterError());
});

// transpile and concat all the scripts into one
gulp.task('build-js', ['lint'], () => {
  return gulp.src(['scripts/bookmarklet.js', 'scripts/script.js'])
    .pipe(babel({
      presets : ['env']
    }))
    .pipe(print(file => `built: ${file}`))
    .pipe(rename(path => path.basename += '.es5'))
    .pipe(gulp.dest('./scripts'));
});

// minify/compress the js file
gulp.task('compress-js', ['build-js'], (cb) => {
  pump([
    gulp.src('scripts/*.es5.js'),
    print(file => `compressed ${file}`),
    uglify(),
    rename(path => path.basename += '.min'),
    gulp.dest('./scripts')
  ], cb);
});

// concat all the individual fonts' css into one
gulp.task('build-css', (cb) => {
  pump([
    gulp.src([
      'fonts/anjali.css',
      'fonts/chilanka.css',
      'fonts/dyuthi.css',
      'fonts/karumbi.css',
      'fonts/keraleeyam.css',
      'fonts/manjari.css',
      'fonts/meera.css',
      'fonts/rachana.css',
      'fonts/raghumalayalam.css',
      'fonts/suruma.css',
      'fonts/uroob.css'
    ]),
    print(file => `built: ${file}`),
    rework(url(url => `fonts/${url}`)),
    concat('smc-webfonts.css'),
    gulp.dest(currentDirectory)
  ], cb);
});

// minify/compress all the css files
gulp.task('compress-css', ['build-css'], (cb) => {
  pump([
    gulp.src(['**/*.css', '!**/*.min.css', '!**/node_modules/**']),
    print(file => `compressed ${file}`),
    csso(),
    rename(path => path.basename += '.min'),
    gulp.dest('.')
  ], cb);
});

// publish the built files into 'dist'
gulp.task('publish', (cb) => {
  pump([
    gulp.src([
      'fonts/*/**',
      'fonts/*.min.css',
      'scripts/**/*.min.js',
      'styles/**/*.min.css',
      'smc-webfonts.min.css',
      'index.html',
      'package.json'
    ], {base : '.'}),
    print(file => `published ${file}`),
    gulp.dest(distDirectory)
  ], cb);
});

// update bookmarklet in dist
gulp.task('update-bokmarklet', function () {
  const bookmarkletContent = fs.readFileSync('scripts/bookmarklet.es5.min.js', 'utf8');

  return gulp.src(`${distDirectory}/index.html`)
    .pipe(replace('@BOOKMARKLET@', encodeURIComponent(bookmarkletContent), {logs : {enabled : false}}))
    .pipe(print(file => `updated bookmarklet in ${file}`))
    .pipe(gulp.dest(distDirectory));
});

gulp.task('deploy-to-github', () => {
  return gulp.src(`${distDirectory}/**/*`)
    .pipe(ghPages({
      remoteUrl : githubRepoUrl,
      branch    : masterBranch,
      cacheDir  : githubCacheDirectory
    }));
});

const tagRepo = function (cwd) {
  return gulp.src('./package.json', {cwd : cwd})
    .pipe(bump({type : 'patch'}))
    .pipe(gulp.dest(cwd))
    .pipe(git.commit('bumps package version [ci skip]', {cwd : cwd}))
    .pipe(tagVersion({cwd : cwd}));
};

gulp.task('tag-gitlab', () => {
  return tagRepo(currentDirectory);
});

gulp.task('tag-github', () => {
  return tagRepo(githubCacheDirectory);
});

gulp.task('build', cb => {
  runSequence(
    'clean',
    'compress-css',
    'compress-js',
    'publish',
    'update-bokmarklet',
    cb);
});

gulp.task('build-deploy-and-tag', cb => {
  runSequence(
    'build',
    'deploy-to-github',
    'tag-gitlab',
    'tag-github',
    cb
  );
});