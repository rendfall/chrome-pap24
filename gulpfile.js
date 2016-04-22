'use strict';

var gulp = require('gulp');
var series = require('run-sequence');
var exec = require('child_process').exec;
var utils = require('gulp-util');
var pkg = require('./package.json');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var zip = require('gulp-zip');
var del = require('del');

var SRC_FOLDER = './src';
var DEST_FOLDER = './dev';
var STYLES_FOLDER = './src/assets/stylesheets';
var IMAGES_FOLDER = './src/assets/images';
var ICONS_FOLDER = './src/assets/icons';
var TEMPLATES_FOLDER = './src/templates';

gulp.task('styles', function () {
    return gulp.src(STYLES_FOLDER + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(DEST_FOLDER));
});

gulp.task('clean', function () {
    del([
        DEST_FOLDER + '/**/*'
    ]);
});

gulp.task('scripts', function (cb) {
    exec('webpack --profile', cb);
});

gulp.task('copy-files',function(){
  return gulp.src([
        SRC_FOLDER + '/manifest.json',
        ICONS_FOLDER + '/icon.png',
        TEMPLATES_FOLDER + '/popup.html'
    ])
    .pipe(gulp.dest(DEST_FOLDER));
})

gulp.task('build', ['clean', 'scripts', 'styles', 'copy-files'], function () {
    process.nextTick(function () {
        console.log(utils.colors.green('\nSuccess building.\n'));
    });
});
