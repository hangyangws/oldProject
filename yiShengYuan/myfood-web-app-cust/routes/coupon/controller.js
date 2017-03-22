/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

//【优惠券页面】
// http://localhost:3000/coupon?type=1&userid=userid123
// [type可以为1、2、3、4，分别表示全部，未使用，已使用，已过期，默认为1]
router.get("/", (req, res) => {
    service.index(req, res);
});

//【获取优惠券列表】
router.post("/list", (req, res) => {
    service.list(req, res);
});

module.exports = router;
