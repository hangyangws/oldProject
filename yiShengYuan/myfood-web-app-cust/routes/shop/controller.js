/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

//【店铺页】
// http://localhost:3000/shop?shopid=0b634702033947df83b5c9e128a96c13&distance=123&userid=userid123&device=1
router.get("/", (req, res) => {
    service.index(req, res);
});

module.exports = router;
