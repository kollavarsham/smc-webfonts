const babel = require('gulp-babel');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const print = require('gulp-print');
const pump = require('pump');
const rename = require('gulp-rename');
const rework = require('gulp-rework');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const url = require('rework-plugin-url');
const vinylPaths = require('vinyl-paths');

// clean the 'dist' dir
gulp.task('clean', () => {
  return gulp.src('./dist')
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
    gulp.dest('./')
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
      'index.html'
    ], {base : '.'}),
    print(file => `published ${file}`),
    gulp.dest('./dist')
  ], cb);
});

gulp.task('default', cb => {
  runSequence(
    'clean',
    'compress-css',
    'compress-js',
    'publish',
    cb);
});