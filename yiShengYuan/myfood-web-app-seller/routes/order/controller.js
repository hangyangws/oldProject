/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-25.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

// 进入订单列表页面
// http://localhost:3000/order/list?ordertype=PAY&device=1&shopid=0b634702033947df83b5c9e128a96c13
// ordertype = PAY: 未处理, TAKE: 处理中, FINISH: 已完成
router.get('/list', (req, res) => {
    service.listPage(req, res);
});

router.post('/list', (req, res) => {
    service.list(req, res);
});

// 订单详情
// http://localhost:3000/order/detail?orderId=***&orderType=1&device=1
router.get('/detail', (req, res) => {
    service.detail(req, res);
});

// 订单操作
router.post('/operate', (req, res) => {
    service.operate(req, res);
});


module.exports = router;
