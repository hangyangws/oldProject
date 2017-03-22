/**
 * ======================================================
 * coolie-cli 配置文件 `coolie.config.js`
 * https://coolie.ydr.me/document/coolie.config.js/
 * 当前配置文件所在的目录为构建的根目录
 *
 * @author hangyangws
 * =======================================================
 */

'use strict';

module.exports = function(coolie) {
    // coolie 配置
    coolie.config({
        // 是否清空目标目录，默认为 true
        clean: true,

        // 目标配置
        dest: {
            // 目标目录，相对于当前文件
            dirname: '../pages/',
            // 目标根域
            host: '$ctx/pages',
            // 版本号长度
            versionLength: 8
        },

        // js 构建
        js: {
            dest: './static/js/',
            // 分块配置
            chunk: [],
            // js 压缩配置
            minify: {
                global_defs: {
                    DEBUG: false
                }
            }
        },

        // html 构建
        html: {
            // html 文件，相对于当前文件
            src: [
                // 支持 glob 语法
                './html/**/*.html'
            ],
            // html 压缩配置
            minify: true
        },

        // css 构建
        css: {
            // css 文件保存目录，相对于 dest.dirname
            dest: './static/css/',
            // 保留断行，默认false
            // keepBreaks: false,
            // 保留特殊注释
            // *: 全部注释
            // 1: 头部注释
            // 0: 无注释
            keepSpecialComments: '0',
            // css 压缩配置
            minify: true,
        },

        // 资源 构建
        resource: {
            // 资源保存目录，相对于 dest.dirname
            dest: './static/res/',
            // 是否压缩
            minify: true
        },

        // 原样复制文件，相对于当前文件
        copy: [
            // 支持 glob 语法
            // './favicon.ico'
        ]
    });

    // 使用 coolie 中间件
    // coolie.use(require('coolie-*'));

    // 自定义 coolie 中间件
    coolie.use(function(options) {
        if (options.progress !== 'post-html') {
            return options;
        }
        options.code = options.code.replace('<!--coolie built-->', '');
        var data = new Date(),
            str = '<!--Constructed in {year}-{month}-{day} {time} by hangyangws(AsiaInfo In ChengDu)-->'
            .replace('{year}', data.getFullYear())
            .replace('{month}', data.getMonth() + 1)
            .replace('{day}', data.getDate())
            .replace('{time}', data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds());
        options.code += str;
        return options;
    });
};
