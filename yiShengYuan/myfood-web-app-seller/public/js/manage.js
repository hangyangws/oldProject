;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-08.
 * [管理]
 */

! function(win, $, undefined) {
    'use strict';
    var $businessState = $('#businessState'),
        $checkLabel = $('#checkLabel'),
        $manageInfo = $('#manageInfo'),
        $foodKitchen = $('#foodKitchen'),
        $countbalance = $manageInfo.find('.js-countbalance'),
        _check_id = 'stateCheck',
        _is_ajax = true,
        Manage = {
            changeState: function(_this) {
                var _status = _this.checked;
                if (_is_ajax) {
                    _is_ajax = false;
                    $checkLabel.attr('for', _check_id + '--');
                    $.ajax({
                        url: '/manage/operate',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            shopId: G.shopId,
                            status: _status,
                            type: 'changeState'
                        },
                        success: function(_data) {
                            _data.status || (_this.checked = !_status, win.oConfrim('操作失败', true));
                            _is_ajax = true;
                            $checkLabel.attr('for', _check_id);
                        },
                        error: function() {
                            win.oConfrim('操作失败', true);
                            _this.checked = !_status;
                            _is_ajax = true;
                            $checkLabel.attr('for', _check_id);
                        }
                    });
                }
            },
            withdrawals: function() {
                if (_is_ajax) {
                    win.oConfrim('提现：' + $countbalance.html() + '元', false, function() {
                        win.oLoad();
                        _is_ajax = false;
                        $.ajax({
                            url: '/manage/operate',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                shopId: G.shopId,
                                type: 'getCash'
                            },
                            success: function(_data) {
                                if (_data.status) {
                                    win.location.reload(true);
                                } else {
                                    win.oConfrim(_data.msg, true);
                                }
                                _is_ajax = true;
                                win.cLoad();
                            },
                            error: function() {
                                win.oConfrim('网络出错', true);
                                _is_ajax = true;
                                win.cLoad();
                            }
                        });
                    });
                }
            },
            orderView: function() {
                if (G.device == 1) {
                    win.android.toTodayOrders();
                } else {
                    location.href = 'objc://TodayOrderCount';
                }
            },
            goFk: function(_type) {
                var method = {
                    food: function() {
                        if (G.device == 1) {
                            win.android.toDishesList();
                        } else {
                            location.href = 'objc://FoodInformation';
                        }
                    },
                    kitchen: function() {
                        if (G.device == 1) {
                            win.android.toKitchen();
                        } else {
                            location.href = 'objc://KitchenInformation';
                        }
                    }
                };
                method[_type]();
            }
        };
    /**
     * 事件绑定
     */
    $businessState.on('change', '.state-checked', function() { // 更换营业状态
        Manage.changeState(this);
    });
    $manageInfo.on('tap', '.js-order-view', function() { // 查看今日订单数
        Manage.orderView();
    }).on('tap', '.withdrawals', function() { // 提现
        Manage.withdrawals();
    });
    $foodKitchen.on('tap', '.js-go-fk', function() { // 菜品信息和厨房信息查看
        Manage.goFk($(this).data('type'));
    });
}(window || this, Zepto);
