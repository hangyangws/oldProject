/**
 * [微信退款 created by hangyangws in 2016-04-20]
 */

var express = require('express'),
    refund = express(),
    refundService = require('./RefundService');

// 微信 申请退款 and 拒绝退款
refund.post("/applyDeal", function(req, res) {
    console.log('=====================================');
    console.log(req.body.type);
    if (req.body.type === 'refuse') {
        refundService.refuse(req, res);
    } else {
        refundService.apply(req, res);
    }
});

// 微信查询退款(查询退款的状态)
refund.get("/query", function(req, res) {
    refundService.query(req, res);
});

// 退款列表查询
refund.get('/list', function(req, res) {
    refundService.list(req, res);
});

module.exports = refund;
