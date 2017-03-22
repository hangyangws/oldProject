/**
 * 会员等级管理路由控制
 * created by hangyangws in 2016-03-04
 */

var express = require('express'),
    memberRankService = require('./MemberRankService'),
    memberRank = express();

// 会员等级首页
memberRank.get('/', function(req, res) {
    memberRankService.list(req, res);
});

// 跳转到会员等级添加页面
memberRank.get('/add', function(req, res) {
    memberRankService.add(req, res);
});

// 添加会员等级
memberRank.post('/add', function(req, res) {
    memberRankService.save(req, res);
});

// 根据id获取会员等级
memberRank.get('/get/:id', function(req, res) {
    memberRankService.get(req, res);
});

// 更新会员等级
memberRank.put('/update', function(req, res) {
    memberRankService.update(req, res);
});

module.exports = memberRank;
