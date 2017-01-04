/**
 * Hf （head - footer）头部 - 页脚
 * fj in 2015-11-27
 */
;
!(function($) {
    "use strict";
    var Hf = (function() {
        var $register,
            $login,
            $repass,
            $htmlBody = $("html, body"),
            _reg_log = true,
            _reg_log_code = true,
            _reg_data;
        return {
            ini: function() {
                // 把所有的ts4 加上live
                var $ts4 = $('.ts4'),
                    _ts4_l = $ts4.length;
                while (_ts4_l--) {
                    $ts4.eq(_ts4_l).addClass('ts-live');
                };
                // 禁止鼠标选择
                if (typeof document.onselectstart !== "undefined") {
                    document.onselectstart = new Function("return false");
                };
                // 禁止右键
                function nocontextmenu(e) {
                    e = $.getE(e);
                    e.cancelBubble = true;
                    e.returnValue = false;
                    return false;
                }

                function norightclick(e) {
                    e = $.getE(e);
                    if (window.event) {
                        if (e.which === 2 || e.which === 3) return false;
                    } else if (e.button === 2 || e.button === 3) {
                        e.cancelBubble = true;
                        e.returnValue = false;
                        return false;
                    };
                }
                document.oncontextmenu = nocontextmenu; // for IE5+
                document.onmousedown = norightclick; // for all others
                /******************************************************************************/

                $register = $('#registerDom').html();
                $login = $('#loginDom').html();
                $repass = $('#findpassDom').html();
                $('#regLogDom').remove();

                // 触发登陆和注册弹框
                location.hash === '#login' && Hf.logOut();
                location.hash === '#register' && Hf.regOut();

                // 在线咨询
                (function(m, ei, q, i, a, j, s) {
                    m[a] = m[a] || function() {
                        (m[a].a = m[a].a || []).push(arguments)
                    };
                    j = ei.createElement(q),
                        s = ei.getElementsByTagName(q)[0];
                    j.async = true;
                    j.charset = 'UTF-8';
                    j.src = i;
                    s.parentNode.insertBefore(j, s)
                })(window, document, 'script', '//eco-api.meiqia.com/dist/meiqia.js', '_MEIQIA');
                _MEIQIA('entId', 3990);
                // seo 自动推送
                var bp = document.createElement('script'),
                    s = document.getElementsByTagName("script")[0];
                bp.src = '//push.zhanzhang.baidu.com/push.js';
                s.parentNode.insertBefore(bp, s);

                /////////////////////////
                // 写在最后的话 （2015-12-30） //
                /////////////////////////
                console.log('谢谢这段时间在公司的经历 谢谢我的伙伴们 再见 朋友们 走了');
            },
            regOut: function() {
                Hf.clearRegLog();
                $mask.hide().html($register).show(0, function() {
                    $(this).children().removeClass('active');
                });
            },
            logOut: function() {
                Hf.clearRegLog();
                $mask.hide().html($login).show(0, function() {
                    $(this).children().removeClass('active');
                });
            },
            findPassOut: function() {
                Hf.clearRegLog();
                $mask.hide().html($repass).show(0, function() {
                    $(this).children().removeClass('active');
                });
            },
            goTop: function() {
                $htmlBody.animate({
                    scrollTop: 0
                }, 400);
            },
            register: function($this, _t) {
                $mask.find('.reg-log-sub-err').html('&emsp;');
                if (_reg_log) {
                    _reg_log = false;
                    _reg_data.username = $.trim($mask.find('.register-ipt').val());
                    if ($.cTel(_reg_data.username)) {
                        $this.html("检测手机号...");
                        $.ajax({
                            type: "POST",
                            url: globalBase.checkUserUrl,
                            dataType: "json",
                            data: {
                                username: _reg_data.username
                            },
                            success: function(_r) {
                                if (_t) { // 重置密码
                                    if (_r.status === 'error') { // 用户注册过 可以使用找回密码
                                        Hf.registerSecond($this, _t);
                                    } else {
                                        $mask.find('.reg-tel-err').html('用户未注册');
                                        $this.html('完成');
                                        _reg_log = true;
                                    };
                                } else { // 注册
                                    if (_r.status === 'success') { // 用户没有注册过 可以注册
                                        Hf.registerSecond($this);
                                    } else {
                                        $mask.find('.reg-tel-err').html('用户已被注册');
                                        $this.html('注册');
                                        _reg_log = true;
                                    };
                                };
                            }
                        });
                    } else {
                        $mask.find('.reg-tel-err').html('手机号错误')
                        _reg_log = true;
                    };
                };
            },
            registerSecond: function($this, _t) {
                _reg_data.code = $.trim($mask.find('.reg-code-ipt').val());
                if (/^\d{6}$/.test(_reg_data.code)) {
                    _reg_data.password = $mask.find('.reg-pass-ipt').val();
                    if (_reg_data.password.length > 5 && _reg_data.password.length < 21) {
                        $this.html(_t ? '修改中...' : '注册中...');
                        $.ajax({
                            type: "POST",
                            url: _t ? globalBase.forgetUserUrl : globalBase.registerUrl,
                            dataType: "json",
                            data: _reg_data,
                            success: function(_r) {
                                if (_r.status === 'success') {
                                    $this.html(_t ? '修改成功' : "注册成功");
                                    setTimeout(function() {
                                        if (location.href.indexOf('#') === -1) {
                                            location.reload();
                                        } else {
                                            location.href = location.href.slice(0, location.href.indexOf('#'));
                                        };
                                    }, 500);
                                } else {
                                    $mask.find('.reg-log-sub-err').html(_r.message);
                                    $this.html(_t ? '完成' : '注册');
                                    _reg_log = true;
                                };
                            }
                        });
                    } else {
                        $mask.find('.reg-pass-err').html('密码格式错误');
                        $this.html(_t ? '完成' : '注册');
                        _reg_log = true;
                    };
                } else {
                    $mask.find('.reg-code-err').html('验证码错误');
                    $this.html(_t ? '完成' : '注册');
                    _reg_log = true;
                };
            },
            sendCode: function($this, _t) {
                var _time = 59,
                    _t_id;
                if (_reg_log_code) {
                    _reg_log_code = false;
                    _reg_data.username = $.trim($mask.find('.register-ipt').val());
                    if (_reg_data.username) {
                        $this.html("检测手机号...");
                        $.ajax({
                            type: "POST",
                            url: globalBase.checkUserUrl,
                            dataType: "json",
                            data: {
                                username: _reg_data.username
                            },
                            success: function(r) {
                                if (r.status === 'success') {
                                    $this.html("正在发送...");
                                    $.ajax({
                                        type: "POST",
                                        url: _t ? globalBase.forgetSendCodeUrl : globalBase.regSendCodeUrl,
                                        dataType: "json",
                                        data: {
                                            username: _reg_data.username
                                        },
                                        success: function(r) {
                                            if (r.status === 'success') {
                                                _t_id = setInterval(function() {
                                                    $this.html(_time-- + "秒后重试")
                                                    if (_time < 1) {
                                                        clearInterval(_t_id);
                                                        $this.html("发送验证码");
                                                        _reg_log_code = true;
                                                    };
                                                }, 1000);
                                            } else {
                                                $mask.find('.reg-code-err').html(r.message);
                                                $this.html("发送验证码");
                                                _reg_log_code = true;
                                            };
                                        }
                                    });
                                } else {
                                    $mask.find('.reg-tel-err').html(r.message);
                                    $this.html("发送验证码");
                                    _reg_log_code = true;
                                };
                            }
                        });
                    } else {
                        $mask.find('.reg-tel-err').html('手机号错误');
                        _reg_log_code = true;
                    };
                };
            },
            login: function($this) {
                $mask.find('.reg-log-sub-err').html('&emsp;');
                if (_reg_log) {
                    _reg_log = false;
                    _reg_data.username = $.trim($mask.find('.login-ipt').val());
                    if ($.cTel(_reg_data.username)) {
                        _reg_data.password = $mask.find('.log-pass-ipt').val();
                        if (_reg_data.password.length > 5 && _reg_data.password.length < 21) {
                            $this.html("登录中...");
                            $.ajax({
                                type: "POST",
                                url: globalBase.loginUrl,
                                dataType: "json",
                                data: _reg_data,
                                success: function(_r) {
                                    if (_r.status === 'success') {
                                        $this.html("登录成功");
                                        setTimeout(function() {
                                            if (location.href.indexOf('#') === -1) {
                                                location.reload();
                                            } else {
                                                location.href = location.href.slice(0, location.href.indexOf('#'));
                                            };
                                        }, 500);
                                    } else {
                                        $mask.find('.reg-log-sub-err').html(_r.message);
                                        $this.html("登录");
                                        _reg_log = true;
                                    };
                                }
                            });
                        } else {
                            $mask.find('.log-pass-err').html('密码错误');
                            _reg_log = true;
                        };
                    } else {
                        $mask.find('.log-tel-err').html('手机号错误');
                        _reg_log = true;
                    };
                };
            },
            signOut: function() {
                $.ajax({
                    url: globalBase.logoutUrl,
                    dataType: "json",
                    success: function() {
                        if (location.href.indexOf('#') === -1) {
                            location.reload();
                        } else {
                            location.href = location.href.slice(0, location.href.indexOf('#'));
                        };
                    }
                });
            },
            clearRegLog: function() {
                _reg_data = {
                    username: '',
                    password: '',
                    code: ''
                };
            },
            submit: function(e) {
                $.getKey(e) === 13 && $mask.find('.reg-log-submit').trigger('click');
            }
        };
    })();

    Hf.ini();

    /**
     * *******************************************************************************
     */

    /**
     * 注册
     */
    // 弹出注册框
    $body.on('click', '.register-trigger', function() {
        Hf.regOut();
    });
    // 点击注册按钮
    $mask.on('click', '.reg-submit', function() {
        Hf.register($(this));
    });
    // 发送验证码
    $mask.on('click', '.send-code-reg', function() {
        Hf.sendCode($(this));
    });

    /**
     * 登陆
     */
    // 弹出登陆框
    $body.on('click', '.login-trigger', function() {
        Hf.logOut();
    });
    // 点击登陆按钮
    $mask.on('click', '.log-submit', function() {
        Hf.login($(this));
    });

    /**
     * 找回密码
     */
    // 弹出找回密码框
    $body.on('click', '.findPass-trigger', function() {
        Hf.findPassOut();
    });
    // 点击完成
    $mask.on('click', '.find-submit', function() {
        Hf.register($(this), 'find');
    });
    // 发送验证码
    $mask.on('click', '.send-code-find', function() {
        Hf.sendCode($(this), 'find');
    });

    // 所有input得到焦点
    $mask.on('focus', '.reg-log-ipt', function() {
        $(this).next().html('&emsp;');
        $mask.find('.reg-log-sub-err').html('&emsp;');
    });
    // 所有input keyup绑定
    $mask.on('keyup', '.reg-log-ipt', function(e) {
        $(this).next().html('&emsp;');
        Hf.submit(e);
    });
    // 推出登录
    $('#header').on('click', '.sign-out', function() {
        Hf.signOut();
    });

    /**
     * *******************************************************************************
     */
    // 联系客服
    // $('#asideFunc').on('click', '.func-contact', function() {
    //     easemobIM();
    // });
    // 回答顶部
    $('#asideFunc').on('click', '.func-top', function() {
        Hf.goTop();
    });
})(jQuery);
