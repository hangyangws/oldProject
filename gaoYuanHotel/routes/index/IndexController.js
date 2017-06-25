/**
 * 首页路由控制
 * created hy hangyagnws in 2016-03-01
 */

var express = require('express'),
    index = express.Router(),
    indexService = require('./IndexService');

index.get("/", function(req, res, next) {
    indexService.init(req, res);
});

index.get("/login", function(req, res, next) {
    res.render('login');
});

module.exports = index;
