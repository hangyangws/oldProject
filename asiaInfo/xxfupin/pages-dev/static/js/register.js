/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-29.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $itemWrap = $('#itemWrap'),
        $footer = $('#footer'),
        $passIpt = $itemWrap.find('.j-pass-ipt'),
        $getCode = $itemWrap.find('.j-get-code'),
        _is_code = true, // 时候可以发送验证码
        _reg_data = {}, // ==>
        /*{
            mobile: '',
            name: '',
            passwd: '',
            referee: '', // 只在邀请注册才有
            vcode: ''
        }*/
        Project = {
            init: function() {},
            getData: function() {
                $itemWrap.find('.j-ipt').each(function(_i, $e) {
                    $e = $($e);
                    _reg_data[$e.attr('name')] = $.trim($e.val());
                });
            },
            verify: function(_type) {
                // 获取用户输入数据
                Project.getData();
                // 手机号码，验证
                if (!(win._reg.tel.test(_reg_data.mobile))) {
                    layer.open({ content: '请输入正确的手机号' });
                    return false;
                }
                if (_type === 'mobile') {
                    return true;
                }
                // 验证码，验证
                if (!(win._reg.code.test(_reg_data.vcode))) {
                    layer.open({ content: '验证码错误' });
                    return false;
                }
                // 密码，验证
                if (!(win._reg.pass.test(_reg_data.passwd))) {
                    layer.open({ content: '请输入6位数字密码' });
                    return false;
                }
                // 邀请码，验证（只在邀请注册页面才有）
                if (win.G.page_type === 'invitation' && !_reg_data.referee) {
                    layer.open({ content: '请输入邀请码' });
                    return false;
                }
                // 公益组织，验证
                if (!_reg_data.org) {
                    layer.open({ content: '请输入公益组织' });
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
                        }
                    });
                }
            },
            passTypeToggle: function() {
                if ($passIpt.attr('type') === 'text') {
                    $passIpt.attr('type', 'password');
                } else {
                    $passIpt.attr('type', 'text');
                }
                $(this).toggleClass('i-1-2');
            },
            register: function() {
                // 校验用户输入数据
                if (Project.verify()) {
                    F.ajax({
                        data: _reg_data,
                        type: 'POST',
                        url: win.G.reg_url,
                        yes: function(_data) {
                            layer.open({ content: '注册成功' });
                            location.href = win.G.user_url;
                        }
                    });
                }
            }
        };
    Project.init();
    /**
     * event binding
     */
    $getCode
        .on(win.method, Project.sendCode); // 发送验证码
    $itemWrap
        .on(win.method, '.j-see-pass', Project.passTypeToggle); // 查看密码
    $footer
        .on(win.method, '.j-reg-btn', Project.register); // 注册
    // -----------------------
    // 本地模式，获取验证码（还没有开通手机）
    $getCode.on('longTap', function() {
        F.ajax({
            data: { mobile: _reg_data.mobile },
            url: win.G.get_code_url,
            yes: function(_data) {
                // 填写验证码（开发阶段）
                $itemWrap.find('.j-ipt[name="vcode"]').val(_data.data);
            }
        });
    });
    // -----------------------
}(window || this, Zepto);
