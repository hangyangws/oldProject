/**
 * [created by hangyangw in 2016-03-06]
 * @return {[Room]} [Object]
 */
;
! function($) {
    "use strict";
    var $carousel = $('#carousel'),
        $roomList = $('#roomList'),
        $pay = $('#pay'), // 支付弹窗
        Room = (function() {
            var _win_width = $('#body').width(),
                $imgWrap = $carousel.find('.img-wrap'),
                $roomName = $pay.find('.target-room-name'), // 当前房间名字
                $roomPri = $pay.find('.target-room-price'), // 当前房间价格
                $roomBkf = $pay.find('.target-room-bkf'), // 当前房间是否含早
                $tel = $pay.find('.tel'), // 预定手机号
                $person = $pay.find('.person'), // 预定联系人
                $imgDirWrap = $carousel.find('.img-dir-wrap'),
                $img = $imgWrap.find('img'),
                _now_img = 0, // 当前滚动位置
                _img_l = $img.length, // 图片数量
                _img_rat = 2.26, // 轮播图宽高比列配置
                _is_ajax = true,
                // 支付发送的数据
                _post_data = {
                    roomtotalquantity: 1,
                    roomquantity: 1,
                    hotelid: Render.hotelid,
                    indate: Render.indate,
                    hotelName: Render.hotelName,
                    outdate: Render.outdate,
                    spbill_create_ip: returnCitySN.cip
                };
            return {
                init: function() {
                    // 图片轮播器初始化
                    Room.carouselInit();
                },
                carouselInit: function() {
                    var _l = _img_l,
                        _temp_html = [];
                    // 计算窗口宽度 给图片赋值
                    $carousel.height(_win_width / _img_rat);
                    $img.width(_win_width);
                    // 渲染img-dir
                    if ($img.length > 1) {
                        while (_l--) {
                            _temp_html.push('<a class="img-dir" data-i="' + _l + '"></a>');
                        }
                        _temp_html.reverse();
                        _temp_html[0] = '<a class="img-dir active" data-i="0"></a>';
                        $imgDirWrap.html(_temp_html.join(''));
                        _img_l = _img_l - 1;
                        // 图片导航点击
                        $carousel.on('tap', '.img-dir', function() {
                            Room.carouselMove($(this).data('i'));
                        });
                        // 图片左右滑动
                        $carousel.on('swipeLeft', function() {
                            Room.carouselMove(_now_img + 1);
                        });
                        $carousel.on('swipeRight', function() {
                            Room.carouselMove(_now_img - 1);
                        });
                    } else {
                        $imgDirWrap.remove();
                    }
                },
                carouselMove: function(n) {
                    var _l;
                    n = n > _img_l ? 0 : n;
                    n = n < 0 ? _img_l : n;
                    _l = n * -_win_width;
                    $imgWrap.css({
                        '-webkit-transform': 'translateX(' + _l + 'px)',
                        '-moz-transform': 'translateX(' + _l + 'px)',
                        '-ms-transform': 'translateX(' + _l + 'px)',
                        '-o-transform': 'translateX(' + _l + 'px)',
                        'transform': 'translateX(' + _l + 'px)'
                    });
                    $imgDirWrap.find('.img-dir').removeClass('active')
                        .filter('[data-i="' + n + '"]').addClass('active');
                    _now_img = n;
                },
                pay: function($this) {
                    if (_is_ajax) {
                        _is_ajax = false;
                        // 检验手机号
                        var _tel = $tel.val(),
                            _name = $person.val(),
                            _reg = /(^13\d{9}$)|(^14)[5,7]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[6,7,8]\d{8}$|(^18\d{9}$)/g;
                        if (_tel.length !== 11 || !_reg.test(_tel)) {
                            layer.open({ content: '请填写正确的手机号' });
                            _is_ajax = true;
                            return;
                        };
                        _post_data.mobile = _tel;
                        // 检测联系人
                        if (!_name) {
                            layer.open({ content: '请填写联系人' });
                            _is_ajax = true;
                            return;
                        }
                        _post_data.name = _name;
                        _post_data.roomName = Render.roomName;

                        $this.html('处理中…');
                        $.ajax({
                            url: '/order',
                            type: 'POST',
                            dataType: 'json',
                            data: _post_data,
                            success: function(_d) {
                                $this.html('确&emsp;定');
                                if (_d.status) {
                                    layer.open({ content: '酒店预订成功, 工作人员会在1小时内和您联系!' });
                                    setTimeout(function() {
                                        location.href = '/searchHotel/user';
                                    }, 2000);
                                } else {
                                    layer.open({ content: _d.msg });
                                    _is_ajax = true;
                                }
                            },
                            error: function() {
                                layer.open({ content: '网络堵塞' });
                                _is_ajax = true;
                            }
                        });
                    }
                },
                onBridgeReady: function(args) {
                    // 弹出微信支付窗口
                    if (!args.payargs.err) {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest',
                            args.payargs,
                            function(res) {
                                if (res.err_msg === "get_brand_wcpay_request:ok") {
                                    layer.open({
                                        content: '支付成功'
                                    });
                                    setTimeout(function() {
                                        location.href = '/searchHotel/user?p=1';
                                    }, 1000);
                                } else {
                                    layer.open({
                                        // content: '支付失败:' + JSON.stringify(res)
                                        content: '支付失败，请1小时内支付'
                                    });
                                    setTimeout(function() {
                                        location.href = '/searchHotel/user';
                                    }, 1000);
                                }
                            }
                        );
                    } else {
                        layer.open({
                            content: args.payargs.err.err_code_des
                        });
                        setTimeout(function() {
                            location.href = '/searchHotel/user';
                        }, 1000);
                    }
                },
                order: function($li) {
                    var _total_price = Room.sunNum($li.data('pri'), Room.dateDiff(Render.indate.slice(0, 10), Render.outdate.slice(0, 10)));
                    $roomName.html($li.data('name'));
                    Render.roomName = $li.data('name');
                    $roomPri.html(_total_price + '元');
                    $roomBkf.html($li.data('breakfast') ? '含早' : '不含早');
                    $pay.removeClass('none');
                    // 构造数据
                    _post_data.roomtotalprice = _total_price;
                    _post_data.roomid = $li.data('id');
                },
                dateDiff: function(_d1, _d2) {
                    //_d1：开始日期 _d2：结束日期  格式：2006-12-01
                    _d1 = _d1.split('-');
                    _d1 = new Date(_d1[0], _d1[1] - 1, _d1[2]);
                    _d2 = _d2.split('-');
                    _d2 = new Date(_d2[0], _d2[1] - 1, _d2[2]);
                    return ~~((_d2 - _d1) / 86400000); //把相差的毫秒数转换为天数
                },
                sunNum: function(n1, n2) {
                    var l1, l2;
                    try {
                        l1 = n1.toString().split(".")[1].length;
                    } catch (e) {
                        l1 = 0;
                    }
                    try {
                        l2 = n2.toString().split(".")[1].length;
                    } catch (e) {
                        l2 = 0;
                    }
                    l1 = Math.pow(10, Math.max(l1, l2)); // 该除的10次方数
                    return ~~(~~(n1 * l1) * ~~(n2 * l1)) / (l1 * l1);
                }
            };
        })();
    // 页面初始化
    Room.init();
    // 预定
    $roomList.on('tap', '.order-sub', function() {
        Room.order($(this).closest('li'));
    });
    // 取消预定
    $pay.on('tap', function(e) {
        !$.contains(this, e.target) && $pay.addClass('none');
    });
    // 确认
    $pay.on('tap', '.submit-pay', function() {
        Room.pay($(this));
    });
}(Zepto);
