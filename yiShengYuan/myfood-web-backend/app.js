/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-16.
 */

// 模块引入
var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    velocity = require('velocityjs'),
    fs = require('fs'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(session),
    conf = require('./conf/conf');

// 模板引擎设置（velocity）
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', function(path, options, fn) {
    var template = fs.readFileSync(path).toString(),
        macros = {
            parse: function(file) {
                var template = fs.readFileSync(process.cwd(), + '/views/' + file).toString();
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
app.use(express.static(path.join(__dirname, conf.staticSrc)));

//配置 session (mongodb)
app.use(session({
    secret: conf.appName,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.createConnection('mongodb://' + conf.HOST_SESSION_IP + '/' + conf.HOST_DB)
    })
}));

// 路由设置
require('./routes/index')(app);

// 404
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
