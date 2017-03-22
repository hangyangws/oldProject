/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-06.
 */

;
! function(win, $, undefined) {
    'use strict';
    var Project = {
        init: function() {
            // 图便一步夹杂、动画
            win.$content = $('#content');
            Project.imgLoadCallb(win.$content.data('i'), function() {
                // 动画
                $content.addClass('result-wrap-load');
                // 移除data-bg属性
                win.$content.removeAttr('data-i');
                delete win.$content;
            });
        },
        imgLoadCallb: function(_img_url, _callb) {
            var Img = new Image();
            Img.src = _img_url;
            var _time = setInterval(function() {
                Img.complete && (
                    _callb(),
                    clearInterval(_time)
                );
            }, 60);
        }
    };
    // 项目初始化
    Project.init();
}(window || this, Zepto);
