/**
 * 酒店房间规则管理路由控制
 * created by hangyangws in 2016-03-04
 */

var express = require('express'),
    roomRuleService = require('./RoomRuleService'),
    roomRule = express();

// 酒店房间规则首页
roomRule.get('/', function(req, res) {
    roomRuleService.list(req, res);
});

// 添加房间规则
roomRule.post('/save', function(req, res) {
    roomRuleService.save(req, res);
});

// 获取房间规则
roomRule.get('/get/:id', function(req, res) {
    roomRuleService.get(req, res);
});

// 修改房间规则
roomRule.put('/update', function(req, res) {
    roomRuleService.update(req, res);
});

module.exports = roomRule;
