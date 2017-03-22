/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

//【订单确认页面-根据购物车生成数据】
// http://localhost:3000/order/sure?userid=userid123&device=1&userphone=18328335001&useraddr=成都
router.get("/sure", (req, res) => {
    service.sure(req, res);
});

//【在订单确认页面 - 删除订单，同时删除购物车的数据，此功能目前在页面已经屏蔽，因为订单确认页面不需要删除】
router.post("/delete", (req, res) => {
    service.delete(req, res);
});

//【订单列表页面】
// http://localhost:3000/order/list?userid=userid123&device=1&ordertype=ALL
// [ordertype 为ALL、TOBEPAID、ONGOING、FINISH  全部、待支付、进行中、已完成]
router.get("/list", (req, res) => {
    service.listpage(req, res);
});

// 【获取购订单列表】
router.post("/list", (req, res) => {
    service.list(req, res);
});

//【订单详情页面】
// http://localhost:3000/order/detail?device=1&orderid=orderid123
router.get("/detail", (req, res) => {
    service.detail(req, res);
});

//【取消订单】
router.post("/cancel", (req, res) => {
    service.cancel(req, res);
});

//【订单结算 - 需要订单id】
// http://localhost:3000/order/statement?orderid=ed6c6295f6b543088980966ac31c591c&device=1
router.get("/statement", (req, res) => {
    service.statement(req, res);
});

//【购物车页面-提交订单】
router.post("/getid", (req, res) => {
    service.getid(req, res);
});

module.exports = router;
