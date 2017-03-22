/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-xx-xx.
 */

var express = require('express'),
    router = express.Router(),
    indexService = require('./service');

router.get("/", function(req, res, next) {
    indexService.init(req, res);
});

module.exports = router;
