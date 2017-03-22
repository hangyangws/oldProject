;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-25.
 * [菜品信息]
 */

! function(win, $, undefined) {
    'use strict';
    var $orderWrap = $('#orderWrap'),
        $tpStatusBtn = $('#tpStatusBtn'),
        _none_order_html = $('#tpNoData').html(),
        _order_list_html = $('#tpOrderList').html(),
        _status_btn_html = {
            CUSTCONFIRMCASH: $tpStatusBtn.find('.js-CUSTCONFIRMCASH').html(),
            CUSTPAY: $tpStatusBtn.find('.js-CUSTPAY').html(),
            SHOPTAKE: $tpStatusBtn.find('.js-SHOPTAKE').html(),
            SHOPFINISH: $tpStatusBtn.find('.js-SHOPFINISH').html(),
            SHOPREFUSE: $tpStatusBtn.find('.js-SHOPREFUSE').html(),
        },
        _is_ajax = true,
        _page_count = 10, // 一页加载多少数据
        _pagenum = 1, // 即将要加载的页数
        Order = {
            init: function() {
                // 加载第一页订单数据
                Order.orderList();
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
                            shopId: G.shopId,
                            category: G.orderType
                        },
                        success: function(_data) {
                            if (_data.status) {
                                Order.renderOrderList(_data.data);
                                ++_pagenum;
                            } else {
                                if (_pagenum === 1) {
                                    $orderWrap.html(_none_order_html.replace('${msg}', _data.isempty ? '您暂时还没有订单哦' : _data.msg));
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
                        .replace('${diningtypename}', _item.diningtypename)
                        .replace('${freight}', _item.freight)
                        .replace('${orderaddress}', _item.orderaddress)
                        .replace('${paymentamount}', _item.paymentamount)
                        .replace('${orderstatus}', _status_btn_html[_item.orderstatus])
                    );
                }
                // 插入dom
                $orderWrap.append(_temp.reverse().join(''));
            },
            orderOpt: function($this) {
                var $order;
                if (_is_ajax) {
                    _is_ajax = false;
                    win.oLoad();
                    $order = $this.closest('.order-item');
                    $.ajax({
                        url: '/order/operate',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            orderId: $order.data('id'),
                            type: $this.data('type')
                        },
                        success: function(_data) {
                            if (_data.status) {
                                win.cConfrim();
                                Order.slideUp($order, function() {
                                    location.reload(true);
                                });
                            } else {
                                win.reConfrim(_data.msg, true);
                            }
                            win.cLoad();
                            _is_ajax = true;
                        },
                        error: function() {
                            win.cLoad();
                            win.reConfrim('网络出错');
                            setTimeout(function() {
                                win.cConfrim();
                            }, 800);
                            _is_ajax = true;
                        }
                    });
                }
            },
            slideUp: function($item, callb) {
                $item.height($item.height() - 10);
                setTimeout(function() {
                    $item.addClass('active');
                    setTimeout(function() {
                        $item.remove();
                        callb && callb();
                    }, 800);
                }, 100);
            },
            orderDetail: function($item) {
                var orderId = $item.data('id'),
                    orderType = G.orderType;
                if (G.device == 1) {
                    // Android
                    win.android.toOrderDetail(orderId, orderType);
                } else {
                    // IOS
                    location.href = 'objc://orderDetail:' + orderId + '&' + orderType;
                }
            }
        };
    /**
     * 事件绑定
     */
    Order.init(); // 项目初始化
    $orderWrap.on('tap', '.js-order-opt', function() { // 订单操作（拒绝 || 接受 || 确认完成）
        var $this = $(this),
            msg = {
                refuse: '确认拒绝此订单',
                take: '确认接受此订单',
                finish: '确认完成此订单'
            };
        win.oConfrim(msg[$this.data('type')], false, function() {
            Order.orderOpt($this);
        });
    }).on('tap', '.order-detail', function() { // 查看订单
        // Order.orderDetail($(this).closest('.order-item'));
    }).on('scroll', function() { // 订单滚动
        (this.scrollHeight - this.offsetHeight === this.scrollTop) && Order.orderList();
    });
}(window || this, Zepto);
