/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-07.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $body = $('#body'),
        _is_ajax = true,
        Project = {
            init: function() {
                // 二维码生成
                var qrcode = new QRCode('qrcode', {
                    text: win.G.shareUrl,
                    correctLevel: QRCode.CorrectLevel.H
                });
                // 背景动画加载
                Project.imgLoadCallb($body.data('bg'), function() {
                    $body.addClass('bg-active').removeAttr('data-bg');
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
            },
            dataEnd: function(s) {
                layer.closeAll();
                s && layer.open({ content: s });
                _is_ajax = true;
            }
        };
    // 项目初始化
    Project.init();
    /**
     * event binding
     */
}(window || this, Zepto);
