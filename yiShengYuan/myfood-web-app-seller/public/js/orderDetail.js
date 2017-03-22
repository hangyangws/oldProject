;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-06.
 * [订单详情]
 */

! function(win, $, undefined) {
    'use strict';
    var $listCon = $('#listCon'),
        $win = $(win),
        $contact = $('#contact'),
        $footerBtn = $('#footerBtn'),
        _order_html = {
            refuse: $('#orderRefuse').html(),
            accept: $('#orderAccept').html()
        },
        _order_msg = {
            refuse: '确认拒绝此订单',
            accept: '确认接受此订单',
            sure: '确认完成此订单'
        },
        _is_ajax = true,
        OrderDetail = {
            init: function() {
                // 排版菜品
                OrderDetail.foodList();
                // 订单字符串更新
                _order_html.sure = _order_html.refuse;
            },
            foodList: function() {
                var _w = $listCon.width() - 20,
                    item_w = _w / 5,
                    space_w = _w / 15;
                $listCon.find('.list-item').css({
                    "width": item_w,
                    "padding-right": space_w
                });
                $listCon.find('.img-wrap').css({
                    height: item_w
                });
            },
            contact: function($this) {
                var _tel = $this.data('tel') + '';
                if (G.device == 1) {
                    // Android
                    win.android.toCallSeller(_tel);
                } else {
                    // IOS
                    location.href = 'objc://toCallSeller/' + _tel;
                }
            },
            orderOpt: function($this, _type) {
                if (_is_ajax) {
                    _is_ajax = false;
                    win.reConfrim('操作中…');
                    $.ajax({
                        url: '/order/operate',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            id: G.orderId,
                            type: _type
                        },
                        success: function(_data) {
                            if (_data.status) {
                                win.cConfrim();
                                $footerBtn.html(_order_html[_type]);
                            } else {
                                win.reConfrim(_data.msg);
                                setTimeout(function() {
                                    win.cConfrim();
                                }, 800);
                            }
                            _is_ajax = true;
                        },
                        error: function() {
                            win.reConfrim('操作失败');
                            setTimeout(function() {
                                win.cConfrim();
                            }, 800);
                            _is_ajax = true;
                        }
                    });
                }
            }
        };
    /**
     * 事件绑定
     */
    OrderDetail.init();
    // 窗口大小改变事件
    $win.on('resize', function() {
        OrderDetail.foodList();
    });
    // 拨打电话
    $contact.on('tap', '.js-contact-tel', function() {
        OrderDetail.contact($(this));
    });
    // 订单操作（拒绝 || 接受 || 完成）
    $footerBtn.on('tap', '.js-order-opt', function() {
        var $this = $(this),
            _type = $this.data('type');
        win.oConfrim(_order_msg[_type], false, function() {
            OrderDetail.orderOpt($this, _type);
        });
    });
}(window || this, Zepto);
