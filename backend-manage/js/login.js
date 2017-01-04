/**
 * Lg 后台管理登陆 login
 * fj in 2015-11-05
 */

! function($) {
    "use strict";
    var Lg = (function() {
        var _login_f = true,
            name = $('#name'),
            pass = $('#pass'),
            err = $('#error'),
            success_url = 'index.php';
        return {
            login: function() {
                var name_v,
                    pass_v;
                _login_f && (
                    _login_f = false,
                    Lg.tip('登陆中...', false),
                    name_v = $.trim(name.val()),
                    pass_v = $.trim(pass.val()),
                    (name_v && pass_v) && (
                        $.ajax({
                            type: 'POST',
                            contentType: "application/json",
                            url: 'temp/login.php',
                            data: '{"username":"' + name_v + '","password":"' + pass_v + '"}',
                            success: function(r) {
                                r = JSON.parse(r);
                                r.status === 'success' && (
                                    Lg.tip('登陆成功', false),
                                    // 跳转页面
                                    location.href = success_url
                                ) || (
                                    Lg.tip(r.msg, true)
                                );
                            },
                            error: function() {
                                Lg.tip('网络堵塞', true);
                            }
                        })
                    ) || (
                        Lg.tip('字段不能为空', true)
                    )
                );
            },

            tip: function(t, s) {
                err.css('color', s ? '#f00' : '#bdb099').html(t);
                _login_f = true;
            }
        };
    })();

    // 点击登陆
    $('#submit').on('click', function() {
        Lg.login();
    });

    $('input').on({
        // 字段 聚焦
        focus: function() {
            Lg.tip('&emsp;');
        },
        // 字段 回车
        keyup: function(e) {
            e = e || window.e;
            e.keyCode === 13 && (
                $('#submit').trigger('click')
            );
        }
    });
}(jQuery);
