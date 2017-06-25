/**
 * [微信订单服务]
 * created by hangyangws in 2016-01-06
 */

var wxpay = require('./wx_pay'),
    syncRequest = require('sync-request'),
    globalUtil = require('../../util/global'),
    payConf = require('../../util/payConf'),
    order = {
        save: function(req, res) {
            var _info = { status: false },
                _req = null,
                _return = null,
                indate = req.body.indate,
                outdate = req.body.outdate;
            try {
                // 生成订单
                _req = syncRequest(globalUtil.METHOD_POST, ['http://',
                    globalUtil.HOST_IP,
                    ':',
                    globalUtil.HOST_PORT,
                    globalUtil.POJECT,
                    '/api/hotelRoomOrder/wx'
                ].join(''), {
                    json: {
                        roomtotalprice: req.body.roomtotalprice - 0,
                        roomtotalquantity: req.body.roomtotalquantity - 0,
                        memberid: req.session.userid,
                        hotelid: req.body.hotelid,
                        mobile: req.body.mobile,
                        name: req.body.name,
                        hotelroomorderitem: [{
                            roomquantity: req.body.roomquantity - 0,
                            roomid: req.body.roomid,
                            indate: indate,
                            outdate: outdate
                        }]
                    }
                });
                if (_req.statusCode === 200) {
                    _return = JSON.parse(_req.getBody('utf-8'));
                    if (_return.status === 201) {
                        // 订单生成成功 发送微信信息
                        globalUtil.sendMsg(req, {
                            "first": {
                                "value": req.body.name + "（" + req.body.mobile + "），欢迎您选择入住高远文旅旗下酒店！",
                                "color": "#a9976d"
                            },
                            "hotelName": { "value": req.body.hotelName },
                            "roomName": { "value": req.body.roomName },
                            "pay": { "value": req.body.roomtotalprice },
                            "date": { "value": indate.slice(0, 10) }
                        });

                        _info.status = true;
                        // 下面是调用微信支付 目前先去掉
                        // order.getBrandWCPayRequestParams({
                        //     hotelname: _return.data.hotelname,
                        //     roomname: _return.data.hotelroomorderitem[0].roomname,
                        //     indate: indate,
                        //     outdate: outdate,
                        //     roomordersn: _return.data.roomordersn,
                        //     paymenttotalamount: _return.data.paymenttotalamount,
                        //     spbill_create_ip: req.body.spbill_create_ip
                        // }, req, res);
                    } else {
                        _info.msg = '添加订单失败';
                    }
                    res.json(_info);
                } else {
                    _info.msg = '网络异常';
                    res.json(_info);
                }
            } catch (e) {
                console.log('订单生成失败：' + e);
                _info.msg = '服务器异常';
                res.json(_info);
            }
        },
        getBrandWCPayRequestParams: function(_obj, req, res) {
            //根据订单生成支付参数并返回给页面
            wxpay.getBrandWCPayRequestParams({
                openid: req.session.openid,
                body: ['酒店：',
                    _obj.hotelname,
                    '，房间：',
                    _obj.roomname,
                    '，入住时间：',
                    _obj.indate.slice(0, 10),
                    '，离店时间：',
                    _obj.outdate.slice(0, 10)
                ].join(''),
                out_trade_no: _obj.roomordersn,
                total_fee: globalUtil.SUMNUM(_obj.paymenttotalamount, 100),
                spbill_create_ip: _obj.spbill_create_ip
            }, res);
        },
        wxCallback: function(msg, res) {
            if (msg.return_code === 'SUCCESS' && msg.result_code === 'SUCCESS') {
                var url = ['http://', globalUtil.HOST_IP, ':', globalUtil.HOST_PORT, globalUtil.POJECT, '/api/hotelMemberPayment/wx'].join(''),
                    _req = {},
                    _return = {},
                    _options = {
                        json: {
                            banktype: msg.bank_type,
                            transactiontype: msg.trade_type,
                            transactionid: msg.transaction_id,
                            feetype: msg.fee_type,
                            paymentamount: globalUtil.DIV(msg.cash_fee, 100),
                            roomordersn: msg.out_trade_no,
                            paymenttimeString: msg.time_end
                        }
                    };
                console.log('回传给Java：：：：：：：' + JSON.stringify(_options.json));
                _req = syncRequest(globalUtil.METHOD_POST, url, _options);
                _return = JSON.parse(_req.getBody('utf-8'));
                if (_req.statusCode == 200) {
                    if (_return.status == 201) {
                        res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>');
                    } else {
                        res.send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>');
                    }
                } else {
                    res.send('<xml><return_code><![CDATA[FAIL]]></return_code>');
                }
            } else {
                res.send('<xml><return_code><![CDATA[FAIL]]></return_code>');
            }
        },
        refund: function(req, res) {
            var params = {
                //微信分配的公众账号id
                appid: payConf.WX_APPID,
                //商户号
                mch_id: payConf.WX_MCH_ID,
                //操作员账号,默认为商户号
                op_user_id: payConf.WX_MCH_ID,
                //商户系统退款单号
                out_refund_no: '20140703' + Math.random().toString().substr(2, 10),
                //原支付金额
                total_fee: globalUtil.SUMNUM(req.body.paymenttotalamount, 100),
                //退款金额
                refund_fee: globalUtil.SUMNUM(req.body.paymenttotalamount, 100),
                //商户系统订单号
                out_trade_no: req.body.roomordersn
            };

            wxpay.refund(params, function(err, result) {
                console.log('refund', JOSN.stringify(result));
            });
        }
    };

module.exports = order;
