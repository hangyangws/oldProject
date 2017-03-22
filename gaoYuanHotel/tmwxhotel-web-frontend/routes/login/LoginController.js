/**
 * 微信登录
 * created by hangyangws in 2016-01-29
 */

var express = require('express'),
    login = express(),
    loginService = require('./LoginService');

login.get("/", function(req, res, next) {
    loginService.index(req, res);
});

login.get("/loginCallback", function(req, res, next) {
    loginService.loginCallback(req, res);
});

login.get("/login", function(req, res, next) {
    loginService.login(req, res);
});

module.exports = login;
