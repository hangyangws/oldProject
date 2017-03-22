/**
 * [created by hangyangws in 2016-02-20]
 * @return {[Object]}   [Lg 后台管理登录 login]
 */
! function($) {
    "use strict";
    var $loginWrap = $('#loginWrap'),
        Lg = (function() {
            var _is_login = true,
                $err = $loginWrap.find('.error'),
                $ipt = $loginWrap.find('.ipt-item'),
                _ipt_l = $ipt.length,
                $captcha = $loginWrap.find('.captcha-img'),
                _captcha_src = $captcha.attr('src');
            return {
                login: function() {
                    var _l = _ipt_l,
                        $now,
                        _data = {},
                        _val;
                    if (_is_login) {
                        _is_login = false;
                        // 验证空
                        while (_l--) {
                            $now = $ipt.eq(_l);
                            _val = $.trim($now.val());
                            if ($now.data('need')) {
                                if (_val === '') {
                                    Lg.tip($now.data('name') + '不能为空', true);
                                    return;
                                };
                            };
                            // 获取数据
                            if ($now.data('type')) {
                                _data[$now.data('type')] = _val;
                            };
                        };
                        // 开始登录
                        Lg.tip("登录中…", false);
                        $.ajax({
                                url: '/login',
                                type: 'POST',
                                dataType: 'json',
                                data: _data
                            })
                            .done(function(_d) {
                                if (_d.status) {
                                    Lg.tip("登录成功，跳转…", false);
                                    location.href = "/";
                                } else {
                                    Lg.tip(_d.msg, true);
                                }
                            })
                            .fail(function() {
                                Lg.tip("网络堵塞", true);
                            });
                    };
                },
                tip: function(t, s) {
                    $err.css('color', s ? '#f00' : '#bdb099').html(t);
                    s && (_is_login = true);
                },
                reCaptcha: function() {
                    $captcha.attr('src', _captcha_src + '?' + new Date().getTime());
                }
            };
        })();
    // 点击登录
    $loginWrap.on('click', '.login', function() {
        Lg.login();
    });
    // 字段聚焦
    $loginWrap.on('focus', '.ipt-item', function() {
        Lg.tip('&emsp;', false);
    });
    // 字段回车
    $loginWrap.on('keyup', '.ipt-item', function(e) {
        ($.getK(e) === 13) && Lg.login();
    });
    // 验证码刷新
    $loginWrap.on('click', '.captcha-img', function() {
        Lg.reCaptcha();
    });
}(jQuery);
