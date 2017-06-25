/**
 * created by hangyangws in 2016-03-03
 */

var express = require('express'),
    router = express(),
    userService = require('./UserService');

router.get('/orders', function(req, res) {
    userService.getOrderList(req, res);
});

// 查看积分列表
router.get('/point', function(req, res) {
    userService.getPointList(req, res);
});

// 用户申请退款
router.post('/refund', function(req, res) {
    userService.refund(req, res);
});

module.exports = router;
