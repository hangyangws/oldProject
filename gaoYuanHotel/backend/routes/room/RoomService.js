/**
 * [created by hangyangws in 2016-02-29]
 * @type {[Obj]}
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    add: function(req, res) {
        var info = {
            username: req.session.username
        };
        res.render('room/add', info);
    },
    save: function(req, res) {
        try {
            var saveHotelRoomReq = {},
                saveInfo = {},
                uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelRoom'].join(''),
                options = {
                    json: {
                        "ismarketable": req.body.ismarketable === 'true' ? true : false, //是否上架
                        "price": req.body.price - 0, //价格
                        "name": req.body.name, //房间名称
                        "imagepath": req.body.imagepath, //图片地址
                        "isbreakfast": req.body.isbreakfast === 'true' ? true : false, //是否含早
                        "hotelid": req.body.hotelid, //酒店id
                        "introduction": req.body.introduction, //房间介绍
                        "buyearnpoint": req.body.buyearnpoint - 0, //积分
                        "store": req.body.store - 0 //默认库存
                    }
                },
                info = {
                    status: false,
                    msg: '保存失败'
                };
            saveHotelRoomReq = syncRequest(global.METHOD_POST, uri, options);
            saveInfo = JSON.parse(saveHotelRoomReq.getBody('utf-8'));
            if (saveHotelRoomReq.statusCode == 200) {
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
            logger.error('服务器异常:' + e);
            info.msg = '服务器异常';
        }
        res.json(info);
    },
    get: function(req, res) {
        var info = {
                status: false,
                msg: "获取房间失败"
            },
            id = req.params.id,
            getReq = {},
            getInfo = '',
            hotel = {},
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelRoom/' + id].join(''),
            standardImg = '',
            tempUrl = '',
            tempImagepath = [];

        try {
            getReq = syncRequest(global.METHOD_GET, uri);
            getInfo = getReq.getBody('utf-8');
            hotel = JSON.parse(getInfo);
            if (getReq.statusCode == 200) {
                if (hotel.status == 200) {
                    /*standardImg = JSON.parse(hotel.data.imagepath).standard;
                    if (standardImg) {
                        for (var obj in standardImg) {
                            var _img_name = '',
                                _img_ext = '',
                                tmp = '',
                                _tmp = {};
                            tmp = obj + '';
                            _img_name = tmp.substring(0, tmp.lastIndexOf('_') + 1);
                            _img_ext = tmp.substring(tmp.lastIndexOf('.') - 1);
                            tempUrl = global.FILE_URL + global.FILE_UPLOAD_DIR + '/' + obj;
                            _tmp.tmpurl = tempUrl;
                            tempImagepath.push(_tmp);
                        }
                    }
                    hotel.data.tempImagepath = tempImagepath;*/
                    info.status = true;
                    info.msg = '获取房间成功';
                    info.data = hotel;
                } else {
                    info.msg = '获取房间失败';
                }
            } else {
                info.msg = '服务器异常';
            }
        } catch (e) {
            console.log('==' + e);
            info.status = false;
            info.msg = '网络异常';
        }
        console.log("====================" + JSON.stringify(info));
        info.username = req.session.username;
        res.render('room/add', info);
    },
    update: function(req, res) {
        var info = {
                status: false,
                msg: '更新房间失败'
            },
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelRoom'].join(''),
            options = {
                json: {
                    "id": req.body.id,
                    "ismarketable": req.body.ismarketable === 'true' ? true : false, //是否上架
                    "price": req.body.price - 0, //价格
                    "name": req.body.name, //房间名称
                    "imagepath": req.body.imagepath, //图片地址
                    "isbreakfast": req.body.isbreakfast === 'true' ? true : false, //是否含早
                    "hotelid": req.body.hotelid, //酒店id
                    "introduction": req.body.introduction, //房间介绍
                    "buyearnpoint": req.body.buyearnpoint - 0, //积分
                    "store": req.body.store - 0 //默认库存
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
                    info.msg = '更新房间成功';
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
                username: req.session.username,
                // 回写页面
                search: req.params.search ? req.params.search : '',
                hotelid: req.query.hotelid ? req.query.hotelid : '',
                isbreakfast: req.query.isbreakfast ? req.query.isbreakfast : '',
                ismarketable: req.query.ismarketable ? req.query.ismarketable : ''
            },
            url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoom/search/',
                // 搜索内容 double encodeURI
                encodeURI(encodeURI(info.search)),
                '?',
                info.hotelid ? ('hotelid=' + info.hotelid + '&') : '',
                info.ismarketable ? ('ismarketable=' + info.ismarketable + '&') : '',
                info.isbreakfast ? ('isbreakfast=' + info.isbreakfast + '&') : ''
            ],
            listReq = null,
            listInfo = null;

        // 是否分页
        if (req.query.isPage === 'false') {
            url.push('isPage=false');
        } else {
            req.query.pageSize && url.push('count=' + req.query.pageSize + '&');
            req.query.pageIndex && url.push('pageNum=' + req.query.pageIndex);
        }

        listReq = syncRequest(global.METHOD_GET, url.join(''));
        if (listReq.statusCode === 200) {
            listInfo = JSON.parse(listReq.getBody('utf-8'));
            if (listInfo.status === 200) {
                info.status = true;
                info.msg = '获取数据正常';
                info.data = listInfo;
            } else if (listInfo.status === 404) {
                info.msg = '没有取到任何数据';
            } else {
                info.msg = '服务器异常';
            }
        } else {
            info.msg = '服务器异常';
        }

        if (req.query.isPage === 'false') {
            res.json(info);
        } else {
            res.render('room/index', info);
        }
    },
    delete: function(req, res) {
        var url = [
                'http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoom/',
                req.params.id
            ].join(''),
            _info = { status: false },
            reqRespons = syncRequest(global.METHOD_DELETE, url),
            reqCon = JSON.parse(reqRespons.getBody('utf-8'));

        if (reqRespons.statusCode === 200) {
            if (reqCon.status === 205) {
                _info.status = true;
                _info.msg = '房间删除成功';
            } else if (reqCon.status === 415) {
                _info.msg = '该房间已设置规则或已被预订过，不能删除';
            } else {
                _info.msg = '删除失败';
            }
        } else {
            _info.msg = '网络堵塞';
        }

        res.json(_info);
    },
    getMemberRank: function(req, res) {
        var info = { status: false },
            url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomMemberRank?',
                'parameter={"roomid":"',
                req.body.roomid,
                '"}'
            ],
            listReq = syncRequest(global.METHOD_GET, url.join('')),
            listInfo = JSON.parse(listReq.getBody('utf-8'));
        if (listReq.statusCode === 200) {
            if (listInfo.status === 200) {
                info.status = true;
                info.msg = '操作成功';
                info.data = listInfo.data.list;
            } else if (listInfo.status === 404) {
                info.status = true;
                info.msg = '没有取到任何数据';
            } else {
                info.msg = listInfo.message || '';
            }
        } else {
            info.msg = '服务器异常';
        }
        res.json(info);
    },
    priceUpdate: function(req, res) {
        var info = { status: false },
            _method = req.body.type === 'update' ? global.METHOD_PUT : global.METHOD_POST,
            _ok_status = req.body.type === 'update' ? 205 : 201,
            _body = {
                "price": +req.body.price,
                "roomid": req.body.roomid,
                "memberrankid": req.body.memberrankid
            },
            url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomMemberRank'
            ],
            listReq = null,
            listInfo = null;

        req.body.type === 'update' && (_body.id = req.body.id);
        listReq = syncRequest(_method, url.join(''), {
            json: _body
        });
        listInfo = JSON.parse(listReq.getBody('utf-8'));
        if (listReq.statusCode === 200) {
            if (listInfo.status === _ok_status) {
                info.status = true;
                if (req.body.type === 'add') {
                    // 返回的会员等级id
                    info.id = listInfo.data.id;
                }
            } else {
                info.msg = listInfo.message || '';
            }
        } else {
            info.msg = '服务器异常';
        }
        res.json(info);
    },
    priceDelete: function(req, res) {
        var info = { status: false },
            url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomMemberRank/',
                req.body.id
            ],
            listReq = null,
            listInfo = null;
        listReq = syncRequest(global.METHOD_DELETE, url.join(''));
        listInfo = JSON.parse(listReq.getBody('utf-8'));
        if (listReq.statusCode === 200) {
            if (listInfo.status === 205) {
                info.status = true;
            } else {
                info.msg = listInfo.message || '';
            }
        } else {
            info.msg = '服务器异常';
        }
        res.json(info);
    }
}
