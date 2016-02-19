var gulp        = require('gulp'),
    connect     = require('gulp-connect'),
    ghPages     = require('gulp-gh-pages'),
    minifyHTML  = require('gulp-minify-html'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass');
    
var path        = require('path');
    
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

gulp.task('build-style', ['process-normalize'], function() {
    return gulp.src('./src/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(DIST_WEB))
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
    //gulp.watch('./src/**/*.ts', ['build-src']);
    gulp.watch('./src/*.html', ['build-html']);
    gulp.watch('./src/style/*.scss', ['build-style']);
});

gulp.task('process-normalize', function() {
    var libSrc = './node_modules/normalize.css/normalize.css';
    
    return gulp.src(libSrc)
                .pipe(rename('_normalize.scss'))
                .pipe(gulp.dest(path.join('./src/style/')));
});