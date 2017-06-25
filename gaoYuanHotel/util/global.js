/**
 * [关于一些常量的配置 模块化重用的方法]
 * created by hangyangws in 2016-04-22
 */

var syncRequest = require('sync-request'),
    logger = require('../log/logConfig').logger,
    payConf = require('./payConf'),
    global = {
        /**
         * 网站运行配置
         */
        FILE_UPLOAD_TMPDIR: '/tmp', // 保存临时图片的
        FILE_UPLOAD_DIR: '/pub', // 图片裁剪之后
        // 产线配置
        // HOST_IP: '127.0.0.1', // 服务器IP地址
        // HOST_PORT: '90', // 端口号
        // HOST_SESSION_IP: "127.0.0.1:27017", // session mongodb数据库配置
        // HOST_DB: "tmwxhotel",
        // FILE_URL: "http://114.55.37.95:90/gy-wxhotel-img", // 可读取图片的根目录
        // POJECT: '/tssp-hotel', // 项目名
        // 开发配置
        HOST_IP: '114.55.37.95',
        HOST_PORT: '90',
        HOST_SESSION_IP: "192.168.0.119:27017",
        HOST_DB: "test",
        FILE_URL: "http://114.55.37.95:90/gy-wxhotel-img",
        POJECT: '/tssp-hotel',
        /**
         * 项目基本配置
         */
        METHOD_GET: 'GET',
        METHOD_POST: 'POST',
        METHOD_DELETE: 'DELETE',
        METHOD_PUT: 'PUT',
        STATECODE_200: '200',
        STATECODE_500: '500',
        STATECODE_404: '404',
        // 文件上传保存路径
        PATH_UPLOAD: './upload/',
        // 不用登录拦截的路径
        REQ_URL: ['/weixin',
            '/weixin/loginCallback',
            '/order/wxpay/notify',
            '/users',
            '/language',
            '/weixin/login',
            '/password/set',
            '/password/get',
            '/pay',
            '/pay/notify'
        ],
        /**
         * 常用方法
         */
        // 日期处理返回 eg: 19930512
        GETDATE: function (date) {
            var date = date || new Date(),
                _return_date = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();
            _return_date += (month < 10 ? ('0' + month) : month);
            _return_date += (day < 10 ? ('0' + day) : day);
            return _return_date;
        },
        // 获取客户端ip
        GETCLIENT_IP: function (req) {
            return req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
        },
        // 毫秒转时间 毫秒数转换为yyyy-MM-dd HH:mm:ss的日期格式
        FORMAT: function (time, format) {
            var t = new Date(time),
                tf = function (i) {
                    return (i < 10 ? '0' : '') + i;
                };
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                }
            })
        },
        //计算天数差的函数，通用
        DATEDIFF: function (sDate1, sDate2) {
            var aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("-");
            oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为12-18-2006格式
            aDate = sDate2.split("-");
            oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
            iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
            return iDays;
        },
        //获取05月04日
        GETMD: function (date) {
            return date.slice(5).replace('-', '月') + '日';
        },
        //获取05月04日
        GETYMD: function (date) {
            return date.slice(0, 10).replace('-', '年').replace('-', '月') + '日';
        },
        // 两个数求乘积
        SUMNUM: function (n1, n2) {
            var l1, l2;
            try {
                l1 = n1.toString().split(".")[1].length;
            } catch (e) {
                l1 = 0;
            }
            try {
                l2 = n2.toString().split(".")[1].length;
            } catch (e) {
                l2 = 0;
            }
            l1 = Math.pow(10, Math.max(l1, l2)); // 该除的10次方数
            return ~~(~~(n1 * l1) * ~~(n2 * l1)) / (l1 * l1);
        },
        // 两个数作除
        DIV: function (arg1, arg2) {
            var t1 = 0,
                t2 = 0,
                r1, r2;
            try {
                t1 = arg1.toString().split(".")[1].length
            } catch (e) {
            }
            try {
                t2 = arg2.toString().split(".")[1].length
            } catch (e) {
            }
            with (Math) {
                r1 = Number(arg1.toString().replace(".", ""))
                r2 = Number(arg2.toString().replace(".", ""))
                return (r1 / r2) * pow(10, t2 - t1);
            }
        },
        // 数组去重复
        ARRAYUNIQUE: function (_arr) {
            var _r = [],
                _h = {};
            for (var i = 0, _e;
                 (_e = _arr[i]) != null; i++) {
                if (!_h[_e]) {
                    _r.push(_e);
                    _h[_e] = true;
                }
            }
            return _r;
        },
        // 获取随机数
        generateNonceString: function (_len) {
            var _str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
                _str_l = _str.length - 1,
                _len = _len || 32,
                _temp_str = [];
            while (_len--) {
                _temp_str.push(_str.charAt(~~(Math.random() * _str_l)));
            }
            return _temp_str.join('');
        }
    };

// 服务器接口调用方法
global.syncReq = function (_req_obj) {
    // _req_obj = {method: string, url: string, data: json, status: number}
    var _info = {status: false},
        _reqObj = null,
        _returnObj = null,
        _url = ['http://',
            global.HOST_IP,
            ':',
            global.HOST_PORT,
            global.POJECT,
            _req_obj.url
        ].join('');
    try {
        _reqObj = syncRequest(_req_obj.method, _url, _req_obj.data || null);
        _returnObj = JSON.parse(_reqObj.getBody('utf-8'));
        if (_reqObj.statusCode === 200) {
            if (_returnObj.status === _req_obj.status) {
                _info.status = true;
                _info.data = _returnObj;
            } else if (_returnObj.status === 404) {
                _info.msg = '没有获取到任何数据';
            } else {
                _info.msg = '操作失败：' + (_returnObj.message || '');
            }
        } else {
            logger.error('请求路径：' + _url + '服务器出错（' + _reqObj.statusCode + '）：' + _returnObj);
            console.log('请求路径：' + _url + '服务器出错（' + _reqObj.statusCode + '）：' + _returnObj);
            _info.msg = '服务器错误';
        }
    } catch (e) {
        logger.error('请求路径：' + _url + '异常：' + e);
        console.log('请求路径：' + _url + '异常：' + e);
        _info.msg = '操作失败';
    }
    // respond 返回数据
    return _info;
};

// 发送模板消息
global.sendMsg = function (req, _sendJson) {
    // 构建微信发送消息
    var _sendObj = {
            touser: req.session.openid,
            template_id: 'zbGACjoC2N4UcSWBahUXOgDG6p80b2Q1ZfrkfTaKfcY',
            data: _sendJson
        },
        _info = {status: false},
        _reqObj = syncRequest(global.METHOD_POST, 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + req.session.accesstoke, {json: _sendObj}),
        _returnObj = JSON.parse(_reqObj.getBody('utf-8'));

    if (_reqObj.statusCode === 200) {
        if (!_returnObj.errcode && _returnObj.errmsg === 'ok') {
            _info.status = true;
        } else {
            _info.msg = '发送消息失败：' + _returnObj.errmsg;
        }
    } else {
        logger.error('微信发送模板消息出错（' + _reqObj.statusCode + '）：' + _returnObj);
        console.log('微信发送模板消息出错（' + _reqObj.statusCode + '）：' + _returnObj);
        _info.msg = '发送消息失败';
    }
    return _info;
};

module.exports = global;
