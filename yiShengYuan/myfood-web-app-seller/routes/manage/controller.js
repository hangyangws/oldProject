/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-08.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

// 进入管理首页
// http://localhost:3000/manage/index?shopid=0b634702033947df83b5c9e128a96c13&device=1
router.get('/index', (req, res) => {
    service.index(req, res);
});

// 店铺操作（提现和修改营业状态）
router.post('/operate', (req, res) => {
    service.operate(req, res);
});

// 订单预览
// 路由http://localhost:3000/manage/order?shopId=4dbe7685ee9c4622a3e196781bacb143
router.get('/order', (req, res) => {
    service.order(req, res);
});

module.exports = router;
