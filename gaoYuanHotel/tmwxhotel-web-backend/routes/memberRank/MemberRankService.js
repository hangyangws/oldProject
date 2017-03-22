/**
 * 会员等级管理服务
 * created by hangyangws in 2016-03-04
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    add: function(req, res) {
        var info = {
            username: req.session.username
        };
        res.render('memberRank/add', info);
    },
    save: function(req, res) {
        try {
            var saveHotelMemberRankReq = {},
                saveInfo = {},
                uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelMemberRank'].join(''),
                options = {
                    json: {
                        "isdefault": req.body.isdefault === 'true' ? true : false, //是否是默认等级，只允许一个默认等级
                        "name": req.body.name, //会员等级名称，不能重复
                        "point": req.body.point, //等级起始积分，不能重复
                        "preferentialscale": req.body.preferentialscale, //会员折扣
                        "description": req.body.description //描述

                    }
                },
                info = {
                    status: false,
                    msg: '保存失败'
                };
            saveHotelMemberRankReq = syncRequest(global.METHOD_POST, uri, options);
            saveInfo = JSON.parse(saveHotelMemberRankReq.getBody('utf-8'));
            if (saveHotelMemberRankReq.statusCode == 200) {
                if (saveInfo.status == 201) {
                    info.status = true;
                    info.msg = '保存成功';
                } else if (saveInfo.status == 415 || saveInfo.status == 404) {
                    info.msg = saveInfo.message;
                }
            } else {
                info.msg = '网络异常';
            }
        } catch (e) {
            console.log(e);
            logger.error('服务器异常:' + e);
            info.msg = '服务器异常';
        }
        res.json(info);
    },
    get: function(req, res) {
        var info = {
                status: false,
                msg: "获取会员等级失败"
            },
            id = req.params.id,
            getReq = {},
            getInfo = '',
            hotel = {},
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelMemberRank/' + id].join('');

        try {
            getReq = syncRequest(global.METHOD_GET, uri);
            getInfo = getReq.getBody('utf-8');
            hotel = JSON.parse(getInfo);
            if (getReq.statusCode == 200) {
                if (hotel.status == 200) {
                    info.status = true;
                    info.msg = '获取会员等级成功';
                    info.data = hotel;
                } else {
                    info.msg = '获取会员等级失败';
                }
            } else {
                info.msg = '服务器异常';
            }
        } catch (e) {
            info.status = false;
            info.msg = '网络异常';
        }
        info.username = req.session.username;
        res.render('memberRank/add', info); //跳转到页面 （转发）
    },
    update: function(req, res) {
        var info = {
                status: false,
                msg: '更新会员等级失败'
            },
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelMemberRank'].join(''),
            options = {
                json: {
                    "id": req.body.id,
                    "isdefault": req.body.isdefault === 'true' ? true : false, //是否是默认等级，只允许一个默认等级
                    "name": req.body.name, //会员等级名称，不能重复
                    "point": req.body.point, //等级起始积分，不能重复
                    "preferentialscale": req.body.preferentialscale, //会员折扣
                    "description": req.body.description //描述
                }
            },
            putReq = {},
            putInfo = '',
            putBrand = {};

        try {
            putReq = syncRequest(global.METHOD_PUT, uri, options);
            putInfo = JSON.parse(putReq.getBody('utf-8'));
            if (putReq.statusCode == 200) {
                if (putInfo.status == 205) {
                    info.status = true;
                    info.msg = '更新会员等级成功';
                } else if (putInfo.status == 415 || putInfo.status == 404) {
                    info.msg = putInfo.message;
                }
            } else {
                info.msg = '网络异常';
            }
        } catch (e) {
            logger.error('服务器异常:' + e);
            info.msg = '服务器异常';
        }
        res.json(info);
    },
    list: function(req, res) {
            var info = {
                    status: false,
                    username: req.session.username
                },
                pageIndex = req.query.pageIndex,
                pageSize = req.query.pageSize,
                apiUrl = '',
                uri = '',
                listReq = {},
                listReqStr = '',
                listBrand = {},
                listInfo = {},
                tmpObj = {};
            apiUrl = '/api/hotelMemberRank/';
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, apiUrl].join('');
            if (req.query.isPage === "false") {
                uri += '?isPage=false';
            } else {
                if (pageIndex && pageSize) {
                    uri = uri + '?pageNum=' + pageIndex + '&count=' + pageSize;
                } else if (pageIndex && !pageSize) {
                    uri = uri + '?pageNum=' + pageIndex;
                } else if (!pageIndex && pageSize) {
                    uri = uri + '?count=' + pageSize
                }
            }

            listReq = syncRequest(global.METHOD_GET, uri);
            listInfo = JSON.parse(listReq.getBody('utf-8'));
            if (listReq.statusCode == 200) {
                if (listInfo.status == 200) {
                    info.status = true;
                    info.msg = '获取数据正常';
                    info.data = listInfo;
                } else if (listInfo.status == 404) {
                    info.status = true;
                    info.msg = '没有取到任何数据';
                } else {
                    info.msg = listInfo.message || '';
                }
            } else {
                info.msg = '服务器异常';
            }

            if (req.query.isPage === "false") {
                res.json(info);
            } else {
                res.render('memberRank/index', info);
            }
        }
        /* delete: function(req, res) {
             var id = req.params.id,
                 info = {
                     status: false,
                     msg: "删除会员等级失败"
                 },
                 deleteReq = {},
                 uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotelBrand/' + id].join(''),
                 deleteInfo = '',
                 deleteBrand = {};

             deleteReq = syncRequest(global.METHOD_DELETE, uri);
             deleteInfo = deleteReq.getBody('utf-8');
             deleteBrand = JSON.parse(deleteInfo);
             if (deleteReq.statusCode == 200) {
                 if (deleteBrand.status == 205) {
                     info.status = true;
                     info.msg = '删除会员等级成功';
                 }
             } else {
                 info.status = false;
                 info.msg = '网络异常';
             }
             res.json(info);
         }*/
}
