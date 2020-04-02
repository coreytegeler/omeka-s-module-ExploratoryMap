var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var postcss = require('postcss');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var replace = require('gulp-replace');
var php = require('gulp-connect-php');

var assets = '.asset';

var paths = {
  sass: './asset/sass/*.scss',
}

var dest = {
  css: './asset/css/',
  js: './asset/js/',
  images: './asset/img/'
}

gulp.task('compile-sass', function() {
  var sassOptions = {
    compress: argv.prod ? true : false
  };
  var apOptions = {
    browsers: ['> 0.5%', 'last 5 versions', 'Firefox ESR', 'not dead']
  };
  gulp.src(paths.sass)
    .pipe(plumber())
    .pipe(sass(sassOptions))
    .pipe(autoprefixer(apOptions))
    .pipe(replace('img/', dest.images))
    .pipe(gulp.dest(dest.css))
  .on('end', function() {
    log('Sass done');
    if (argv.prod) log('CSS minified');
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['compile-sass']);
});

gulp.task('default', [
  'compile-sass',
  'watch'
]);

gulp.task('dev', [
  'compile-sass',
  'watch'
]);

gulp.task('prod', [
  'compile-sass',
]);

function log(message) {
  gutil.log(gutil.colors.bold.green(message));
}