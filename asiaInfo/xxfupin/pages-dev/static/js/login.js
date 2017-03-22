/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-29.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $passLogin = $('#passLogin'),
        $codeWrap = $('#codeWrap'),
        $passWrap = $('#passWrap'),
        $getCode = $codeWrap.find('.j-get-code'),
        _is_code = true, // 时候可以发送验证码
        _reg_data = {
            type: /[^\#]\#{1}passLogin$/.test(win.location.href) ? 1 : 0, // 登录类型
        }, // ==>
        /*{
            mobile: '',
            vcode: ''
            type: // 0表示验证码， 1表示密码
        }*/
        Project = {
            toggleLogin: function() {
                var $this = $(this);
                win.location.href = $this.data('href');
                _reg_data.type = $this.data('type');
            },
            getData: function() {
                (_reg_data.type ? $passWrap : $codeWrap).find('.j-ipt').each(function(_i, $e) {
                    $e = $($e);
                    _reg_data[$e.attr('name')] = $.trim($e.val());
                });
            },
            verify: function(_type) {
                // 获取用户输入数据
                Project.getData();
                // 手机号，验证
                if (!(win._reg.tel.test(_reg_data.mobile))) {
                    layer.open({ content: '请输入正确的手机号' });
                    return false;
                }
                if (_type === 'mobile') {
                    return true;
                }
                // code，验证
                if (!(win._reg.code.test(_reg_data.vcode))) {
                    layer.open({ content: _reg_data.type ? '密码错误' : '验证码错误' });
                    return false;
                }
                return true;
            },
            sendCode: function() {
                // 校验手机号
                if (_is_code && Project.verify('mobile')) {
                    _is_code = false;
                    // 发送验证码
                    F.ajax({
                        data: { mobile: _reg_data.mobile },
                        url: win.G.send_code_url,
                        yes: function(_data) {
                            // 倒计时
                            var _time = 60;
                            $getCode.html('重新获取' + _time-- + 's');
                            var _t = setInterval(function() {
                                $getCode.html('重新获取' + _time-- + 's');
                                if (_time < 0) {
                                    $getCode.html('获取验证码');
                                    clearInterval(_t);
                                    _is_code = true;
                                }
                            }, 1000);
                        },
                        no: function() {
                            _is_code = true;
                        }
                    });
                }
            },
            login: function() {
                // 校验用户输入数据
                if (Project.verify()) {
                    F.ajax({
                        data: _reg_data,
                        type: 'POST',
                        url: win.G.login_url,
                        yes: function(_data) {
                            layer.open({ content: '登录成功' });
                            location.href = win.G.user_url;
                        }
                    });
                }
            }
        };
    /**
     * event binding
     */
    $passLogin
        .on(win.method, '.j-toggle-login', Project.toggleLogin) // 切换登录方式
        .on(win.method, '.j-login-btn', Project.login); // 登录
    $codeWrap
        .on(win.method, '.j-get-code', Project.sendCode); // 发送验证码
    // -----------------------
    // 本地模式，获取验证码（还没有开通手机）
    $getCode.on('longTap', function() {
        F.ajax({
            data: { mobile: _reg_data.mobile },
            url: win.G.get_code_url,
            yes: function(_data) {
                // 填写验证码（开发阶段）
                $codeWrap.find('.j-ipt[name="vcode"]').val(_data.data);
            }
        });
    });
    // -----------------------
}(window || this, Zepto);
