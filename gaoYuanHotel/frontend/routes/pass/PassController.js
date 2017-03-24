/**
 * 微信登录
 * created by hangyangws in 2016-01-29
 */

var express = require('express'),
    pass = express(),
    passService = require('./PassService');

pass.post('/set', function(req, res, next) {
    passService.set(req, res);
});

pass.post('/get', function(req, res, next) {
    passService.get(req, res);
});

module.exports = pass;
