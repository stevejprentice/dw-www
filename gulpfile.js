'use strict';

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    connect     = require('gulp-connect'),
    flatten     = require('gulp-flatten'),
    ghPages     = require('gulp-gh-pages'),
    minifyHTML  = require('gulp-minify-html'),
    rename      = require('gulp-rename'),
    replace     = require('gulp-replace'),
    sass        = require('gulp-sass');
    
var path        = require('path'),
    git         = require('git-rev-sync');
    
var DIST_WEB    = './dist';

gulp.task('default', ['build', 'run', 'watch']);
gulp.task('build', ['build-html', 'build-script', 'build-style', 'build-config']);

gulp.task('build-config', function() {
   return gulp.src('./web.config')
            .pipe(gulp.dest(DIST_WEB));
});

gulp.task('build-html', ['build-views'], function() {
   return gulp.src('./src/index.html')
                .pipe(replace('%%COMMIT-ID%%', git.long()))
                .pipe(replace('%%SHORT-COMMIT-ID%%', git.short()))
                .pipe(minifyHTML())
                .pipe(gulp.dest(DIST_WEB))
                .pipe(connect.reload());
});

gulp.task('build-views', function() {
   return gulp.src('./src/views/*.html')
                .pipe(minifyHTML())
                .pipe(gulp.dest(DIST_WEB + '/views'))
                .pipe(connect.reload()); 
});

gulp.task('build-style', ['process-images','process-blaze','process-fonts','process-font-awesome'], function() {
    return gulp.src('./src/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(DIST_WEB))
            .pipe(connect.reload());
});

gulp.task('build-libs', [], function() {
    let libs = [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/moment/min/moment.min.js',
        './bower_components/underscore/underscore-min.js'
    ];
    
    return gulp.src(libs)
            .pipe(concat('libs.js'))
            .pipe(gulp.dest(DIST_WEB + '/script'))
            .pipe(connect.reload());
});

gulp.task('build-script', ['build-libs'], function() {
    return gulp.src('./src/script/main.js')
            .pipe(concat('main.js'))
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
    gulp.watch('./src/**/*.js', ['build-script']);
    gulp.watch('./src/*.html', ['build-html']);
    gulp.watch('./src/views/*.html', ['build-views']);
    gulp.watch('./src/style/*.scss', ['build-style']);
});

gulp.task('process-normalize', function() {
    var libSrc = './node_modules/normalize.css/';
    
    return gulp.src(path.join(libSrc, 'normalize.css'))
                .pipe(rename('normalize.scss'))
                .pipe(gulp.dest(path.join(libSrc, '/scss/')));
});

gulp.task('process-font-awesome', function() {
    var fontSrcGlob = './bower_components/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}';
    return gulp.src(fontSrcGlob)
                .pipe(flatten())
                .pipe(gulp.dest(path.join(DIST_WEB, '/fonts')));
});

gulp.task('process-blaze', function() {
   var libSrc = './bower_components/blaze/dist/';
   
    return gulp.src(path.join(libSrc, 'blaze.min.css'))
                .pipe(rename('blaze.scss'))
                .pipe(gulp.dest(path.join(libSrc, '/scss/')));
});

gulp.task('process-fonts', function() {
   var fontSrcGlob = './assets/fonts/**/*.{ttf,woff,woff2,eot,svg}';
   
   return gulp.src(fontSrcGlob)
                .pipe(flatten())
                .pipe(gulp.dest(path.join(DIST_WEB, '/fonts')));
});

gulp.task('process-images', function() {
   var imageSrcGlob = './assets/images/**/*.{png,jpg,jpeg}';
   
   return gulp.src(imageSrcGlob)
                .pipe(flatten())
                .pipe(gulp.dest(path.join(DIST_WEB, '/img')));
});