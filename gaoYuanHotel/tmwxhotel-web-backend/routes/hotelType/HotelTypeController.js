/**
 * 酒店品牌管理路由控制
 * created by hangyangws in 2016-02-24.
 */
var express = require('express'),
    hotelTypeService = require('./HotelTypeService'),
    hotelType = express();

// 品牌列表（首页）
hotelType.get("/", function(req, res) {
    hotelTypeService.list(req, res);
});

// 品牌列表搜索
hotelType.get("/search/:search", function(req, res) {
    hotelTypeService.list(req, res);
});

// 跳转添加品牌页面
hotelType.get("/add", function(req, res) {
    hotelTypeService.add(req, res);
});

// 添加品牌
hotelType.post("/add", function(req, res) {
    hotelTypeService.save(req, res);
});

// 删除品牌
hotelType.delete("/:id", function(req, res) {
    hotelTypeService.delete(req, res);
});

// 更新品牌
hotelType.put("/update", function(req, res) {
    hotelTypeService.update(req, res);
});

// 根据id获取品牌
hotelType.get("/getBrand/:id", function(req, res) {
    hotelTypeService.get(req, res);
});

module.exports = hotelType;
