/**
 * 酒店管理服务
 * created by hangyangws in 2016-02-24
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    add: function(req, res) {
        var info = {
            username: req.session.username
        };
        res.render('hotel/add', info);
    },
    save: function(req, res) {
        try {
            var saveHotelReq = {},
                saveInfo = {},
                uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotel'].join(''),
                options = {
                    json: {
                        "name": req.body.name,
                        "imagepath": req.body.imagepath,
                        "country": req.body.country,
                        "province": req.body.province,
                        "city": req.body.city,
                        "district": req.body.district === 'null' ? '' : req.body.district,
                        "hotelbrandid": req.body.hotelbrandid,
                        "star": req.body.star || 5,
                        "phone": req.body.phone,
                        "address": req.body.address
                    }
                },
                info = {
                    status: false,
                    msg: '保存失败'
                };
            saveHotelReq = syncRequest(global.METHOD_POST, uri, options);
            saveInfo = JSON.parse(saveHotelReq.getBody('utf-8'));
            if (saveHotelReq.statusCode == 200) {
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
                msg: "获取酒店失败"
            },
            id = req.params.id,
            getReq = {},
            getInfo = '',
            hotel = {},
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotel/' + id].join(''),
            thumbnailImg = '',
            standardImg = '',
            tempUrl = '',
            _arr = [];

        try {
            getReq = syncRequest(global.METHOD_GET, uri);
            getInfo = getReq.getBody('utf-8');
            hotel = JSON.parse(getInfo);
            if (getReq.statusCode == 200) {
                if (hotel.status == 200) {
                    thumbnailImg = JSON.parse(hotel.data.imagepath).thumbnail;
                    standardImg = JSON.parse(hotel.data.imagepath).standard;
                    if (thumbnailImg) {
                        for (var obj in thumbnailImg) {
                            tempUrl = global.FILE_URL + global.FILE_UPLOAD_DIR + '/' + obj;
                            break;
                        }
                        hotel.data.tempImagepath = tempUrl;
                    }
                    if (standardImg) {
                        for (var obj in standardImg) {
                            _arr[standardImg[obj].orderList] = global.FILE_URL + global.FILE_UPLOAD_DIR + '/' + obj;
                        }
                        hotel.data.carouselPath = _arr;
                    }
                    info.status = true;
                    info.msg = '获取品牌成功';
                    info.data = hotel;
                } else {
                    info.msg = '获取酒店失败';
                }
            } else {
                info.msg = '服务器异常';
            }
        } catch (e) {
            info.status = false;
            info.msg = '网络异常';
        }
        info.username = req.session.username;
        res.render('hotel/add', info);
    },
    update: function(req, res) {
        var info = {
                status: false,
                msg: '更新酒店失败'
            },
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotel'].join(''),
            options = {
                json: {
                    "id": req.body.id,
                    "name": req.body.name,
                    "imagepath": req.body.imagepath,
                    "country": req.body.country,
                    "province": req.body.province,
                    "city": req.body.city,
                    "district": req.body.district,
                    "hotelbrandid": req.body.hotelbrandid,
                    "description": req.body.description,
                    "star": req.body.star - 0,
                    "phone": req.body.phone,
                    "address": req.body.address
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
                    info.msg = '更新酒店成功';
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
                // 回写给页面
                username: req.session.username,
                search: req.params.search ? req.params.search : '',
                hotelbrandid: req.query.hotelbrandid ? req.query.hotelbrandid : ''
            },
            _url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelHotel/search/',
                (req.params.search ? (encodeURI(encodeURI(req.params.search)) + '?') : '?'),
                (req.query.isPage ? ('isPage=false&') : ''),
                (req.query.pageIndex ? ('pageNum=' + req.query.pageIndex + '&') : ''),
                (req.query.pageSize ? ('count=' + req.query.pageSize + '&') : ''),
                (req.query.hotelbrandid ? ('hotelbrandid=' + req.query.hotelbrandid) : '')
            ].join(''),
            listReq = null, // 请求结果
            listInfo = null, // 请求结果主体（utf-8）
            tmpObj = null,
            standardImg = null,
            tempUrl = '';

        try {
            listReq = syncRequest(global.METHOD_GET, _url, { headers: { "charset": "utf-8" } });
            listInfo = JSON.parse(listReq.getBody('utf-8'));
            if (listReq.statusCode === 200) {
                if (listInfo.status === 200) {
                    info.status = true;
                    info.msg = '获取数据正常';
                    for (var i = 0; i < listInfo.data.list.length; i++) {
                        tmpObj = listInfo.data.list[i];
                        standardImg = JSON.parse(tmpObj.imagepath).thumbnail;
                        if (standardImg) {
                            for (var obj in standardImg) {
                                tempUrl = global.FILE_URL + global.FILE_UPLOAD_DIR + '/' + obj;
                                break;
                            }
                            tmpObj.imagepath = tempUrl;
                        }
                    }
                    info.data = listInfo;
                } else if (listInfo.status === 404) {
                    info.status = true;
                    info.msg = '没有取到任何数据';
                } else {
                    info.msg = '服务器异常';
                }
            } else {
                info.msg = '服务器异常';
            }
        } catch (e) {
            logger.error('网络异常 ' + e);
            info.msg = '网络异常';
        }

        if (req.query.isPage === 'false') {
            res.json(info);
        } else {
            res.render('hotel/index', info);
        }
    },
    delete: function(req, res) {
        var url = [
                'http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelHotel/',
                req.params.id
            ].join(''),
            _info = { status: false },
            reqRespons = syncRequest(global.METHOD_DELETE, url),
            deleteBrand = JSON.parse(reqRespons.getBody('utf-8'));

        if (reqRespons.statusCode === 200) {
            if (deleteBrand.status === 205) {
                _info.status = true;
                _info.msg = '删除酒店成功';
            } else if (deleteBrand.status === 415) {
                _info.msg = '此酒店下存在房间，不能删除';
            } else {
                _info.msg = deleteBrand.message;
            }
        } else {
            _info.msg = '网络堵塞';
        }
        res.json(_info);
    }
}
