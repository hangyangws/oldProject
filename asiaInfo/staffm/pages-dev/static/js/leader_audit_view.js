/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-03-03.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $perviewWrap = $('#perviewWrap'),
        $rejectMask = $('#rejectMask'),
        _data = { // 发送ajax的数据
            agree: null,
            msg: ''
        },
        Project = {
            init: function() {
                var $time = $perviewWrap.find('.j-perview-time');
                $time.html($time.data('time').replace(/-/g, '/').replace(' ', ' - '));
            },
            popupReject: function() {
                $rejectMask.removeClass('none');
            },
            closeReject: function() {
                $rejectMask.addClass('none');
            },
            dataSync: function() {
                var _val = $.trim(this.value);
                _data.msg = _val;
            },
            reply: function() {
                _data.agree = $(this).data('flag');
                _data.agree && (_data.msg = '');
                if (!_data.agree && _data.msg.length < 6) {
                    var $tip = $rejectMask.find('.j-reject-tip');
                    $tip.addClass('tip-error');
                    var _t = setTimeout(function() {
                        $tip.removeClass('tip-error');
                        clearTimeout(_t);
                    }, 1500);
                    return;
                }
                F.ajax({
                    data: _data,
                    type: 'POST',
                    url: win.G.auditUrl,
                    yes: function() {
                        F.jump({
                            url: win.G.goUrl[_data.agree]
                        });
                    }
                });
            }
        };
    Project.init();
    /**
     * event binding
     */
    $perviewWrap
        .on(win.method, '.j-reject', Project.popupReject) // 弹出拒绝窗口
        .on(win.method, '.j-reply', Project.reply); // 表态（同意）
    $rejectMask
        .on('input', '.j-reject-ipt', Project.dataSync)
        .on(win.method, '.j-reply', Project.reply) // 表态（驳回）
        .on(win.method, '.j-cancel-reject', Project.closeReject); // 退出拒绝窗口
}(window || this, Zepto);
