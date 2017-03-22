;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */
! function(win, $, undefined) {
    'use strict';
    var $footer = $('#footer'),
        PayReturn = {
            pageGo: function(_type) {
                if (G.device == 1) {
                    // android
                    if (_type === 'index') {
                        win.android.toIndex();
                    } else {
                        win.android.toOrder();
                    }
                } else {
                    // ios
                    if (_type === 'index') {
                        location.href = 'objc://ToIndex';
                    } else {
                        location.href = 'objc://ToOrder';
                    }
                }
            }
        };

    /**
     * 本页面事件绑定
     */
    $footer.on('tap', '.js-page-go', function() {
        PayReturn.pageGo($(this).data('page'));
    });
}(window || this, Zepto);
