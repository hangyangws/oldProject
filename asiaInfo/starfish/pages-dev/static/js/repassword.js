/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-25.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $password = $('#password'),
        $keyborad = $('#keyborad'),
        $submit = $('#submit'),
        $ipt = $password.find('.j-ipt'),
        _is_ajax = true,
        $now = $password.find('.li-focus'),
        Project = {
            visible: function() {
                $password.toggleClass('visible');
            },
            keyIn: function() {
                // 把值填入“输入框中”
                $now.data('num', $(this).data('num')).addClass('li-input');
                // 判断是否是最后一个输入框
                if (!$now.is(':last-child')) {
                    // 光标移动 下一个输入框聚焦
                    $now = $now.removeClass('li-focus').next().addClass('li-focus');
                }
            },
            del: function() {
                //  当前输入框有值
                if ($now.data('num')) {
                    $now.data('num', '').removeClass('li-input');
                    return;
                }
                // 判断是否是第一个输入框
                if (!$now.is(':first-child')) {
                    // 光标移动 上一个输入框聚焦
                    $now = $now.removeClass('li-focus').prev().addClass('li-focus');
                    // 删除上一个输入框的值
                    $now.data('num', '').removeClass('li-input');
                }
            },
            focus: function() {
                $now.removeClass('li-focus');
                $now = $(this).addClass('li-focus');
            },
            submit: function() {
                // 获取密码
                var _l = 6,
                    _pass = [];
                while (_l--) {
                    _pass.push($ipt.eq(_l).data('num'));
                }
                _pass = _pass.reverse().join('');
                // 判断密码
                if (!/^\d{6}$/.test(_pass)) {
                    Project.dataEnd('密码只能为6位数字');
                    return;
                }
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: win.G.baseUrl + '/my/passwd/change',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            passwd: _pass
                        },
                        success: function(_data) {
                            if (_data.code === 0) {
                                Project.dataEnd('操作成功');
                                setTimeout(function() {
                                    location.href = win.G.baseUrl + '/my';
                                }, 1500);
                            } else {
                                Project.dataEnd(_data.msg || '未知错误');
                            }
                        },
                        error: function() {
                            Project.dataEnd('网络堵塞');
                        }
                    });
                }
            },
            dataEnd: function(s) {
                layer.closeAll();
                s && layer.open({ content: s });
                _is_ajax = true;
            }
        };
    /**
     * event binding
     */
    $password
        .on(win.method, '.j-visible', Project.visible) // 显示密码
        .on(win.method, '.j-ipt', Project.focus) // 输入框聚焦
    $keyborad
        .on(win.method, '.j-num', Project.keyIn) // 键盘输入
        .on(win.method, '.j-del', Project.del); // 回删
    $submit
        .on(win.method, '.j-submit', Project.submit);
}(window || this, Zepto);
