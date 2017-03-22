;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */
! function(win, $, undefined) {
    'use strict';
    var $foodList = $('#foodList'),
        $shopName = $('#shopName'),
        $footer = $('#footer'),
        $send = $('#send'),
        $sendMoney = $send.find('.js-send-money'),
        $footerNum = $footer.find('.js-num'),
        $footerPrice = $footer.find('.js-price'),
        _is_ajax = true,
        Shop = {
            carOpt: function($this) {
                if (G.userId) {
                    if (_is_ajax) {
                        _is_ajax = false;
                        win.oLoad();
                        $.ajax({
                            url: '/car/option',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                type: $this.data('type'),
                                foodid: $this.closest('.js-food-item').data('id'),
                                userid: G.userId,
                                diningtypename: $send.find('.js-din-mode.active').data('enname')
                            },
                            success: function(_data) {
                                if (_data.status) {
                                    _data.data.addCar = $this.closest('.js-add-car');
                                    Shop.carSuccess(_data.data);
                                } else {
                                    Shop.optEnd(_data.msg);
                                }
                            },
                            error: function() {
                                Shop.optEnd('网络出错');
                            }
                        });
                    }
                } else {
                    win.login();
                }
            },
            optEnd: function(_msg) {
                win.cLoad();
                _msg && win.oConfrim(_msg, true);
                _is_ajax = true;
            },
            carSuccess: function(_data) {
                // _data -> {totalCount: 0, totalAmount: 123, foodTotalCount: 12, addCar: $dom}

                // 购物车操作按钮的显示与否
                if (_data.foodTotalCount) {
                    _data.addCar.addClass('active');
                } else {
                    _data.addCar.removeClass('active');
                }
                // 改变当前菜品的数量
                _data.addCar.find('.js-car-num').html(_data.foodTotalCount);

                // 页脚显示灰色还是彩色
                if (_data.totalCount) {
                    $footer.addClass('active');
                } else {
                    $footer.removeClass('active');
                }
                // 改变页脚购物车的价格
                $footerPrice.html(_data.totalAmount);
                // 改变页脚购物车数量
                $footerNum.html(_data.totalCount);

                Shop.optEnd();
            },
            statement: function() {
                if ($footer.is('.active')) {
                    if (G.device == 1) {
                        // android
                        win.android.statement();
                    } else {
                        // ios
                        location.href = 'objc://Statement';
                    }
                }
            },
            toCar: function() {
                if ($footer.is('.active')) {
                    if (G.device == 1) {
                        // android
                        win.android.toCar();
                    } else {
                        // ios
                        location.href = 'objc://ToCar';
                    }
                }
            },
            goShop: function($this) {
                var _food_id = $this.closest('.js-food-item').data('id');
                if (G.device == 1) {
                    // android
                    win.android.goFood(_food_id);
                } else {
                    // ios
                    location.href = 'objc://GoFood/' + _food_id;
                }
            },
            choiceDinType: function($this) {
                $this.siblings('.active').removeClass('active');
                $this.addClass('active');
                // 修改配送费
                $sendMoney.html($this.data('freight'));
            },
            call: function() {
                if (G.device == 1) {
                    // android
                    win.android.callPhone(G.phone);
                } else {
                    // ios
                    location.href = 'objc://callPhone:/' + G.phone;
                }
            }
        };

    /**
     * 事件绑定
     */
    $shopName.on('tap', '.js-phone', function() { // 打店铺电话
        Shop.call();
    });
    $foodList.on('tap', '.js-car-opt', function() { // 购车车加减
        Shop.carOpt($(this));
    }).on('tap', '.js-go-food', function() {
        Shop.goShop($(this));
    });
    $send.on('tap', '.js-din-mode', function() { // 就餐方式选择
        Shop.choiceDinType($(this));
    });
    $footer.on('tap', '.js-statement', function() { // 结算
        Shop.statement();
    }).on('tap', '.js-to-car', function() { // 进入购物车
        Shop.toCar();
    });
}(window || this, Zepto);
