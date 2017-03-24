/**
 * [created by hangyangws in 2016-02-23]
 * @type {[type]}
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    list: function(req, res) {
        var _info = {
                status: false,
                username: req.session.username
            },
            url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelHotelBrand/search/?isPage=false'
            ].join(''),
            listReq = syncRequest(global.METHOD_GET, url),
            listInfo = JSON.parse(listReq.getBody('utf-8'));

        if (listReq.statusCode === 200) {
            if (listInfo.status === 200) {
                _info.status = true;
                // 处理图片路径
                var _list = listInfo.data.list,
                    _l = _list.length,
                    _img_name = null;
                while (_l--) {
                    for (_img_name in JSON.parse(_list[_l].imagepath).standard) {
                        _list[_l].imagepath = global.FILE_URL + global.FILE_UPLOAD_DIR + '/' + _img_name;
                    }
                }
                _info.data = _list;
            } else if (listInfo.status === 404) {
                logger.error('酒店预订页面获取酒店，没有取到酒店数据');
                console.log('酒店预订页面获取酒店，没有取到酒店数据');
                _info.msg = '没有取到任何数据';
            } else {
                logger.error('酒店预订页面获取酒店错误：' + listInfo);
                console.log('酒店预订页面获取酒店错误：' + listInfo);
                _info.msg = '获取酒店失败';
            }
        } else {
            logger.error('酒店预订页面错误（' + listInfo + '）:' + e);
            console.log('酒店预订页面错误（' + listInfo + '）:' + e);
            _info.msg = '网络异常';
        }
        res.render('hotelType/index', _info);
    },
    getCity: function(req, res) {
        var brandid = req.params.brandid,
            _req = {},
            reqInfo = '',
            url = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotel/search/?hotelbrandid=', brandid].join(''),
            info = {
                status: false,
                msg: '获取数据异常'
            },
            _list = [];
        try {
            _req = syncRequest(global.METHOD_GET, url);
            reqInfo = JSON.parse(_req.getBody('utf-8'));

            if (_req.statusCode == 200) {
                if (reqInfo.status == 200) {
                    info.status = true;
                    info.msg = '获取数据正常';
                    for (var i = 0; i < reqInfo.data.list.length; i++) {
                        _list.push(reqInfo.data.list[i].city);
                    }
                    _list = global.ARRAYUNIQUE(_list);
                    info.data = _list;
                } else if (reqInfo.status == 404) {
                    info.status = true;
                    info.msg = '没有取到任何数据';
                } else {
                    info.msg = '服务器异常';
                }
            } else {
                info.msg = '服务器异常';
            }
        } catch (e) {
            console.log(e);
            logger.error('首页异常:' + e);
            info.msg = '网络异常';
        }
        res.json(info);
    }
}
