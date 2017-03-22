/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-20.
 */

var gulp = require('gulp'),
    clean = require('gulp-clean'), // 文件清理
    minifycss = require('gulp-minify-css'), // css 压缩
    uglify = require('gulp-uglify'), // js 压缩
    concat = require('gulp-concat'), // 文件合并
    browserSync = require('browser-sync').create(), // 浏览器刷新
    conf = require('./conf/conf'), // 项目配置文件
    myPath = { // 路径参数
        clearPath: [
            conf.staticSrc + '/dist/css',
            conf.staticSrc + '/dist/js'
        ],
        fromCSS: conf.staticSrc + '/css/*.css',
        toCSS: conf.staticSrc + '/dist/css',
        concatFromCSS: [
            conf.staticSrc + '/css/base.css',
            conf.staticSrc + '/css/public.css'
        ],
        concatFromJS: [
            conf.staticSrc + '/js/zepto.js',
            conf.staticSrc + '/js/public.js'
        ],
        concatToCSS: conf.staticSrc + '/css',
        concatToJS: conf.staticSrc + '/js',
        fromJS: conf.staticSrc + '/js/*.js',
        toJS: conf.staticSrc + '/dist/js',
        frontendWatch: [
            'views/**/*.html',
            'routes/**/*.js',
            'routes/index.js',
            conf.staticSrc + '/img/*.*',
            conf.staticSrc + '/dist/css/*.css',
            conf.staticSrc + '/dist/js/*.js'
        ]
    };

// 执行压缩前，先删除文件夹里的内容
gulp.task('clean', function() {
    return gulp.src(myPath.clearPath, { read: false }).pipe(clean());
});

// CSS 合并
gulp.task('concatCSS', function() {
    return gulp.src(myPath.concatFromCSS)
        .pipe(concat('base-pub.css'))
        .pipe(gulp.dest(myPath.concatToCSS));
});

// CSS 压缩
gulp.task('minCSS', ['concatCSS'], function() {
    return gulp.src(myPath.fromCSS) // 源文件
        .pipe(minifycss()) // 执行压缩
        .pipe(gulp.dest(myPath.toCSS)); // 输出文件
});

// JavaScript 合并
gulp.task('concatJS', function() {
    return gulp.src(myPath.concatFromJS)
        .pipe(concat('lib-pub.js'))
        .pipe(gulp.dest(myPath.concatToJS));
});

// JavaScript 压缩
gulp.task('minJS', ['concatJS'], function() {
    return gulp.src(myPath.fromJS) // 需要操作的文件
        .pipe(uglify()) // 压缩
        .pipe(gulp.dest(myPath.toJS)); // 输出
});

// 监听js css 文件改动
gulp.task('watch', function() {
    gulp.watch(myPath.fromCSS, ['minCSS']);
    gulp.watch(myPath.fromJS, ['minJS']);
});

// 浏览器自动刷新（当静态文件和视图文件改变的时候）
gulp.task('sync', function() {
    browserSync.init({
        proxy: '127.0.0.1:' + conf.PORT
    });
    gulp.watch(myPath.frontendWatch).on('change', browserSync.reload);
});

// 默认任务
gulp.task('default', ['clean', 'sync'], function() {
    gulp.start('minCSS', 'minJS', 'watch');
});
