/**
 * created by hangyangws in 2016-03-04
 */

var express = require('express'),
    hotel = express(),
    searchService = require('./SearchHotelService');

// 根据品牌,城市,入住时间,离店时间获取有房的酒店
hotel.get('/', function(req, res) {
    searchService.search(req, res);
});

// 根据酒店id获取酒店详情
hotel.get('/details/:hotelid', function(req, res) {
    searchService.details(req, res);
});

hotel.get('/user', function(req, res) {
    searchService.toUser(req, res);
});

module.exports = hotel;
