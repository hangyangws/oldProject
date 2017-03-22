/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-22.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

router.get("/", (req, res, next) => {
    service.init(req, res);
});

module.exports = router;
