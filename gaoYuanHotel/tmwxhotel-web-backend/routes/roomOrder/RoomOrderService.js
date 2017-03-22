/**
 * 酒店管理服务
 * created by hangyangws in 2016-02-29
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    list: function(req, res) {
        var info = {
                status: false,
                username: req.session.username,
                // 下面的数据用于回写页面
                indate: req.query.indate ? req.query.indate : '',
                outdate: req.query.outdate ? req.query.outdate : '',
                hotelid: req.query.hotelid ? req.query.hotelid : '',
                roomid: req.query.roomid ? req.query.roomid : '',
                orderstatus: req.query.orderstatus ? req.query.orderstatus : '',
                paymentstatus: req.query.paymentstatus ? req.query.paymentstatus : '',
                search: req.params.search ? req.params.search : ''
            },
            // 根据参数生成请求url
            url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomOrder/search/',
                // 搜索内容
                encodeURI(encodeURI(info.search)),
                '?',
                info.indate ? ('indate=' + info.indate + ' 00:00:00&') : '',
                info.outdate ? ('outdate=' + info.outdate + ' 00:00:00&') : '',
                info.hotelid ? ('hotelid=' + info.hotelid + '&') : '',
                info.roomid ? ('roomid=' + info.roomid + '&') : '',
                info.orderstatus ? ('orderstatus=' + info.orderstatus + '&') : '',
                info.paymentstatus ? ('paymentstatus=' + info.paymentstatus + '&') : ''
            ],
            refundStatusEx = {
                '-10': '作废',
                '-20': '超时',
                '-30': '拒绝',
                '10': '申请',
                '30': '审批',
                '90': '成功'
            },
            listReq = null,
            listInfo = null,
            _list_len = 0;

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
                listInfo = listInfo.data;
                // 去除入住时间 离店时间 时分秒
                // refundstatus 字段 映射
                _list_len = listInfo.list.length;
                while (_list_len--) {
                    listInfo.list[_list_len].hotelroomorderitem[0].indate = listInfo.list[_list_len].hotelroomorderitem[0].indate.slice(0, 10);
                    listInfo.list[_list_len].hotelroomorderitem[0].outdate = listInfo.list[_list_len].hotelroomorderitem[0].outdate.slice(0, 10);

                    listInfo.list[_list_len].refundstatus = refundStatusEx[listInfo.list[_list_len].refundstatus + ''];
                }

                info.status = true;
                info.msg = '获取数据正常';
                info.data = listInfo;
            } else if (listInfo.status === 404) {
                info.msg = '没有取到任何数据';
            } else {
                info.msg = '获取订单列表失败';
            }
        } else {
            info.msg = '服务器异常';
        }

        if (req.query.isPage === 'false') {
            res.json(info);
        } else {
            res.render('roomOrder/index', info);
        }
    },
    modifyOrder: function(req, res) {
        var _date = new Date(),
            info = { status: false },
            _status = ~~req.body.status === 50 ? 60 : 90, // _status只有入住和离店用到
            _url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT
            ].join(''),
            statusReqObj = {
                '10': {
                    url: '/api/hotelRoomOrder/bkConfirmOrder',
                    method: global.METHOD_PUT,
                    body: {
                        id: req.body.id,
                        hotelroomorderitem: [{
                            roomid: req.body.roomid,
                            indate: req.body.indate + " 00:00:00",
                            outdate: req.body.outdate + " 00:00:00"
                        }]
                    },
                    okStatus: 205
                },
                '30': {
                    url: '/api/hotelMemberPayment/wx',
                    method: global.METHOD_POST,
                    body: {
                        transactionid: "system",
                        paymentamount: req.body.paymentamount,
                        roomordersn: req.body.roomordersn,
                        paymenttimeString: global.GETDATE() + _date.getHours() + _date.getMinutes() + _date.getSeconds()
                    },
                    okStatus: 201
                },
                '50': {
                    url: '/api/hotelRoomOrder',
                    method: global.METHOD_PUT,
                    body: {
                        id: req.body.id,
                        orderstatus: _status
                    },
                    okStatus: 205
                }
            },
            syncReq = null,
            returnData = null;
        statusReqObj['60'] = statusReqObj['50'];
        // 根据status确定当前请求参数和数据
        statusReqObj = statusReqObj[req.body.status];
        console.log(statusReqObj);
        try {
            // 发送请求获取数据
            syncReq = syncRequest(statusReqObj.method, _url + statusReqObj.url, {
                json: statusReqObj.body
            });
            if (syncReq.statusCode === 200) {
                returnData = JSON.parse(syncReq.getBody('utf-8'));
                console.log('状态码：' + returnData.status);
                if (returnData.status === statusReqObj.okStatus) {
                    info.status = true;
                } else {
                    info.msg = returnData.message || '';
                }
            } else {
                info.msg = '网络异常';
            }
        } catch (e) {
            console.log('服务器异常: ' + e);
            info.msg = '服务器异常';
        }
        res.json(info);
    },
    getLog: function(req, res) {
        var info = { status: false },
            _url = ['http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelRoomOrderLog?',
                'parameter={"roomorderid":',
                req.body.id,
                '}&pageNum=',
                req.body.pageNum || 1,
                '&count=',
                req.body.count || 10
            ].join(''),
            syncReq = null,
            returnData = null;
        try {
            syncReq = syncRequest(global.METHOD_GET, _url);
            if (syncReq.statusCode === 200) {
                returnData = JSON.parse(syncReq.getBody('utf-8'));
                if (returnData.status === 200) {
                    // 判断是否有数据
                    if (returnData.data.list && returnData.data.list.length) {
                        info.status = true;
                        info.data = returnData.data;
                    } else {
                        info.msg = '没有取到任何数据';
                    }
                } else if (returnData.status === 404) {
                    info.msg = '没有取到任何数据';
                } else {
                    info.msg = '获取日志失败' + (returnData.message || '');
                }
            } else {
                info.msg = '网络异常';
            }
        } catch (e) {
            logger.error('服务器异常: ' + e);
            console.log('服务器异常: ' + e);
            info.msg = '服务器异常';
        }
        res.json(info);
    }
}
