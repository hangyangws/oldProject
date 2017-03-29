/**
 * [created by hangyangws in 2016-03-02]
 * @type {[Obj]}
 */

var express = require('express'),
    roomService = require('./RoomService'),
    room = express();

// 酒店房间首页
room.get('/', function(req, res) {
    roomService.list(req, res);
});

room.get('/search/:search', function(req, res) {
    roomService.list(req, res);
});

// 跳转房间添加页面
room.get('/add', function(req, res) {
    roomService.add(req, res);
});

// 添加房间
room.post('/add', function(req, res) {
    roomService.save(req, res);
});

// 根据id获取房间
room.get('/add/:id', function(req, res) {
    roomService.get(req, res);
});

// 更新房间
room.put('/update', function(req, res) {
    roomService.update(req, res);
});

// 房间删除
room.delete('/:id', function(req, res) {
    roomService.delete(req, res);
});

// 获取房间会员信息
room.post('/getMemberRank', function(req, res) {
    roomService.getMemberRank(req, res);
});

// 更新或者新增房间会员价格
room.post('/priceUpdate', function(req, res) {
    roomService.priceUpdate(req, res);
});

// 删除房间会员价格
room.post('/priceDelete', function(req, res) {
    roomService.priceDelete(req, res);
});

module.exports = room;
