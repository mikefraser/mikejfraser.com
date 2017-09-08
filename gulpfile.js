// ===========================
// My Build Tooling Gulpfile
// ===========================

// Config
// ===========================
// Built around pattern library setup
var config = {
	"locs": {
	// src location:
	"source": "site/patterns",
	// asset location:
	"assets": "site/patterns/general",
	// output location:
	"output": "assets",
	},
	// filetype folder names:
	"types": {
		"svg": "svg",
		"js": "js",
		"css": "css",
		"img": "img"
	}
};

// Dependencies
// ===========================
var fs 				= require('fs');
var path 			= require('path');
var merge 			= require('merge-stream');

var gulp 			= require('gulp');
var sass 			= require('gulp-sass');
var sassGlob 		= require('gulp-sass-glob');
var concat 			= require('gulp-concat');
var sourcemaps 		= require('gulp-sourcemaps');
var gulpif 			= require('gulp-if');
var watch 			= require('gulp-watch');
var jshint 			= require('gulp-jshint');
var uglify 			= require('gulp-uglify');
var imagemin 		= require('gulp-imagemin');
var svgstore 		= require('gulp-svgstore');
var postcss 		= require('gulp-postcss');
var sequence 		= require('gulp-sequence');

var cssnano 		= require('cssnano');
var autoprefixer 	= require('autoprefixer');
var browserSync 	= require('browser-sync');
var lazypipe 		= require('lazypipe');
var del 			= require('del');
var argv 			= require('yargs').argv;

// HELPERS
// ===========================

// Gets all folders within a folder (not 100% on how this works...)
function getFolders(dir) {
	return fs.readdirSync(dir)
	.filter(function(file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
}

// Is Deploy flag on?
if (argv.deploy) {
	var deploy = true
} else { 
	var deploy = false
}


// CLEAN
// ===========================
gulp.task('clean', function(cb) {
	var cleanLocations = path.join(config.locs.output, '/*/**');
	del(cleanLocations).then(function (paths) {
		cb()
	});
});


// JS
// ===========================

var outputJS = path.join(config.locs.output,config.types.js);

// Pipes
var jsPreProcessing = lazypipe()
	.pipe( sourcemaps.init )
	.pipe( jshint )
	.pipe( jshint.reporter );
var jsPostProcessing = lazypipe()
	.pipe( function() {
		return sourcemaps.write('../maps');
	});

var jsCleanUp = lazypipe()
	.pipe( uglify );
var jsPostTask = lazypipe()
	.pipe(gulpif( deploy, jsCleanUp, jsPostProcessing ));

// Tasks
gulp.task('jsSRC', gulp.series(function() {
	return gulp.src([
		path.join(config.locs.source,'**/*.js'),
		path.join('!' + config.locs.assets,'**/*.js')
	])
	.pipe(gulpif( !deploy, jsPreProcessing() ))
	.pipe(concat('main.js'))
	.pipe(jsPostTask())
	.pipe(gulp.dest( outputJS ));
}));

gulp.task('jsAssets', gulp.series(function(done) {
	var baseloc = path.join(config.locs.assets,config.types.js);
	var folders = getFolders( baseloc )

	folders.map(function(folder) {
		return gulp.src(path.join( baseloc, folder, '/**/*.js' ))	
		.pipe(gulpif( !deploy, jsPreProcessing() ))
		.pipe(concat(folder + '.js'))
		.pipe(jsPostTask())
		.pipe(gulp.dest( outputJS ));
	 });
	 done();
}));


// CSS
// ===========================

var inputSCSS = path.join(config.locs.source,'**/*.scss');
var outputCSS = path.join(config.locs.output,config.types.css);

// Tasks
gulp.task('css', gulp.series(function() {
	// PostCSS setup
	var postcssStd 		= [ autoprefixer({browsers: ['last 3 version']}) ];
	var postcssCleanUp 	= [ autoprefixer({browsers: ['last 3 version']}), cssnano() ];
	// Find Files
	return gulp.src(inputSCSS)
	.pipe( gulpif( !deploy, sourcemaps.init() ))
	.pipe( sassGlob() )
	.pipe( sass({ "indentedSyntax": false }) )
	.pipe( gulpif( deploy, postcss(postcssCleanUp) ))
	.pipe( gulpif( !deploy, postcss(postcssStd) ))
	.pipe( gulpif( !deploy, sourcemaps.write('../maps') ))
	.pipe(gulp.dest( outputCSS ));
}));

// IMG
// ===========================
// gulp.task('img', function() { });

// SVG
// ===========================
// gulp.task('svg', function() { });

// BROWSERSYNC
// ===========================
// gulp.task('sync', function() { });

// WATCH
// ===========================
// gulp.task('watch', function() { });

// DEFAULT
// ===========================
// gulp.task('default', [
// 	'js', 
// 	'css',
// 	'img',
// 	'svg',
// ]);
