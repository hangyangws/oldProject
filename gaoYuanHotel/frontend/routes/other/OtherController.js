/**
 * 个人中心
 * created by hangyangws in 2016-03-25
 */

var express = require('express'),
    router = express(),
    other = require('./OtherService');

router.get('/shop', function(req, res) {
    other.init(req, res);
});

module.exports = router;
