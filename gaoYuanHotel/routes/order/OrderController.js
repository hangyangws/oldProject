/**
 * cheated by hangyangws in 2016-03-06
 */

var express = require('express'),
    order = express(),
    orderService = require('./OrderService'),
    WXPay = require('weixin-pay'),
    fs = require('fs'),
    payConf = require('../../util/payConf'),
    wxpay = WXPay({
        appid: payConf.WX_APPID,
        mch_id: payConf.WX_MCH_ID,
        partner_key: payConf.WX_MCH_KEY
        // pfx: fs.readFileSync(payConf.WX_PFX_PATH)
    });

// 订单生成
order.post('/', function(req, res) {
    orderService.save(req, res);
});

// 微信支付回调
order.post('/wxpay/notify', wxpay.useWXCallback(function(msg, req, res, next) {
    // 处理商户业务逻辑
    console.log('callback::' + JSON.stringify(msg));
    // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    console.log('===' + req.url);
    orderService.wxCallback(msg, res);
}));

// 个人中心 待付款
order.post('/wxpay/pay', function(req, res) {
    orderService.getBrandWCPayRequestParams({
        hotelname: req.body.hotelname,
        roomname: req.body.roomname,
        indate: req.body.indate,
        outdate: req.body.outdate,
        roomordersn: req.body.roomordersn,
        paymenttotalamount: req.body.paymenttotalamount,
        spbill_create_ip: req.body.spbill_create_ip
    }, req, res);
});

module.exports = order;
