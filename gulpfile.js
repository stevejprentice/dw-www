'use strict';

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    connect     = require('gulp-connect'),
    flatten     = require('gulp-flatten'),
    ghPages     = require('gulp-gh-pages'),
    minifyHTML  = require('gulp-minify-html'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass');
    
var path        = require('path'),
    git         = require('git-rev');
    
var DIST_WEB    = './dist';

gulp.task('default', ['build', 'run', 'watch']);
gulp.task('build', ['build-html', 'build-style', 'build-config']);

gulp.task('build-config', function() {
   return gulp.src('./web.config')
            .pipe(gulp.dest(DIST_WEB));
});

gulp.task('build-html', function() {
   return gulp.src('./src/index.html')
                .pipe(minifyHTML())
                .pipe(gulp.dest(DIST_WEB))
                .pipe(connect.reload());
});

gulp.task('build-style', ['process-normalize','process-font-awesome','process-fonts','process-images'], function() {
    return gulp.src('./src/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(DIST_WEB))
            .pipe(connect.reload());
});

gulp.task('build-script', [], function() {
    let libs = [
        './bower_components/page/page.js'
    ];
    
    return gulp.src(libs)
            .pipe(concat('libs.js'))
            .pipe(gulp.dest(DIST_WEB + '/script'))
            .pipe(connect.reload());
});

gulp.task('deploy', function() {
    // only deploy stable branch publically
    git.branch(function(branch) {
        if(branch === 'stable') {
            return gulp.src(DIST_WEB + '/**/*.*')
            .pipe(ghPages({
                remoteUrl: 'git@github.com:davidwesst/dw-www.git'
            }));  
        }
        else {
            console.log('only the stable branch can be deployed with this command')
        }
    });
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
    //gulp.watch('./src/**/*.ts', ['build-src']);
    gulp.watch('./src/*.html', ['build-html']);
    gulp.watch('./src/style/*.scss', ['build-style']);
});

gulp.task('process-normalize', function() {
    var libSrc = './node_modules/normalize.css/';
    
    return gulp.src(path.join(libSrc, 'normalize.css'))
                .pipe(rename('normalize.scss'))
                .pipe(gulp.dest(path.join(libSrc, '/scss/')));
});

gulp.task('process-font-awesome', function() {
   var libSrc = './node_modules/font-awesome/fonts/*';
   
   return gulp.src(libSrc)
                .pipe(gulp.dest(path.join(DIST_WEB, '/fonts')));
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