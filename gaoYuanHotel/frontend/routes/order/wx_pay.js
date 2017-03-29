/**
 * 支付相关处理
 */

var WXPay = require('weixin-pay'),
    fs = require('fs'),
    payConf = require('../../util/payConf'),
    globalUtil = require('../../util/global'),
    wxpay = WXPay({
        appid: payConf.WX_APPID,
        mch_id: payConf.WX_MCH_ID,
        partner_key: payConf.WX_MCH_KEY,
        pfx: fs.readFileSync(payConf.WX_PFX_PATH)
    });

module.exports = {
    // 微信支付参数准备
    getBrandWCPayRequestParams: function(params, res) {
        wxpay.getBrandWCPayRequestParams({
            openid: params.openid,
            body: params.body,
            detail: params.detail,
            out_trade_no: params.out_trade_no,
            total_fee: params.total_fee,
            spbill_create_ip: params.spbill_create_ip,
            notify_url: payConf.WX_NOTIFY_URL,
            nonce_str: globalUtil.generateNonceString()
        }, function(err, result) {
            res.json({
                status: true,
                payargs: result
            });
        });
    },
    // 关闭订单
    closeOrder: function(params, res) {
        wxpay.closeOrder({ out_trade_no: params.out_trade_no }, function(err, result) {

        });
    },
    // 查询订单
    queryOrder: function(params, cb, res) {
        var _para = {};
        if (params.transaction_id) {
            _para.transaction_id = params.transaction_id;
        } else if (params.out_trade_no) {
            _para.out_trade_no = params.out_trade_no;
        }
        wxpay.queryOrder(_para, function(err, order) {
            cb(order);
        });
    }
}
