// ===========================
// My Build Tooling Gulpfile
// ===========================

// Config
// ===========================
// Built around pattern library setup
// MISC watch task has fudged this - locations are hardcoded at the mo
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
var rename 			= require('gulp-rename');
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
gulp.task('jsSRC', function() {
	return gulp.src([
		path.join(config.locs.source,'**/*.js'),
		path.join('!' + config.locs.assets,'**/*.js')
	])
	.pipe(gulpif( !deploy, jsPreProcessing() ))
	.pipe(concat('main.js'))
	.pipe(jsPostTask())
	.pipe(gulp.dest( outputJS ))
	.pipe( browserSync.stream() );
});

gulp.task('jsAssets', function(done) {
	var baseloc = path.join(config.locs.assets,config.types.js);
	var folders = getFolders( baseloc )

	folders.map(function(folder) {
		return gulp.src( path.join( baseloc, folder, '/**/*.js' ) )	
		.pipe(gulpif( !deploy, jsPreProcessing() ))
		.pipe(concat(folder + '.js'))
		.pipe(jsPostTask())
		.pipe(gulp.dest( outputJS ));
	 });
	 browserSync.reload();
	 done();
});


// CSS
// ===========================

gulp.task('css', function() {
	// PostCSS setup
	var postcssStd 		= [ autoprefixer({browsers: ['last 3 version']}) ];
	var postcssCleanUp 	= [ autoprefixer({browsers: ['last 3 version']}), cssnano() ];

	return gulp.src( path.join(config.locs.source,'**/*.scss') )
	.pipe( gulpif( !deploy, sourcemaps.init() ))
	.pipe( sassGlob() )
	.pipe( sass({ "indentedSyntax": false }) )
	.pipe( gulpif( deploy, postcss(postcssCleanUp) ))
	.pipe( gulpif( !deploy, postcss(postcssStd) ))
	.pipe( gulpif( !deploy, sourcemaps.write('../maps') ))
	.pipe( gulp.dest( path.join(config.locs.output,config.types.css) ))
	.pipe( browserSync.stream({match: '**/*.css'}) );
});


// IMG
// ===========================

gulp.task('img', function() {
	return gulp.src( path.join(config.locs.assets,config.types.img, '/**' ) )
	.pipe( imagemin() )
	.pipe( gulp.dest( path.join(config.locs.output,config.types.img) ))
	.pipe( browserSync.stream() );
});


// SVG
// ===========================

gulp.task('svg', function(done) {
	var baseloc = path.join(config.locs.assets,config.types.svg);
	var folders = getFolders( baseloc )

	folders.map(function(folder) {
		return gulp.src(path.join( baseloc, folder, '/*.svg' ))	
		.pipe( gulpif( deploy, imagemin() ))
		.pipe( svgstore() )
		.pipe( rename(folder + '.svg') )
		.pipe( gulp.dest( path.join(config.locs.output,config.types.svg) ));
	 });
	 browserSync.reload();
	 done();
});


// MISC
// ===========================

gulp.task('misc', function() {
	browserSync.reload();
});

// BROWSERSYNC
// ===========================

gulp.task('sync', function(done) {
	browserSync.init({
		"open": false,
		proxy: "localhost/mikejfraser.com"
	});
	done();
});


// WATCH
// ===========================

gulp.task('watch', function () {
	gulp.watch( path.join(config.locs.source,'**/*.js'), gulp.series('jsSRC'));
	gulp.watch( path.join(config.locs.assets,'**/*.js'), gulp.series('jsAssets'));

	gulp.watch( path.join(config.locs.source,'**/*.scss'), gulp.series('css'));

	gulp.watch( path.join(config.locs.assets,config.types.img, '/**'), gulp.series('img'));
	gulp.watch( path.join(config.locs.assets,config.types.svg,'**/*.svg'), gulp.series('svg'));

	gulp.watch( 'site/**/*.php', gulp.series('misc'));
});

// DEFAULT
// ===========================

gulp.task('default', gulp.series('clean', gulp.parallel('jsSRC','jsAssets','css','svg','img'),'sync','watch' ));
