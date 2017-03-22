/**
 * [日志处理方法]
 * log4js 的输出级别6个: trace, debug, info, warn, error, fatal
 * created by hangyangws 2016-05-10
 */

var log4js = require('log4js');

//配置log4js的相关信息
log4js.configure({
    appenders: [{
        type: 'console',
        category: "console"
    }, {
        type: "dateFile",
        filename: __dirname + '/logs/log', //日志文件保存路径
        pattern: "_yyyy-MM-dd.txt", //日志保存的文件
        alwaysIncludePattern: true, //是否包含pattern
        category: 'dateFileLog'
    }],
    replaceConsole: true, //替换console.log
    levels: {
        dateFileLog: 'INFO'
    }
});

exports.logger = log4js.getLogger('dateFileLog');

exports.use = function(app) {
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(log4js.connectLogger(log4js.getLogger(app), { level: 'info', format: ':method :url' }));
}
