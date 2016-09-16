'use strict';

var gulp        = require('gulp'),
	babel		= require('gulp-babel'),
    concat      = require('gulp-concat'),
    connect     = require('gulp-connect'),
    flatten     = require('gulp-flatten'),
    ghPages     = require('gulp-gh-pages'),
    minifyHTML  = require('gulp-minify-html'),
    rename      = require('gulp-rename'),
    replace     = require('gulp-replace'),
    sass        = require('gulp-sass'),
	sourcemaps	= require('gulp-sourcemaps');
    
var path        = require('path'),
    git         = require('git-rev-sync');
    
var DIST_WEB    = './dist';

gulp.task('default', ['build', 'run', 'watch']);
gulp.task('build', ['build-html', 'build-script', 'build-style', 'build-config']);

gulp.task('build-config', function() {
   return gulp.src('./web.config')
            .pipe(gulp.dest(DIST_WEB));
});

gulp.task('build-html', function() {
    console.log(git.tag());

   return gulp.src('./src/index.html')
                .pipe(replace('%%TAG%%', git.tag()))
                .pipe(replace('%%COMMIT-ID%%', git.long()))
                .pipe(replace('%%SHORT-COMMIT-ID%%', git.short()))
                .pipe(minifyHTML())
				.pipe(gulp.dest(DIST_WEB))
                .pipe(connect.reload());
});

gulp.task('build-style', ['process-images','process-fonts','process-font-awesome'], function() {
    return gulp.src('./src/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(DIST_WEB))
            .pipe(connect.reload());
});

gulp.task('build-libs', [], function() {
    var libs = [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/moment/min/moment.min.js'
    ];
    
    return gulp.src(libs)
            .pipe(concat('libs.js'))
            .pipe(gulp.dest(DIST_WEB + '/script'))
            .pipe(connect.reload());
});

gulp.task('deploy', function() {
    return gulp.src(DIST_WEB + '/**/*.*')
    .pipe(ghPages({
        remoteUrl: 'git@github.com:davidwesst/dw-www.git'
    })); 
});

gulp.task('run', function() {
   connect.server({
      root: DIST_WEB,
      port: 8080,
      livereload: {
          port: 8081 
	  } 
	});
});

gulp.task('watch', function() {
    gulp.watch('./src/script/*.js', ['build-script']);
	gulp.watch('./src/components/*.jsx', ['build-script']);
    gulp.watch('./src/*.html', ['build-html']);
    gulp.watch('./src/style/*.scss', ['build-style']);
});

gulp.task('process-font-awesome', function() {
    var fontSrcGlob = './bower_components/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}';
    return gulp.src(fontSrcGlob)
                .pipe(flatten())
                .pipe(gulp.dest(path.join(DIST_WEB, '/fonts')));
});

gulp.task('process-fonts', function() {
   var fontSrcGlob = './assets/fonts/**/*.{ttf,woff,woff2,eot,svg}';
   
   return gulp.src(fontSrcGlob)
                .pipe(flatten())
                .pipe(gulp.dest(path.join(DIST_WEB, '/assets/fonts')));
});

gulp.task('process-images', function() {
   var imageSrcGlob = './assets/images/**/*.{png,jpg,jpeg}';
   
   return gulp.src(imageSrcGlob)
                .pipe(flatten())
                .pipe(gulp.dest(path.join(DIST_WEB, '/assets/img')));
});

gulp.task('build-script', function() {
	var src = [
		'./src/script/*.js',
		'./src/components/*.jsx'
		];

	return gulp.src(src)
				.pipe(sourcemaps.init())
				.pipe(babel({
					presets: [
						'es2015',
						'react'
						]
					}))
				.pipe(concat('dw.js'))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(DIST_WEB + '/script'))
				.pipe(connect.reload());
});
