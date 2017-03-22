/**
 * 房间订单 路由控制
 * created by hangyangws in 2016-04-23
 */

var express = require('express'),
    roomOrderService = require('./RoomOrderService'),
    roomOrder = express();

// 酒店房间订单首页
roomOrder.get('/', function(req, res) {
    roomOrderService.list(req, res);
});

roomOrder.get('/search/:search', function(req, res) {
    roomOrderService.list(req, res);
});

// 入住
roomOrder.post('/modifyOrder', function(req, res) {
    roomOrderService.modifyOrder(req, res);
});

// 获取订单日志
roomOrder.post('/getLog', function(req, res) {
    roomOrderService.getLog(req, res);
});

module.exports = roomOrder;
