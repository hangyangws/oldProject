/**
 * 日志处理方法
 * log4js的输出级别6个: trace, debug, info, warn, error, fatal
 * Created by yzb2b on 15-1-20.
 */

var log4js = require('log4js');
//配置log4js的相关信息
log4js.configure({
    appenders: [{
            type: 'console',
            category: "console"
        }, //控制台输出
        {
            type: "dateFile",
            filename: __dirname + '/logs/log', //日志文件保存路径
            pattern: "_yyyy-MM-dd.txt", //日志保存的文件
            alwaysIncludePattern: true, //是否包含pattern
            category: 'dateFileLog'
        } //日期文件格式输出
    ],
    replaceConsole: true, //替换console.log
    levels: {
        dateFileLog: 'INFO'
    }
});

var dateFileLog = log4js.getLogger('dateFileLog');

exports.logger = dateFileLog;

exports.use = function(app) {
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(log4js.connectLogger(log4js.getLogger(app), { level: 'info', format: ':method :url' }));
}
