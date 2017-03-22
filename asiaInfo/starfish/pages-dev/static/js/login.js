/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-18.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $content = $('#content'),
        $codeWrap = $content.find('.j-code-wrap'),
        $passWrap = $content.find('.j-pass-wrap'),
        $code = $content.find('.j-get-code'),
        _reg_tel = /^1[34578]\d{9}$/,
        _base_href = win.location.href.replace(/\#+\w{0,}$/, ''), // 页面基本链接
        _login_type_pass = /[^\#]\#{1}loginPassword$/.test(win.location.href), // 是否是密码登录界面
        _is_ajax = true, // 是否可以发送ajax
        _is_code = true, // 是否可以发送验证码
        Project = {
            init: function() {
                // Logo动画
                var $logo = $('#logo'),
                    Img = new Image();
                Img.src = $logo.css('background-image').slice(5, -2);
                var _time = setInterval(function() {
                    Img.complete && (
                        $logo.addClass('logo-active'),
                        clearInterval(_time)
                    );
                }, 50);
                if (/\#{2,}/.test(win.location.href)) {
                    win.location.href = win.location.href.replace(/\#+/, '#');
                }
            },
            insertFlg: function(str, char, len) {
                var temp = str.split('');
                temp.splice(len, 0, char);
                return temp.join('');
            },
            toggleLoginType: function() {
                win.location.href = _base_href + (_login_type_pass ? '#' : '#loginPassword');
                _login_type_pass = !_login_type_pass;
            },
            tel: function() {
                var $this = $(this),
                    _v = $this.val().replace(/[^\d]/g, '').slice(0, 11); // 纯数字电话号码
                if (_v.length > 7) {
                    _v = Project.insertFlg(Project.insertFlg(_v, ' ', 7), ' ', 3);
                } else if (_v.length > 3) {
                    _v = Project.insertFlg(_v, ' ', 3);
                }
                $this.val(_v);
            },
            getData: function() {
                var $d = _login_type_pass ? $passWrap : $codeWrap;
                return {
                    mobile: $d.find('.j-tel').val().replace(/\s/g, ''),
                    passwd: $d.find('.j-pass').val(),
                    type: _login_type_pass ? 2 : 1
                };
            },
            verify: function() {
                // 获取ajax数据
                var _data = Project.getData(),
                    reg_pass = _login_type_pass ? /^\d{6}$/ : /^\d{6}$/; // 验证密码的正则
                // 验证手机号码
                if (!(_reg_tel.test(_data.mobile))) {
                    // 提示手机号码错误
                    Project.errEnd('请填写正确的手机号码');
                    return;
                }
                // 验证密码
                if (!(reg_pass.test(_data.passwd))) {
                    // 提示手机号码错误
                    Project.errEnd((_login_type_pass ? '密' : '验证') + '码错误');
                    return;
                }
                // 提交
                Project.submit(_data);
            },
            getCode: function() {
                if (_is_ajax && _is_code) {
                    var _tel = Project.getData().mobile;
                    // 验证手机号码
                    if (!(_reg_tel.test(_tel))) {
                        // 提示手机号码错误
                        Project.errEnd('请填写正确的手机号码')
                        return;
                    }
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: win.G.baseUrl + '/sendsms',
                        type: 'GET',
                        dataType: 'json',
                        data: { mobile: _tel },
                        success: function(_data) {
                            if (_data.code === 0) {
                                layer.closeAll();
                                _is_ajax = true;
                                // 倒计时
                                Project.codeTime();
                            } else {
                                Project.errEnd(_data.msg);
                            }
                        },
                        error: function() {
                            Project.errEnd('网络堵塞');
                        }
                    });
                }
            },
            codeTime: function() {
                _is_code = false;
                $code.html('重新获取60s');
                var _t = 60,
                    _time = setInterval(function() {
                        $code.html('重新获取' + --_t + 's');
                        if (!_t) {
                            _is_code = true;
                            $code.html('获取验证码');
                            clearInterval(_time);
                        }
                    }, 1000);
            },
            submit: function(_data) {
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: win.G.baseUrl + '/login/do',
                        type: 'POST',
                        dataType: 'json',
                        data: _data,
                        success: function(_data) {
                            // 判断结果
                            if (_data.code === 0) {
                                layer.closeAll();
                                // 动画提出成功
                                $content.find('.j-submit').addClass('submit-ok');
                                // 跳转页面
                                setTimeout(function() {
                                    win.location.href = win.G.baseUrl;
                                }, 1500);
                            } else {
                                Project.errEnd(_data.msg);
                            }
                        },
                        error: function() {
                            Project.errEnd('网络堵塞');
                        }
                    });
                }
            },
            errEnd: function(s) {
                layer.closeAll();
                layer.open({ content: s });
                _is_ajax = true;
            },
            // 测试期间获取短信验证码
            hack: function() {
                var _self = this;
                if (!_self.hackCounter) {
                    _self.hackCounter = 0;
                }
                if (++_self.hackCounter == 5) {
                    _self.hackCounter = 0;
                    $.ajax({
                        url: win.G.baseUrl + '/sms',
                        type: 'GET',
                        dataType: 'json',
                        success: function(_data) {
                            if (_data.code === 0) {
                                $('.j-pass').val(_data.data);
                            } else if (_data.code === -1) {
                                Project.errEnd(_data.msg);
                            }
                        },
                        error: function() {
                            Project.errEnd('网络堵塞');
                        }
                    });
                } else {
                    if (_self.hackTimer) {
                        clearTimeout(_self.hackTimer);
                    }
                    _self.hackTimer = setTimeout(function() {
                        _self.hackCounter = 0;
                    }, 1000);
                }
            }
        };
    // 项目初始化
    Project.init();
    /**
     * event binding
     */
    $content
        .on(win.method, '.j-submit', Project.verify) // 提交登录
        .on(win.method, '.j-toggle-type', Project.toggleLoginType) // 切换登录方式
        .on(win.method, '.j-get-code', Project.getCode) // 获取验证码
        .on('keyup paste', '.j-tel', Project.tel); // 输入手机号码

    $('#logo').on(win.method, Project.hack); // 获取验证码
}(window || this, Zepto);
