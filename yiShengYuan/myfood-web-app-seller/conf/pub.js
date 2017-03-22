/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-18.
 * [公共函数]
 */

var syncRequest = require('sync-request'),
    conf = require('./conf'),
    _status_obj = {
        "GET": 200,
        "POST": 201,
        "PUT": 205,
        "DELETE": 205
    },
    _export = {
        syncReq: function(_req_obj) {
            // _req_obj: {method: string, url: string[, data: json]}
            // [method 大写]
            // returnData: { status: false, msg: '***' } OR { status: true, data: *** } OR { status: false, msg: '***', isempty: true}
            var _info = { status: false },
                _reqObj = null,
                _returnObj = null,
                _url = ['http://',
                    conf.HOST_IP,
                    ':',
                    conf.HOST_PORT,
                    conf.POJECT,
                    _req_obj.url
                ].join('');
            try {
                console.log('请求地址', _req_obj.method, _url, '数据', _req_obj.data || null);
                _reqObj = syncRequest(_req_obj.method, _url, _req_obj.data ? { json: _req_obj.data } : null);
                _returnObj = JSON.parse(_reqObj.getBody('utf-8'));
                if (_reqObj.statusCode === 200) {
                    if (_returnObj.status === _status_obj[_req_obj.method]) {
                        _info.status = true;
                        _info.data = _returnObj;
                    } else if (_returnObj.status === 404) {
                        _info.msg = '没有获取到任何数据';
                        _info.isempty = true;
                    } else {
                        _info.msg = '操作失败' + (_returnObj.message ? ('：' + _returnObj.message) : '');
                    }
                } else {
                    console.log('请求路径：', _url, '服务器出错（', _reqObj.statusCode, '）：', _returnObj);
                    _info.msg = '请求错误';
                }
            } catch (e) {
                console.log('请求路径：', _url, '异常：', e);
                _info.msg = '未知错误';
            }
            // respond 返回数据
            return _info;
        },
        dinType: {
            TAKE: '上门取餐',
            COME: '上门就餐',
            DELIVER: '送货上门'
        }
    };

module.exports = _export;
