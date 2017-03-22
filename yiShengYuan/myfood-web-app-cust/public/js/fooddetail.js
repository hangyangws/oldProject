;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */
! function(win, $, undefined) {
    'use strict';
    var $win = $(win),
        $footer = $('#footer'),
        $footerPrice = $footer.find('.js-price'),
        $shop = $('#shop'),
        $footerNum = $footer.find('.js-num'),
        $addCar = $('#addCar'),
        $foodNum = $addCar.find('.js-food-num'),
        _is_ajax = true,
        FoodDetail = {
            carOpt: function($this) {
                // 判断是否登录
                if (G.userid) {
                    if (_is_ajax) {
                        _is_ajax = false;
                        win.oLoad();
                        $.ajax({
                            url: '/car/option',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                type: $this.data('type'),
                                foodid: G.foodid,
                                userid: G.userid
                            },
                            success: function(_data) {
                                if (_data.status) {
                                    FoodDetail.carSuccess(_data.data);
                                } else {
                                    FoodDetail.optEnd(_data.msg);
                                }
                            },
                            error: function() {
                                FoodDetail.optEnd('网络出错');
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
                // _data -> {totalCount: 12, totalAmount: 120, foodTotalCount: 12}

                // 购物车操作按钮的显示与否
                if (_data.foodTotalCount) {
                    $addCar.addClass('active');
                } else {
                    $addCar.removeClass('active');
                }
                // 改变当前菜品的数量
                $foodNum.html(_data.foodTotalCount);

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

                FoodDetail.optEnd();
            },
            toShop: function() {
                if (G.device == 1) {
                    // android
                    win.android.toShop(G.shopid, G.shopName);
                } else {
                    // ios
                    location.href = 'objc://ToShop/' + G.shopid + '/' + G.shopName;
                }
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
            }
        };
    /**
     * 事件绑定
     */
    $addCar.on('tap', '.js-car-opt', function() { // 购车车加减
        FoodDetail.carOpt($(this));
    });
    $shop.on('tap', '.js-to-shop', function() { // 进入店铺
        FoodDetail.toShop();
    });
    // 结算
    $footer.on('tap', '.js-statement', function() {
        FoodDetail.statement();
    }).on('tap', '.js-to-car', function() { // 进入购物车
        FoodDetail.toCar();
    });
}(window || this, Zepto);
