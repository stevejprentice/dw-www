var gulp        = require('gulp'),
    connect     = require('gulp-connect'),
    minifyHTML  = require('gulp-minify-html');
    
var DIST_WEB    = './dist';

gulp.task('default', ['build-web', 'run', 'watch']);
gulp.task('build-web', ['build-html']);

gulp.task('build-html', function() {
   return gulp.src('./src/index.html')
                .pipe(minifyHTML())
                .pipe(gulp.dest(DIST_WEB))
                .pipe(connect.reload());
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
    //gulp.watch('./src/style/*.scss', ['build-style']);
});