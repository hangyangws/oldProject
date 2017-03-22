/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    service = require('./service');

//【首页】
// http://localhost:3000/food/index?s_applongitude=104.0689273239869&s_applatitude=30.551726194483575&device=1
// 备注：[s_applongitude 表示经度 ，s_applatitude表示纬度(纬度不能超过90度)]
router.get("/index", (req, res) => {
    service.index(req, res);
});

//【POST搜索菜品】根据body请求信息（经度、纬度、搜索信息、菜品分类）获取菜品列表
router.post("/list", (req, res) => {
    service.list(req, res);
});

//【搜索页】
// http://localhost:3000/food/search?s_applongitude=104.0689273239869&s_applatitude=30.551726194483575&search=肉
// 备注：[s_applongitude 表示经度 ，s_applatitude表示纬度(纬度不能超过90度)]
router.get("/search", (req, res) => {
    service.search(req, res);
});

//【菜品详情页】
// http://localhost:3000/food/detail?foodid=84eb17b6a6d14af2a50f1334372cb9da&userid=userid123&device=1
router.get("/detail", (req, res) => {
    service.detail(req, res);
});

module.exports = router;
