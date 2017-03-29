/**
 * 酒店类型管理路由控制
 * created by hangyangws in 2016-02-24.
 */

var express = require('express'),
    hotelService = require('./HotelService'),
    hotel = express();

// 酒店首页
hotel.get('/', function(req, res) {
    hotelService.list(req, res);
});

hotel.get('/search/:search', function(req, res) {
    hotelService.list(req, res);
});

// 跳转酒店添加页面
hotel.get('/add', function(req, res) {
    hotelService.add(req, res);
});

// 添加酒店
hotel.post('/add', function(req, res) {
    hotelService.save(req, res);
});

// 修改酒店页面跳转
hotel.get('/get/:id', function(req, res) {
    hotelService.get(req, res);
});

// 修改酒店
hotel.put('/update', function(req, res) {
    hotelService.update(req, res);
});

// 删除酒店
hotel.delete('/:id', function(req, res) {
    hotelService.delete(req, res);
});

module.exports = hotel;
