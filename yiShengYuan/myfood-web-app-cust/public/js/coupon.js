;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */
! function(win, $, undefined) {
    'use strict';
    var $win = $(win),
        _width = $win.width(),
        $main = $('#main'),
        $nav = $('#nav'),
        $navList = $('#nav').find('a'),
        $listWrap = $main.find('.js-list-wrap'),
        _html_dis = $('#tpDiscount').html(),
        _is_ajax = true,
        _is_load = { // 判断是否加载过
            '1': false,
            '2': false,
            '3': false,
            '4': false
        },
        Coupon = {
            init: function() {
                // 给list-wrap赋值宽度
                $listWrap.width(_width);
                // 加载默认的type
                Coupon.loadTypeList(G.type);
            },
            loadTypeList: function(_type) { // _type 为 1 到 4 的整数或字符串
                // 移动到对应的位置
                var _l = _width * (1 - _type);
                $main.css({
                    '-webkit-transform': '-webkit-translateX(' + _l + 'px)',
                    '-moz-transform': '-moz-translateX(' + _l + 'px)',
                    '-o-transform': '-o-translateX(' + _l + 'px)',
                    'transform': 'translateX(' + _l + 'px)'
                });
                // 高亮对应的导航栏
                $navList.removeClass('nav-active');
                $navList.eq(_type - 1).addClass('nav-active');
                // 判断是否加载过
                if (_is_load[_type]) {
                    // 重置当前加载对象
                    G.type = _type;
                } else {
                    // 加载动画
                    win.oLoad();
                    // 加载数据
                    if (_is_ajax) {
                        _is_ajax = false;
                        $.ajax({
                            url: '/coupon/list',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                type: _type,
                                userId: G.userId
                            },
                            success: function(_data) {
                                if (_data.status) {
                                    // 拼接数据
                                    var _list = _data.couponList,
                                        _l = _list.length,
                                        _temp,
                                        _html = [];
                                    while (_l--) {
                                        _temp = _list[_l];
                                        _html.push(_html_dis
                                            .replace('${full}', _temp.full)
                                            .replace('${expiryDate}', _temp.expiryDate)
                                            .replace('${discount}', _temp.discount)
                                        );
                                    }
                                    // 展示数据
                                    $main.find('.js-list-wrap-' + _type).html(_html.join(''));
                                    // 设置当前类型加载过
                                    _is_load[_type] = true;
                                    // 重置当前加载对象
                                    G.type = _type;

                                    Coupon.dataEnd();
                                } else {
                                    Coupon.dataEnd(_data.msg);
                                }
                            },
                            error: function() {
                                Coupon.dataEnd('网络错误');
                            }
                        });
                    }
                }
            },
            dataEnd: function(_msg) {
                win.cLoad();
                _msg && win.oConfrim(_msg);
                _is_ajax = true;
            },
            swipe: function(_dir) {
                // 方向判断
                var _type = ~~G.type;
                if (_dir === 'right' && _type > 1) {
                    Coupon.loadTypeList(_type - 1);
                    return;
                }
                if (_dir === 'left' && _type < 4) {
                    Coupon.loadTypeList(_type + 1);
                }
            }
        };

    /**
     * 事件绑定
     */
    Coupon.init(); // 页面初始化
    $main.on('swipeLeft', function() { // 屏幕左滑
        Coupon.swipe('left');
    }).on('swipeRight', function() { // 屏幕右滑
        Coupon.swipe('right');
    });

    $win.on('resize', function() {
        $listWrap.width(_width = $win.width());
    });
    $nav.on('tap', 'a', function() {
        Coupon.loadTypeList($(this).data('type'))
    });
}(window || this, Zepto);
