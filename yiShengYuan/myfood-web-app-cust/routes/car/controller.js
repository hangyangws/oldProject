/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

//【购物车页面】
// http://localhost:3000/car?userid=userid123&device=1
router.get("/", (req, res) => {
    service.index(req, res);
});

// 操作购物车数量（只支持加减）
router.post("/option", (req, res) => {
    service.option(req, res);
});

router.post("/del", (req, res) => {
    service.del(req, res);
});

module.exports = router;
