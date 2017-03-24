/**
 * created by hangyangws in 2016-01-29
 */

// 模块引入
var express = require('express'),
    app = express(),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    velocity = require('velocityjs'),
    cwd = process.cwd(),
    fs = require('fs'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(session),
    log4js = require('./log/logConfig'),
    global = require('./util/global'),
    filter = require('./util/Interceptor/filter');

// 模板引擎设置（velocity）
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vm');
app.engine('vm', function(path, options, fn) {
    var template = fs.readFileSync(path).toString(),
        macros = {
            parse: function(file) {
                var template = fs.readFileSync(cwd + '/views/' + file).toString();
                return this.eval(template);
            }
        };
    try {
        fn(null, velocity.render(template, options, macros));
    } catch (err) {
        fn(err)
    }
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 配置静态文件路径
app.use(express.static(path.join(__dirname, 'public')));

//配置session
const connection = mongoose.createConnection('mongodb://' + global.HOST_SESSION_IP + '/' + global.HOST_DB);
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: connection
    })
}));

//log4js.use(app);

// 微信登录
app.use(filter.LOGIN_FILTER);

// 路由设置
require('./routes/index')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('common/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('common/error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
