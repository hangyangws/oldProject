;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */
! function(win, $, undefined) {
    'use strict';
    var $main = $('#main'),
        $footer = $('#footer'),
        $userPay = $footer.find('.js-user-pay'),
        $mask = $('#mask'),
        $dis = $main.find('.js-dis-info'),
        _is_ajax = true,
        _end_data = {
            // discountId: 123 // 当前用户选中的优惠券按钮id（默认没有）
            orderSn: G.orderSn, // 当前序列号
            orderId: G.orderId, // 订单id
            userPay: G.payMoney - 0, // 需要在线支付的钱（跟优惠券的选择而不一样）
            device: G.device,
            expectedTime: G.expectedTime
        },
        Pay = {
            choiceDis: function($this) {
                // 检测优惠券是否可用
                if (G.payMoney >= $this.data('full')) {
                    // 给选择的优惠券高亮
                    $this.parent().find('.dis-each.active').removeClass('active');
                    $this.addClass('active');
                    // 对象数据回填
                    _end_data.userpay = G.payMoney - $this.data('dis');
                    _end_data.discountId = $this.data('id');
                    // 页面数据回填
                    $dis.html('满' + $this.data('full') + '减' + $this.data('dis'));
                    $userPay.html(_end_data.userpay.toFixed(2));
                }
                var _time = setTimeout(function() {
                    clearTimeout(_time);
                    // 关闭蒙层
                    Pay.maskOpt('close');
                }, 200);
            },
            maskOpt: function(_type) {
                var _time;
                if (_type === 'open') {
                    $mask.removeClass('none');
                    _time = setTimeout(function() {
                        clearTimeout(_time);
                        $mask.addClass('active');
                    }, 100);
                } else {
                    $mask.removeClass('active');
                    _time = setTimeout(function() {
                        clearTimeout(_time);
                        $mask.addClass('none');
                    }, 800);
                }
            },
            pay: function() {
                win.location.href = '/pay?data=' + JSON.stringify(_end_data);
            },
            payCash: function() {
                if (_is_ajax) {
                    _is_ajax = false;
                    win.oLoad();
                    $.ajax({
                        url: '/pay',
                        type: 'POST',
                        dataType: 'json',
                        data: _end_data,
                        success: function(_data) {
                            win.location.href = '/pay/cashReturn?data=' + JSON.stringify(_data);
                        },
                        error: function() {
                            _is_ajax = true;
                            win.cLoad();
                            win.oConfrim('网络出错', true);
                        }
                    });
                }
            }
        };

    /**
     * 事件绑定
     */
    $mask.on('tap', '.dis-each', function() { // 确定选择优惠券
        Pay.choiceDis($(this));
    });
    $main.on('tap', '.js-open-dis', function() { // 打开优惠券列表
        Pay.maskOpt('open');
    });
    $footer.on('tap', '.js-pay', function() { // 结算 - 在线支付
        Pay.pay();
    }).on('tap', '.js-pay-cash', function() { // 结算 - 货到付款
        Pay.payCash();
    });;
}(window || this, Zepto);
