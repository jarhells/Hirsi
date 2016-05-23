var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: '../app',
    port: 4000
  });
});

gulp.task('default', ['connect']);
gulp.task('build-client', ['connect']);
