/**
 * 首页路由控制
 */

var express = require('express'),
    loginService = require('./LoginService'),
    login = express();

// 进入登陆页面
login.get("/", function(req, res, next) {
    loginService.init(req, res);
});

// 执行登录操作
login.post("/", function(req, res) {
    loginService.login(req, res);
});

// 获取其验证码
login.get("/captcha", function(req, res) {
    loginService.captcha(req, res);
});

// 退出登录
login.get("/logout", function(req, res) {
    loginService.logout(req, res);
});

module.exports = login;
