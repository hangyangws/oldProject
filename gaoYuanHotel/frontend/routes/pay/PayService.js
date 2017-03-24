/**
 * created by hanghangws in 2016-01-29
 */

var syncRequest = require('sync-request'),
    payConf = require('../../util/payConf'),
    globalUtil = require('../../util/global'),
    fs = require('fs'),
    wxPay = require('weixin-pay')({
        appid: payConf.WX_APPID,
        mch_id: payConf.WX_MCH_ID,
        partner_key: payConf.WX_MCH_KEY,
        pfx: fs.readFileSync(payConf.WX_PFX_PATH)
    });

module.exports = {
    pay: function(req, res) {
        if (req.session.userid && req.query.body) {
            console.log('===支付请求的参数请求的query===');
            console.log(req.query);
            var _pay_obj = {
                openid: req.session.openid,
                body: req.query.body,
                out_trade_no: req.query.out_trade_no,
                total_fee: req.query.total_fee,
                spbill_create_ip: req.query.spbill_create_ip,
                notify_url: payConf.PAY_NOTIFY_URL + '?accounturl=' + req.query.accounturl,
                nonce_str: globalUtil.generateNonceString()
            };
            console.log('===微信商城发起支付对象===');
            console.log(_pay_obj);
            wxPay.getBrandWCPayRequestParams(_pay_obj, function(err, result) {
                console.log('===微信商城支付返回对象===');
                console.log(arguments);
                res.render('pay/mall', {
                    payargs: JSON.stringify(result),
                    callbackurl: req.query.callbackurl
                });
            });
        } else {
            // 登录之前需要保存请求url
            if (req.query.accounturl && req.query.callbackurl) {
                req.session.payurl = req.url.replace('/?', '/pay?');
                req.session.save();
            }
            res.redirect('/weixin');
        }
    },
    notify: function(msg, res) {
        console.log('===微信支付发起的通知消息（对比是不是和发起的一样）===');
        console.log(msg.accounturl);
        if (msg.return_code === 'SUCCESS' && msg.result_code === 'SUCCESS') {
            var url = [
                    msg.accounturl,
                    '?total_fee=',
                    msg.cash_fee,
                    '&out_trade_no=',
                    msg.out_trade_no,
                    '&transaction_id=',
                    msg.transaction_id,
                    '&status=true&bank_type=',
                    msg.bank_type || '0'
                ].join(''),
                _req =  null,
                _return =  null;

            console.log('===向微信商城记账地址===');
            console.log(url);
            _req = syncRequest(globalUtil.METHOD_GET, url),
            _return = JSON.parse(_req.getBody('utf-8'));
            console.log('===向微信商城发送的请求===');
            console.log(_req);
            console.log('===向微信商城发送的请求body===');
            console.log(_return);

            if (_req.statusCode == 200) {
                if (_return[0].status === 'true') {
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
    }
};
