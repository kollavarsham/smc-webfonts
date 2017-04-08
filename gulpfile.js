const babel = require('gulp-babel');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const gulp = require('gulp');
const print = require('gulp-print');
const pump = require('pump');
const rename = require('gulp-rename');
const rework = require('gulp-rework');
const uglify = require('gulp-uglify');
const url = require('rework-plugin-url');

// transpile and concat all the scripts into one
gulp.task('build-js', () => {
  return gulp.src('scripts/script.js')
    .pipe(babel({
      presets : ['env']
    }))
    .pipe(concat('script.es5.js'))
    .pipe(gulp.dest('./'));
});

// minify/compress the js file
gulp.task('compress-js', ['build-js'], (cb) => {
  pump([
    gulp.src('script.es5.js'),
    uglify(),
    rename(path => path.basename += '.min'),
    gulp.dest('.')
  ], cb);
});

// concat all the individual fonts' css into one
gulp.task('build-css', () => {
  return gulp.src([
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
  ])
    .pipe(print(file => `built: ${file}`))
    .pipe(rework(url(url => `fonts/${url}`)))
    .pipe(concat('smc-webfonts.css'))
    .pipe(gulp.dest('./'));
});


// minify/compress all the css files
gulp.task('compress-css', ['build-css'], () => {
  return gulp.src(['**/*.css', '!**/*.min.css', '!**/node_modules/**'])
    .pipe(print(file => `compressed ${file}`))
    .pipe(csso())
    .pipe(rename(path => path.basename += '.min'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['compress-css', 'compress-js']);