/**
 * 首页路由控制
 * Created by Peter.D.Wang on 2016/1/29.
 */

var express = require('express'),
    router = express.Router(),
    indexService = require('./IndexService');

router.get("/", function(req, res, next) {
    indexService.init(req, res);
});

module.exports = router;
