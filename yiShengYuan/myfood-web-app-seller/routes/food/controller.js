/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-22.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

// 进入菜品信息页面
// http://localhost:3000/food/list?shopId=0b634702033947df83b5c9e128a96c13&device=1
router.get('/list', (req, res) => {
    service.list(req, res);
});

// 根据id删除菜品
router.delete('/del', (req, res) => {
    service.del(req, res);
});

module.exports = router;
