/**
 * 酒店房间规则管理服务
 * created by hangyangws in 2016-02-29
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global');

module.exports = {
    save: function(req, res) {
        var info = { status: false },
            RoomRuleReq = syncRequest(global.METHOD_POST, ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomStoreRule'
            ].join(''), {
                json: {
                    "roomid": req.body.roomid,
                    "startdate": req.body.startdate,
                    "enddate": req.body.enddate,
                    "store": req.body.store - 0
                }
            }),
            saveInfo = null;

        if (RoomRuleReq.statusCode === 200) {
            saveInfo = JSON.parse(RoomRuleReq.getBody('utf-8'));
            if (saveInfo.status === 201) {
                info.status = true;
            } else {
                info.msg = '保存失败，请检查日期是否重复';
            }
        } else {
            info.msg = '网络异常';
        }
        res.json(info);
    },
    get: function(req, res) {
        var info = {
                status: false,
                msg: "获取房间规则失败"
            },
            id = req.params.id,
            getReq = {},
            getInfo = '',
            roomRule = {},
            uri = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomStoreRule/',
                id
            ].join('');

        try {
            getReq = syncRequest(global.METHOD_GET, uri);
            getInfo = getReq.getBody('utf-8');
            roomRule = JSON.parse(getInfo);
            if (getReq.statusCode === 200) {
                if (roomRule.status === 200) {
                    info.status = true;
                    info.msg = '获取房间规则成功';
                    info.data = roomRule;
                } else {
                    info.msg = '获取房间规则失败';
                }
            } else {
                info.msg = '服务器异常';
            }
        } catch (e) {
            info.status = false;
            info.msg = '网络异常';
        }
        info.username = req.session.username;
        res.json(info);
    },
    update: function(req, res) {
        var info = { status: false },
            putReq = syncRequest(global.METHOD_PUT, ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomStoreRule'
            ].join(''), {
                json: {
                    "id": req.body.id,
                    "roomid": req.body.roomid,
                    "startdate": req.body.startdate,
                    "enddate": req.body.enddate,
                    "store": req.body.store - 0
                }
            }),
            putInfo = null;
        if (putReq.statusCode === 200) {
            putInfo = JSON.parse(putReq.getBody('utf-8'));
            if (putInfo.status === 205) {
                info.status = true;
            } else {
                info.msg = '库存更新失败，请检查日期是否重复';
            }
        } else {
            info.msg = '网络异常';
        }
        res.json(info);
    },
    list: function(req, res) {
        var info = { status: false },
            url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomStoreRule?parameter={',
                req.query.roomid ? 'roomid:' + req.query.roomid : '',
                '}&',
                req.query.pageSize ? 'count=' + req.query.pageSize + '&' : '',
                req.query.pageIndex ? 'pageNum=' + req.query.pageIndex : ''
            ].join(''),
            listReq = syncRequest(global.METHOD_GET, url),
            listInfo = null;

        if (listReq.statusCode === 200) {
            listInfo = JSON.parse(listReq.getBody('utf-8'));
            if (listInfo.status === 200) {
                info.status = true;
                info.data = listInfo;
            } else if (listInfo.status === 404) {
                info.status = true;
                info.msg = '没有取到任何数据';
            } else {
                info.msg = '获取房间规则失败';
            }
        } else {
            info.msg = '服务器异常';
        }
        res.json(info);
    }
}
