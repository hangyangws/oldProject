/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

//【在线付款支付】
router.get("/", (req, res) => {
    service.index(req, res);
});

//【货到付款支付】
router.post("/", (req, res) => {
    service.cash(req, res);
});

//【支付宝同步返回界面】
router.get("/return", (req, res) => {
    service.return(req, res);
});

//【货到付款回调页面】
router.get("/cashReturn", (req, res) => {
    service.cashReturn(req, res);
});

//【支付宝自动通知页面 - 回调记账 - 此功能已经被'支付宝同步返回界面'代替，暂时无用】
// router.post("/notify", (req, res) => {
//     service.notify(req, res);
// });

module.exports = router;
