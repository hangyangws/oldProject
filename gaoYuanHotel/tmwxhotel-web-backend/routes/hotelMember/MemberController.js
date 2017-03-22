/**
 * 会员查询路由控制
 * created by Derek in 2016-03-06
 */

var express = require('express'),
    memberService = require('./MemberService'),
    member = express();

member.get("/", function(req, res) {
    memberService.list(req, res);
});

// 会员列表搜索
member.get("/search/:search", function(req, res) {
    memberService.list(req, res);
});

module.exports = member;
