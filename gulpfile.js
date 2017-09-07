// ===========================
// My Build Tooling Gulpfile
// ===========================


// Config
// -------------
var config = {

};

// Dependencies
// -------------
var fs           = require('fs');
var path 			   = require('path');
var merge 			 = require('merge-stream');

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var sourcemaps   = require('gulp-sourcemaps');
var gulpif 			 = require('gulp-if');
var watch        = require('gulp-watch');
var uglify 			 = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var svgstore     = require('gulp-svgstore');
var postcss      = require('gulp-postcss');
var sequence     = require('gulp-sequence');

var cssnano      = require('cssnano');
var autoprefixer = require('autoprefixer');
var browserSync  = require('browser-sync');
var lazypipe     = require('lazypipe');
var del          = require('del');
var argv 			   = require('yargs').argv;

// CLEAN
// -------------
gulp.task('clean', function() {
    
});

// JS
// -------------
gulp.task('js', function() {

});

// CSS
// -------------
gulp.task('css', function() {
    
});

// IMG
// -------------
gulp.task('img', function() {
    
});

// SVG
// -------------
gulp.task('svg', function() {
    
});

// BROWSERSYNC
// -------------
gulp.task('sync', function() {
    
});

// WATCH
// -------------
gulp.task('watch', function() {
    
});

// DEFAULT
// -------------
gulp.task('default', [
    'js', 
    'css',
    'img',
    'svg',
  ]);
