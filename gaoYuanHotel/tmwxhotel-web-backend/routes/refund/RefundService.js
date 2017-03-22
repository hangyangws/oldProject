/**
 * [微信付款服务 created by hangyangws in 2016-04-20]
 */

var refundConf = require('../../util/refundConf'), // 微信退款配置文件
    xml2js = require('xml2js'), // xml - json 转换工具
    globalFunc = require('../../util/global'), // 全局配置文件
    request = require('request'),
    syncRequest = require('sync-request'),
    fs = require('fs'),
    md5 = require('MD5'),
    refundService = {
        apply: function(req, res) {
            // 构建 json
            var _fee = refundService.sunNum(req.body.fee, 100), // 退款总金额
                // 微信申请退款的数据
                _req_data = {
                    appid: refundConf.WX_APPID,
                    mch_id: refundConf.WX_MCH_ID,
                    nonce_str: globalFunc.RANDOMSTRING(),
                    transaction_id: req.body.transactionid,
                    out_refund_no: globalFunc.GETDATE() + Math.random().toString().substr(2, 10),
                    total_fee: _fee,
                    refund_fee: _fee,
                    op_user_id: refundConf.WX_MCH_ID
                },
                _info = { status: false }, // 返回给页面的数据
                syncReq = null, // 后台请求
                _req_obj = null, // 后台请求对象参数
                returnData = null,
                _url = null;
            _req_data.sign = refundService.sign(_req_data);
            // 构建 xml
            _req_data = new xml2js.Builder().buildObject({ xml: _req_data });
            // 向微信发送退款申请
            request({
                url: "https://api.mch.weixin.qq.com/secapi/pay/refund",
                method: "POST",
                body: _req_data,
                agentOptions: {
                    pfx: fs.readFileSync(refundConf.WX_PFX_PATH),
                    passphrase: refundConf.WX_MCH_ID
                }
            }, function(_err, _response, _body) {
                // 解析body
                xml2js.parseString(_body, function(_err, _result) {
                    _result = _result.xml;
                    // 解析xml出错
                    if (!_err && _result) {
                        if (_result.return_code[0] === 'SUCCESS' && _result.result_code[0] === 'SUCCESS') {
                            // 微信申请退款成功 then 向服务端发送数据请求 [修改退款状态为30 回传： transactionrefundid refundchannel-可能没有 feetype-可能没有 (由微信返回)的字段]
                            _req_obj = {
                                id: req.body.id,
                                refundstatus: 30,
                                transactionrefundid: _result.transaction_id[0]
                            };

                            if (_result.refund_channel && _result.refund_channel[0]) {
                                _req_obj.refundchannel = _result.refund_channel[0];
                            }
                            if (_result.fee_type && _result.fee_type[0]) {
                                _req_obj.feetype = _result.fee_type[0];
                            }

                            _url = ['http://',
                                globalFunc.HOST_IP,
                                ':',
                                globalFunc.HOST_PORT,
                                globalFunc.POJECT,
                                '/api/hotelMemberRefund'
                            ].join('');
                            syncReq = syncRequest(globalFunc.METHOD_PUT, _url, {
                                json: _req_obj
                            });
                            if (syncReq.statusCode === 200) {
                                returnData = JSON.parse(syncReq.getBody('utf-8'));
                                // 判断数据有效性
                                if (returnData.status === 205) {
                                    _info.status = true;
                                } else {
                                    _info.msg = '退款出错' + (returnData.message || '');
                                }
                            } else {
                                _info.msg = '退款申请成功，服务器异常';
                            }
                        } else {
                            _info.msg = '退款审批失败: ' + (_result.err_code_des ? _result.err_code_des[0] : '');
                        }
                    } else {
                        _info.msg = '数据解析错误';
                    }
                });
                res.json(_info);
            });
        },
        query: function(req, res) {
            var sj = globalFunc.RANDOMSTRING(),
                xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<xml>' +
                '<appid>wx3145febe4ba1ad3e</appid>' +
                '<mch_id>1322383401</mch_id>' +
                '<nonce_str>' + sj + '</nonce_str>' +
                '<transaction_id>4001392001201603234208080624</transaction_id>' +
                '<out_trade_no></out_trade_no>' +
                '<out_refund_no></out_refund_no>' +
                '<refund_id></refund_id>' +
                '<sign>' + refundService.sign({
                    appid: 'wx3145febe4ba1ad3e',
                    mch_id: '1322383401',
                    transaction_id: '4001392001201603234208080624',
                    nonce_str: sj
                }) +
                '</sign>' +
                '</xml>';
            request({
                url: "https://api.mch.weixin.qq.com/pay/refundquery",
                method: "POST",
                body: xml
            }, function(err, response, body) {
                res.json(arguments);
            });
        },
        sign: function(param) {
            var querystring = Object.keys(param).filter(function(key) {
                return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key) < 0;
            }).sort().map(function(key) {
                return key + '=' + param[key];
            }).join("&") + "&key=" + refundConf.WX_MCH_KEY;
            return md5(querystring).toUpperCase();
        },
        // 求和函数
        sunNum: function(n1, n2) {
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
        // 查询退款列表
        list: function(req, res) {
            var info = {
                    status: false,
                    username: req.session.username,
                    // 回写页面
                    search: req.query.search,
                    startdate: req.query.startdate,
                    enddate: req.query.enddate,
                    refundstatus: req.query.refundstatus
                },
                _url = ['http://',
                    globalFunc.HOST_IP,
                    ':',
                    globalFunc.HOST_PORT,
                    globalFunc.POJECT,
                    '/api/hotelMemberRefund/search/',
                    info.search ? encodeURI(encodeURI(info.search)) : '',
                    '?',
                    info.startdate ? ('startdate=' + info.startdate + ' 00:00:00&') : '',
                    info.enddate ? ('enddate=' + info.enddate + ' 00:00:00&') : '',
                    info.refundstatus ? ('refundstatus=' + info.refundstatus + '&') : '',
                    req.query.pageIndex ? ('pageNum=' + req.query.pageIndex) : ''
                ].join(''),
                syncReq = syncRequest(globalFunc.METHOD_GET, _url),
                returnData = null,
                refundStatusEx = {
                    '10': '申请',
                    '30': '审批',
                    '90': '成功',
                    '-10': '作废',
                    '-20': '超时',
                    '-30': '拒绝'
                };
            try {
                if (syncReq.statusCode === 200) {
                    returnData = JSON.parse(syncReq.getBody('utf-8'));
                    // 判断数据有效性
                    if (returnData.status === 200) {
                        // refundstatus transactionrefundstatus 字段 映射
                        var _len = returnData.data.list.length;
                        while (_len--) {
                            returnData.data.list[_len].refundstatus = refundStatusEx[returnData.data.list[_len].refundstatus + ''];
                            returnData.data.list[_len].transactionrefundstatus || (returnData.data.list[_len].transactionrefundstatus = '无');
                        }
                        info.status = true;
                        info.data = returnData.data;
                    } else if (returnData.status === 404) {
                        info.msg = '没有取到任何数据';
                    } else {
                        info.msg = '获取日志失败' + (returnData.message || '');
                    }
                } else {
                    info.msg = '网络异常';
                }
            } catch (e) {
                console.log('-----------退款列表查询服务器异常----------');
                console.log(e);
                info.msg = '服务器异常';
            }
            res.render('roomOrder/refundList', info);
        },
        // 订单拒绝退款
        refuse: function(req, res) {
            var _info = { status: false }, // 返回给页面的数据
                syncReq = syncRequest(globalFunc.METHOD_PUT, ['http://',
                    globalFunc.HOST_IP,
                    ':',
                    globalFunc.HOST_PORT,
                    globalFunc.POJECT,
                    '/api/hotelMemberRefund'
                ].join(''), {
                    json: {
                        id: req.body.id,
                        refundstatus: -30
                    }
                }),
                returnData = null;

            if (syncReq.statusCode === 200) {
                returnData = JSON.parse(syncReq.getBody('utf-8'));
                // 判断数据有效性
                if (returnData.status === 205) {
                    _info.status = true;
                } else {
                    _info.msg = '拒绝失败 ' + (returnData.message || '');
                }
            } else {
                _info.msg = '服务器异常';
            }
            res.json(_info);
        }
    };

module.exports = refundService;
