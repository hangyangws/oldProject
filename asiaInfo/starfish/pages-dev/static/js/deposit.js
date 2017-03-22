/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-23.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $amount = $('#amount'),
        $pay = $('#pay'),
        $balancePay = $pay.find('.j-balance-wrap'),
        $balancePayRadio = $balancePay.find('.j-balance-radio'),
        $weixinPay = $pay.find('.j-weixin-pay'),
        $weixinPayRadio = $weixinPay.find('.j-weixin-radio'),
        $payBtn = $('#payBtn'), // 支付按钮
        $payMoney = $payBtn.find('.j-pay-money'), // 支付价格
        _is_ajax = true,
        Project = {
            verifyBalance: function() {
                // 人数改变后改变自动支付方式
                $amount.find('.j-radio[checked="checked"]').removeAttr('checked');
                var _pay_money = ~~$(this).find('.j-radio').attr('checked', 'checked').val();
                if (_pay_money > win.G.balance - 0) { // 余额不足
                    $weixinPayRadio.trigger('click');
                    $balancePayRadio.attr('disabled', 'disabled'); // 不能选择零钱支付
                    $balancePay.addClass('pay-disable'); // 零钱选择变灰
                } else {
                    $balancePayRadio.removeAttr('disabled'); // 余额按钮可以点击
                    $balancePay.removeClass('pay-disable'); // 余额选择不变灰
                    $balancePayRadio.trigger('click');
                }
                // 改变支付价格
                $payMoney.html(_pay_money);
            },
            Recharge: function() {
                // 验证是否选择金额
                var _amount = ~~$amount.find('.j-radio:checked').val();
                if (!_amount) {
                    layer.open({ content: '请选择充值金额' });
                    return;
                }
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    var _pay_type = ~~($pay.find('input[name="pay"]:checked').val());
                    $.ajax({
                        url: win.G.baseUrl + '/plan/' + win.G.planId + '/' + win.G.joinId + '/deposit/do',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            amount: _amount,
                            type: _pay_type
                        },
                        success: function(_data) {
                            if (_data.code === 0) {
                                layer.closeAll();
                                // 判断是否是微信支付
                                if (_pay_type === 1) {
                                    // 得到数据 调用微信接口（目前微信支付还未开通）
                                    win.location.href = win.G.baseUrl + '/plan/' + win.G.planId + '/' + win.G.joinId + '/deposit/notice/success/' + _data.data;
                                } else {
                                    win.location.href = win.G.baseUrl + '/plan/' + win.G.planId + '/' + win.G.joinId + '/deposit/notice/success/' + _data.data;
                                }
                            } else {
                                Project.dataEnd(_data.msg || '未知错误');
                            }
                        },
                        error: function() {
                            Project.dataEnd('网络堵塞');
                        }
                    });
                }
            },
            dataEnd: function(s) {
                layer.closeAll();
                s && layer.open({ content: s });
                _is_ajax = true;
            }
        };
    /**
     * event binding
     */
    $amount
        .on(win.method, '.j-amount', Project.verifyBalance); // 金额选择
    $payBtn
        .on(win.method, Project.Recharge) // 充值
}(window || this, Zepto);
