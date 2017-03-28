/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-02-23.
 */

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    frontendWatch = [
        './html/**/*.html',
        './static/**/*.*'
    ];

// 浏览器自动刷新（当静态文件和视图文件改变的时候）
gulp.task('sync', function() {
    browserSync.init({
        server: {
            baseDir: "."
        }
    });
    gulp.watch(frontendWatch).on('change', browserSync.reload);
});

// 默认任务
gulp.task('default', ['sync']);
