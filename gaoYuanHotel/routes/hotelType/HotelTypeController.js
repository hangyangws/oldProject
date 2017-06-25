/**
 * 酒店类型选择路由控制
 * Created by hangyangws in 2016-02-23.
 */

var express = require('express'),
    brand = express(),
    hoteltyleService = require('./HotelTypeService');

// 跳转到品牌列表页
brand.get("/", function(req, res) {
    hoteltyleService.list(req, res);
});

// 根据品牌id获取该品牌下的酒店所在城市列表
brand.get('/getCity/:brandid', function(req, res) {
    hoteltyleService.getCity(req, res);
});

module.exports = brand;
