/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

//【首页】 什么都不展示 - 空白页
router.get("/", (req, res) => {
    service.index(req, res);
});

module.exports = router;
