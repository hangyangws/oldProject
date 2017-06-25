/**
 * [created by hangyangw in 2016-05-20]
 * @return {[Login]} [Object]
 */
! function($) {
    "use strict";
    var $form = $('#form'),
        $password = $form.find('.password'),
        $repassword = $form.find('.re-password'),
        _is_ajax = true,
        Login = {
            setPass: function() {
                var _pass = $password.val(),
                    _reg = /^[A-Za-z0-9]{6,20}$/;
                if (_is_ajax) {
                    _is_ajax = false;
                    if (_reg.test(_pass)) {
                        if (_pass === $repassword.val()) {
                            $.ajax({
                                url: '/password/set',
                                type: 'POST',
                                dataType: 'json',
                                data: { password: _pass },
                                success: function(_data) {
                                    if (_data.status) {
                                        layer.open({ content: '密码设置成功' });
                                        Login.redirect();
                                    } else {
                                        layer.open({ content: _data.msg });
                                        _is_ajax = true;
                                    }
                                },
                                error: function() {
                                    layer.open({ content: '网络堵塞' });
                                    _is_ajax = true;
                                }
                            })
                        } else {
                            layer.open({ content: '两次输入密码不一样' });
                            _is_ajax = true;
                        }
                    } else {
                        layer.open({ content: '请输入6-20位数字或字母组成的密码' });
                        _is_ajax = true;
                    }
                }
            },
            enterPass: function() {
                var _pass = $password.val(),
                    _reg = /^[A-Za-z0-9]{6,20}$/;
                if (_is_ajax) {
                    _is_ajax = false;
                    if (_reg.test(_pass)) {
                        $.ajax({
                            url: '/password/get',
                            type: 'POST',
                            dataType: 'json',
                            data: { password: _pass },
                            success: function(_data) {
                                if (_data.status) {
                                    layer.open({ content: '正在登录' });
                                    Login.redirect();
                                } else {
                                    layer.open({ content: _data.msg });
                                    _is_ajax = true;
                                }
                            },
                            error: function() {
                                layer.open({ content: '网络堵塞' });
                                _is_ajax = true;
                            }
                        });
                    } else {
                        layer.open({ content: '密码错误：请输入6-20位数字或字母组成的密码' });
                        _is_ajax = true;
                    }
                }
            },
            redirect: function() {
                // 判断是商城登录回掉还是商城支付回掉
                var _url = G.callBackUrl ? G.callBackUrlAll : G.requrl;
                if (G.payurl) {
                    _url  = G.payurl.replace(/&amp;/g, '&');
                }
                setTimeout(function() {
                    location.href = _url;
                }, 600);
            }
        };
    // 设置密码
    $form.on('tap', '.set-password', function() {
        Login.setPass();
    });
    // 登录
    $form.on('tap', '.enter-password', function() {
        Login.enterPass();
    });
}(Zepto);
