/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-03-02.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $footer = $('#footer'),
        Project = {
            init: function() {
                // 日历初始化
                new Calendar($('.calendar-wrap')[0], JSON.parse(G.worktime));
            },
            sureSelect: function() {
                // 保存数据
                localStorage.supporter = JSON.stringify(win.G.supporter);
                location.href = win.G.goUrl;
            }
        };
    Project.init();
    /**
     * event binding
     */
    $footer
        .on(win.method, '.j-submit-btn', Project.sureSelect); // 登录
}(window || this, Zepto);
