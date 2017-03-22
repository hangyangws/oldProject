;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */
! function(win, $, undefined) {
    'use strict';
    var $footer = $('#footer'),
        $shopWrap = $('#shopWrap'),
        _no_data_html = $('#tpNoData').html(),
        $footerPrice = $footer.find('.js-price'),
        _is_ajax = true,
        Car = {
            statement: function() {
                // 原生跳转到订单确认页面
                if (!$footer.is('.active')) {
                    if (G.device == 1) {
                        // android
                        win.android.statement();
                    } else {
                        // ios
                        location.href = 'objc://Statement';
                    }
                }
            },
            del: function($this) {
                var $shopItem = $this.closest('.js-shop-item');
                if (_is_ajax) {
                    // 弹窗确认
                    win.oConfrim('从购物车删除此店铺', false, function() {
                        if ($shopItem.find('.js-car-num').html() !== '0') {
                            _is_ajax = false;
                            win.oLoad();
                            $.ajax({
                                url: '/car/del',
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    userId: G.userId,
                                    shopId: $shopItem.data('id')
                                },
                                success: function(_data) {
                                    if (_data.status) {
                                        if (_data.totalAmount === '0.00') { // 删除最后一条购物车
                                            // 移除页脚，提示没有数据
                                            Car.slideUp($shopItem);
                                            $shopWrap.html(_no_data_html);
                                            $footer.remove();
                                        } else {
                                            // 改变购物车价格
                                            $footerPrice.html(_data.totalAmount);
                                            // 删除当前dom
                                            Car.slideUp($shopItem);
                                        }
                                        Car.endOpt();
                                    } else {
                                        Car.endOpt(_data.msg);
                                    }
                                },
                                error: function() { Car.endOpt('网络出错'); }
                            });
                        } else { // 当前购物车已经没有此店铺数据
                            win.oLoad();
                            Car.slideUp($shopItem, function() {
                                // 检测页面还有没有其他数据
                                if (!$shopWrap.find('.js-shop-item').length) {
                                    $shopWrap.html(_no_data_html);
                                    $footer.remove();
                                }
                                Car.endOpt();
                            });
                        }
                    });
                }
            },
            endOpt: function(_msg) {
                win.cLoad();
                win.cConfrim();
                _msg && win.oConfrim(_msg, true);
                _is_ajax = true;
            },
            slideUp: function($dom, _callb) {
                $dom.addClass('tsf-height');
                $dom.height($dom.height());
                var _time = setTimeout(function() {
                    $dom.css({
                        height: 0,
                        margin: 0,
                        padding: 0
                    });
                    clearTimeout(_time);
                    _time = setTimeout(function() {
                        clearTimeout(_time);
                        $dom.remove();
                        _callb && _callb();
                    }, 1200);
                }, 100);
            },
            carOpt: function($this) {
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
                            diningtypename: $this.closest('.js-shop-item').data('dintypename')
                        },
                        success: function(_data) {
                            if (_data.status) {
                                _data.data.addCar = $this.closest('.js-add-car');
                                Car.carSuccess(_data.data);
                            } else {
                                Car.endOpt(_data.msg);
                            }
                        },
                        error: function() {
                            Car.endOpt('网络出错');
                        }
                    });
                }
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
                    $footer.removeClass('active');
                } else {
                    $footer.addClass('active');
                }
                // 改变页脚购物车的价格
                $footerPrice.html(_data.totalAmount);

                Car.endOpt();
            },
            goIndex: function() {
                if (G.device == 1) {
                    // android
                    win.android.goIndex();
                } else {
                    // ios
                    location.href = 'objc://goIndex';
                }
            },
            goFood: function($this) {
                var _food_id = $this.closest('.js-food-item').data('id');
                if (G.device == 1) {
                    // android
                    win.android.goFood(_food_id);
                } else {
                    // ios
                    location.href = 'objc://GoFood/' + _food_id;
                }
            }
        };
    /**
     * 事件绑定
     */
    $shopWrap.on('tap', '.js-car-opt', function() { // 购车车加减
        Car.carOpt($(this));
    }).on('tap', '.js-del', function() { // 删除购物车
        Car.del($(this));
    }).on('tap', '.js-go-index', function() { // 去首页
        Car.goIndex();
    }).on('tap', '.js-go-food', function() {
        Car.goFood($(this));
    });

    $footer.on('tap', '.js-statement', function() { // 结算
        Car.statement();
    });
}(window || this, Zepto);
