/**
 * [created by hangyangws in 2016-03-03]
 */

var syncRequest = require('sync-request'),
    globalUtil = require('../../util/global'),
    User = {
        getOrderList: function(req, res) {
            var _info = { status: false },
                _req = syncRequest(globalUtil.METHOD_GET, ['http://',
                    globalUtil.HOST_IP,
                    ':',
                    globalUtil.HOST_PORT,
                    globalUtil.POJECT,
                    '/api/hotelRoomOrder/wx?parameter=',
                    JSON.stringify({
                        memberid: req.session.userid,
                        orderstatus: ~~req.query.orderstatus || 10
                    })
                ].join('')),
                _return = null;
            if (_req.statusCode === 200) {
                _return = JSON.parse(_req.getBody('utf-8'));
                if (_return.status === 200) {
                    for (var i = 0; i < _return.data.list.length; i++) {
                        var tmpObj = _return.data.list[i],
                            thumbnailImg = JSON.parse(tmpObj.hotelimagepath).thumbnail,
                            tempUrl = '';
                        if (thumbnailImg) {
                            for (var obj in thumbnailImg) {
                                tempUrl = globalUtil.FILE_URL + globalUtil.FILE_UPLOAD_DIR + '/' + obj;
                                break;
                            }
                        }
                        _return.data.list[i].tempImagepath = tempUrl;
                    }
                    _info.status = true;
                    _info.msg = '获取数据成功';
                    _info.data = _return;
                } else if (_return.status === 404) {
                    _info.status = true;
                    _info.msg = '没有找到数据';
                } else {
                    _info.msg = '网络异常';
                }
            } else {
                _info.msg = '服务器异常';
            }
            res.json(_info);
        },
        refund: function(req, res) {
            var info = { status: false },
                refundreq = syncRequest(globalUtil.METHOD_POST, ['http://',
                    globalUtil.HOST_IP,
                    ':',
                    globalUtil.HOST_PORT,
                    globalUtil.POJECT,
                    '/api/hotelMemberRefund/wx'
                ].join(''), {
                    json: {
                        roomorderid: req.body.roomorderid
                    }
                }),
                getBody = null;
            if (refundreq.statusCode === 200) {
                getBody = JSON.parse(refundreq.getBody('utf-8'));
                if (getBody.status === 201) {
                    info.status = true;
                } else {
                    info.msg = '退款失败' + (getBody.msg || '');
                }
            } else {
                info.msg = '服务器异常';
            }
            res.json(info);
        },
        getPointList: function(req, res) {
            var _info = globalUtil.syncReq({
                method: globalUtil.METHOD_GET,
                url: '/api/hotelMemberPointHistory?parameter={"memberid":"' + req.session.userid + '"}',
                status: 200
            });
            res.render('user/point', _info);
        }
    };

module.exports = User;
