;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-25.
 * [菜品信息]
 */

! function(win, $, undefined) {
    'use strict';
    var $orderWrap = $('#orderWrap'),
        _none_order_html = $('#noneOrder').html(),
        _order_list_html = $('#tpOrderList').html(),
        $tpStatusBtn = $('#tpStatusBtn'),
        _status_btn_html = {
            CUSTCONFIRM: $tpStatusBtn.find('.js-CUSTCONFIRM').html(),
            CUSTCONFIRMCASH: $tpStatusBtn.find('.js-CUSTCONFIRMCASH').html(),
            CUSTPAY: $tpStatusBtn.find('.js-CUSTPAY').html(),
            SHOPTAKE: $tpStatusBtn.find('.js-SHOPTAKE').html(),
            SHOPFINISH: $tpStatusBtn.find('.js-SHOPFINISH').html(),
            SHOPREFUSE: $tpStatusBtn.find('.js-SHOPREFUSE').html()
        },
        _is_ajax = true,
        _page_count = 10, // 一页加载多少数据
        _pagenum = 1, // 即将要加载的页数
        Order = {
            init: function() {
                // 加载第一页订单列表数据
                Order.orderList();
            },
            orderCancel: function($this) {
                var $order;
                if (_is_ajax) {
                    win.oConfrim('确认取消此订单', false, function() {
                        _is_ajax = false;
                        $order = $this.closest('.order-item');
                        win.cConfrim();
                        $.ajax({
                            url: '/order/cancel',
                            type: 'POST',
                            dataType: 'json',
                            data: { orderId: $order.data('orderid') },
                            success: function(_data) {
                                if (_data.status) {
                                    win.cLoad();
                                    Order.slideUp($order, function() {
                                        win.location.reload();
                                    });
                                } else {
                                    Order.endOpt(_data.msg);
                                }
                                _is_ajax = true;
                            },
                            error: function() {
                                Order.endOpt('网络错误');
                            }
                        });
                    });
                }
            },
            endOpt: function(_msg) {
                win.cLoad();
                _is_ajax = true;
                if (_msg) {
                    win.reConfrim(_msg);
                    setTimeout(function() {
                        win.cConfrim();
                    }, 800);
                }
            },
            slideUp: function($item, callb) {
                $item.height($item.height() - 10);
                setTimeout(function() {
                    $item.addClass('active');
                    setTimeout(function() {
                        callb && callb();
                    }, 400);
                }, 80);
            },
            orderDetail: function($item) {
                var orderId = $item.data('orderid');
                if (G.device == 1) {
                    // Android
                    win.android.toOrderDetail(orderId);
                } else {
                    // IOS
                    location.href = 'objc://OrderDetail/' + orderId;
                }
            },
            pay: function($this) {
                var orderId = $this.closest('.order-item').data('orderid');
                if (G.device == 1) {
                    // Android
                    win.android.orderPay(orderId);
                } else {
                    // IOS
                    location.href = 'objc://OrderPay/' + orderId;
                }
            },
            orderList: function() {
                if (_is_ajax) {
                    _is_ajax = true;
                    win.oLoad();
                    $.ajax({
                        url: '/order/list',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            pagenum: _pagenum,
                            count: _page_count,
                            memberid: G.userId,
                            category: G.orderType
                        },
                        success: function(_data) {
                            if (_data.status) {
                                Order.renderOrderList(_data.data);
                                ++_pagenum;
                            } else {
                                if (_pagenum === 1) {
                                    $orderWrap.html(_none_order_html.replace('${msg}', _data.isempty ? '您暂时还没有订单哦~' : _data.msg));
                                } else {
                                    if (!_data.isempty) {
                                        win.oConfrim(_data.msg, true);
                                    }
                                }
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
                }
            },
            renderOrderList: function(_data) {
                var _temp = [],
                    _items = _data.list,
                    _l = _items.length,
                    _item;
                while (_l--) {
                    _item = _items[_l];
                    _temp.push(_order_list_html
                        .replace('${orderid}', _item.orderid)
                        .replace('${ordersn}', _item.ordersn)
                        .replace('${createtime}', _item.createtime)
                        .replace('${expectdeliverytime}', _item.expectdeliverytime)
                        .replace('${diningtypename}', win.dinType[_item.diningtypename])
                        .replace('${freight}', _item.freight)
                        .replace('${orderaddress}', _item.orderaddress)
                        .replace('${paymentamount}', _item.paymentamount)
                        .replace('${orderstatus}', _status_btn_html[_item.orderstatus])
                        .replace('${unpay}', (_item.freight !== undefined) || 'unpay-active')
                    );
                }
                // 插入dom
                $orderWrap.append(_temp.reverse().join(''));
            }
        };

    /**
     * 事件绑定
     */
    Order.init(); // 页面初始化
    $orderWrap.on('tap', '.js-order-del', function() { // 订单操作取消
        Order.orderCancel($(this));
    }).on('tap', '.js-order-pay', function() { // 去支付
        Order.pay($(this));
    }).on('tap', '.order-detail', function() { // 查看订单
        // Order.orderDetail($(this).closest('.order-item'));
    }).on('scroll', function() { // 订单滚动
        (this.scrollHeight - this.offsetHeight === this.scrollTop) && Order.orderList();
    });
}(window || this, Zepto);
