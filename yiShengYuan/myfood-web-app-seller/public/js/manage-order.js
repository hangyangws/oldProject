;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-09.
 * [管理-订单]
 */

! function(win, $, undefined) {
    'use strict';
    var $main = $('#main'),
        $content = $('#content'), // 列表
        $toggleFull = $content.find('.toggle-full'),
        $orderList = $content.find('.order-list'),
        _useable_h,
        ManageOrder = {
            init: function() {
                var _con_h = $content.height();
                _useable_h = $(win).height() - 183; // 用于展示列表的可用高度
                if (_con_h > _useable_h) {
                    $content.height(_useable_h);
                    $orderList.height(_useable_h - 72);
                    // 绑定全屏触发事件
                    $content.on('tap', '.toggle-full', function() {
                        if ($main.is('.active')) {
                            $content.height(_useable_h);
                            $orderList.height(_useable_h -72);
                            $main.removeClass('active');
                        } else {
                            $content.height(_useable_h + 163);
                            $orderList.height(_useable_h + 91);
                            $main.addClass('active');
                        }
                    });
                } else {
                    $toggleFull.addClass('none');
                }
            }
        };
    /**
     * 事件绑定
     */
    // 页面初始化
    ManageOrder.init();
}(window || this, Zepto);
