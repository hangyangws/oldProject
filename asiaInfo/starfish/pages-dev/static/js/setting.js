/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-15.
 */

! function(win, $, undefined) {
    'use strict';
    var $footer = $('#footer'),
        _is_ajax = true, // 是否可以发送ajax
        Project = {
            loginOut: function() {
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: win.G.baseUrl + '/logout',
                        dataType: 'json',
                        success: function(_data) {
                            if (_data.code === 0) {
                                win.location.href = win.G.baseUrl + '/login';
                            } else {
                                Project.dataEnd(_data.msg);
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
    $footer
        .on(win.method, Project.loginOut); // 注销
}(window || this, Zepto);
