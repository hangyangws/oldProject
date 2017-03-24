/**
 * created by hangyangws in 2016-03-04
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global'),
    public = require('../public/public'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    search: function(req, res) {
        var info = {
                status: false,
                msg: '获取数据失败'
            },
            options = {
                brandid: req.query.brandid,
                city: encodeURI(encodeURI(req.query.city)),
                indate: req.query.indate,
                outdate: req.query.outdate
            },
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotel/wx'].join(''),
            _req = {},
            _list = '',
            tempUrl = '',
            tempImagepath;
        try {
            uri += "?parameter=" + JSON.stringify(options);
            _req = syncRequest(global.METHOD_GET, uri);
            _list = JSON.parse(_req.getBody('utf-8'));
            if (_req.statusCode == 200) {
                if (_list.status == 200) {
                    info.status = true;
                    info.msg = '获取数据成功';
                    for (var i = 0; i < _list.data.length; i++) {
                        tempImagepath = [];
                        tmpObj = _list.data[i];
                        standardImg = JSON.parse(tmpObj.imagepath).standard;
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
                                _tmp.origin = _img_name + 'origin' + _img_ext;
                                _tmp.standard = obj;
                                tempImagepath.push(_tmp);
                            }
                        }
                        _list.data[i].tempImagepath = tempImagepath;
                    }
                    info.indate = req.query.indate;
                    info.outdate = req.query.outdate;
                    info.data = _list;
                } else if (_list.status == 404) {
                    info.msg = '暂时没有任何数据';
                } else if (_list.status == 415) {
                    info.message = _list.msg;
                }
            } else {
                info.msg = '网络异常';
            }
        } catch (e) {
            console.log(e);
            logger.error('服务器异常:' + e);
            info.msg = '服务器异常';
        }
        console.log(JSON.stringify(info));
        res.render('searchHotel/index', info);
    },
    details: function(req, res) {
        var options = {
                "indate": req.query.indate,
                "outdate": req.query.outdate,
                "memberid": req.session.userid
            },
            url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelHotel/wx/',
                req.params.hotelid,
                '?parameter=',
                JSON.stringify(options)
            ].join(''),
            _indate = req.query.indate.slice(0, 10),
            _outdate = req.query.outdate.slice(0, 10),
            _req = null,
            _list = null,
            info = { status: false };
        try {
            _req = syncRequest(global.METHOD_GET, url);
            _list = JSON.parse(_req.getBody('utf-8'));
            if (_req.statusCode === 200) {
                if (_list.status === 200) {
                    info.status = true;
                    // 获取房间轮播图
                    var carouselImg = JSON.parse(_list.data.imagepath).standard,
                        imagepath = [];

                    for (var imgName in carouselImg) {
                        imagepath.push({ imagepath: global.FILE_URL + global.FILE_UPLOAD_DIR + '/' + imgName });
                    }

                    _list.data.imagepath = imagepath;

                    info.time = {
                        indate: global.GETYMD(_indate),
                        indateMin: global.GETMD(_indate),
                        outdate: global.GETYMD(_outdate),
                        outdateMin: global.GETMD(_outdate),
                        count: global.DATEDIFF(_outdate, _indate)
                    };
                    info.data = _list.data;
                } else if (_list.status === 404) {
                    info.msg = '没有取到任何数据';
                } else {
                    info.msg = _list.message || '';
                }
            } else {
                info.msg = '网络异常';
            }
        } catch (e) {
            console.log('获取房间详情异常:' + e);
            logger.error('获取房间详情异常:' + e);
            info.msg = '服务器异常';
        }
        res.render('searchRoom/index', info);
    },
    toUser: function(req, res) {
        // 获取用户积分
        var userInfo = global.syncReq({
            method: global.METHOD_GET,
            url: '/api/hotelMember/' + req.session.userid,
            status: 200
        });
        res.render('user/index', {
            username: req.session.username,
            headimg: req.session.headimg,
            point: userInfo.data.data.point
        });
    }
}
