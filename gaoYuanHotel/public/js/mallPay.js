;
/**
 * [微信商城支付]
 * created by hangyangws in 2016-05-25
 */
! function() {
    var Pay = {
        onBridgeReady: function() {
            // 弹出微信支付窗口
            if (payArgs.package === 'prepay_id=undefined') {
                layer.open({ content: '商户订单号重复' });
                Pay.redirect('false');
            } else {
                layer.open({ content: '支付中…' });
                function onBridgeReady() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        payArgs,
                        function(res) {
                            if (res.err_msg === "get_brand_wcpay_request:ok") {
                                layer.open({ content: '支付成功' });
                                Pay.redirect('true');
                            } else {
                                layer.open({ content: '支付失败' });
                                Pay.redirect('false');
                            }
                        }
                    );
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            }
        },
        redirect: function(_status) {
            setTimeout(function() {
                location.href = callbackurl + '?status=' + _status;
            }, 600);
        }
    };
    // 开始支付
    Pay.onBridgeReady();
}();
