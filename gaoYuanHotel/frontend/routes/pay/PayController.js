/**
 * 商城微信支付
 * created by hangyangws in 2016-05-25
 */

var express = require('express'),
    pay = express(),
    payService = require('./PayService'),
    payConf = require('../../util/payConf'),
    wxPay = require('weixin-pay')({
        appid: payConf.WX_APPID,
        mch_id: payConf.WX_MCH_ID,
        partner_key: payConf.WX_MCH_KEY,
        pfx: require('fs').readFileSync(payConf.WX_PFX_PATH)
    });

// 发起支付
pay.get("/", function(req, res, next) {
    payService.pay(req, res);
});

// 支付回调通知
pay.post("/notify", wxPay.useWXCallback(function(msg, req, res, next) {
    payService.notify(msg, res);
}));

module.exports = pay;
