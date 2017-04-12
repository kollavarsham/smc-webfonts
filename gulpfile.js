const babel = require('gulp-babel');
const bump = require('gulp-bump');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const del = require('del');
const ghPages = require('gulp-gh-pages');
const git = require('gulp-git');
const gulp = require('gulp');
const path = require('path');
const print = require('gulp-print');
const pump = require('pump');
const rename = require('gulp-rename');
const rework = require('gulp-rework');
const runSequence = require('run-sequence');
const tagVersion = require('gulp-tag-version');
const uglify = require('gulp-uglify');
const url = require('rework-plugin-url');
const vinylPaths = require('vinyl-paths');

const currentDirectory = './';
const distDirectory = './dist';
const githubCacheDirectory = './.github';

const gitlabRepoUrl = `https://floydpink:${process.env.GITLAB_REPO_TOKEN}@gitlab.com/kollavarsham/smc-webfonts.git`;
const githubRepoUrl = `https://${process.env.GITHUB_REPO_TOKEN}@github.com/kollavarsham/smc-webfonts.git`;

const gitLabRemote = 'gitlab';
const gitHubRemote = 'github';

const masterBranch = 'master';

// clean the 'dist' dir
gulp.task('clean', () => {
  return gulp.src([distDirectory, githubCacheDirectory])
    .pipe(vinylPaths(del));
});

// transpile and concat all the scripts into one
gulp.task('build-js', () => {
  return gulp.src('scripts/script.js')
    .pipe(babel({
      presets : ['env']
    }))
    .pipe(concat('script.es5.js'))
    .pipe(gulp.dest('./scripts'));
});

// minify/compress the js file
gulp.task('compress-js', ['build-js'], (cb) => {
  pump([
    gulp.src('scripts/script.es5.js'),
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

gulp.task('deploy', () => {
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

gulp.task('push-gitlab', cb => {
  git.removeRemote(gitLabRemote, {cwd : currentDirectory}, () => {
    git.addRemote(gitLabRemote, gitlabRepoUrl, {cwd : currentDirectory}, () => {
      git.push(gitLabRemote, masterBranch, {cwd : currentDirectory}, () => cb());
    });
  });
});

gulp.task('push-github', cb => {
  git.removeRemote(gitHubRemote, {cwd : githubCacheDirectory}, () => {
    git.addRemote(gitHubRemote, githubRepoUrl, {cwd : githubCacheDirectory}, () => {
      git.checkout('gh-pages', {cwd : githubCacheDirectory}, () => {
        git.merge(masterBranch, {cwd : githubCacheDirectory}, () => {
          git.push(gitHubRemote, '--all', {cwd : githubCacheDirectory}, () => cb());
        });
      });
    });
  });
});

gulp.task('all-done', cb => {
  console.log('All done...');
  cb();
});

gulp.task('default', cb => {
  runSequence(
    'clean',
    'compress-css',
    'compress-js',
    'publish',
    cb);
});

gulp.task('build-and-sync', cb => {
  runSequence(
    'default',
    'tag-gitlab',
    'push-gitlab',
    'deploy',
    'tag-github',
    'push-github',
    'all-done',
    cb
  );
});