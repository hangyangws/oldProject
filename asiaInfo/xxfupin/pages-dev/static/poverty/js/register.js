/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-29.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $conWrap = $('#conWrap'),
        $passIpt = $conWrap.find('.j-pass-ipt'),
        $getCode = $conWrap.find('.j-get-code'),
        $select = $conWrap.find('.j-select'),
        _is_code = true, // 时候可以发送验证码
        _null_select = {
            '0': '<option value="">县</option>',
            '1': '<option value="">镇</option>',
            '2': '<option value="">村</option>',
        },
        _select_val = {}, // 缓存地区数据
        _reg_data = {}, // ==>
        /*{
            mobile: '',
            passwd: '',
            vcode: '',
            org: ''
        }*/
        Project = {
            init: function() {
                // 获取县
                Project.getArea('2010');
            },
            getArea: function(_val) {
                var $this = $(this),
                    _select_num = $this.index() + 1;
                (_select_num > 0) && (_val = $this.val());
                var _data = _select_val[_val] || [],
                    _option = [_null_select[_select_num]];
                if (_data.length) {
                    _data.forEach(function(_v) {
                        _option.push('<option value="' + _v.code + '">' + _v.label + '</option>');
                    });
                    Project.putArea($this, _option);
                } else {
                    if (_val) {
                        F.ajax({
                            url: win.G.area_url + _val,
                            yes: function(_d) {
                                _d = _d.data || [];
                                if (_d.length) {
                                    _data = _select_val[_val] = _d;
                                    _data.forEach(function(_v) {
                                        _option.push('<option value="' + _v.code + '">' + _v.label + '</option>');
                                    });
                                }
                                Project.putArea($this, _option);
                            }
                        });
                    } else {
                        Project.putArea($this, _option);
                    }
                }
            },
            putArea: function($this, _option) {
                var $dom = $select.eq($this.index() + 1);
                $dom.length && $dom.html(_option.join('')).trigger('change');
                if ($this.val()) {
                    $this.addClass('each-addr-active');
                } else {
                    $this.removeClass('each-addr-active');
                }
            },
            getData: function() {
                $conWrap.find('.j-ipt').each(function(_i, $e) {
                    $e = $($e);
                    var _v = $.trim($e.val());
                    _v && (_reg_data[$e.attr('name')] = _v);
                });
                _reg_data.org = $select.eq(-1).val();
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
                // 地址，验证
                if (!_reg_data.org) {
                    layer.open({ content: '请选择完整的详细地址' });
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
                            $getCode.addClass('code-btn-useless').html('重新获取' + _time-- + 's');
                            var _t = setInterval(function() {
                                $getCode.html('重新获取' + _time-- + 's');
                                if (_time < 0) {
                                    $getCode.removeClass('code-btn-useless').html('获取验证码');
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
            passTypeToggle: function() {
                if ($passIpt.attr('type') === 'text') {
                    $passIpt.attr('type', 'password');
                } else {
                    $passIpt.attr('type', 'text');
                }
                $(this).toggleClass('i-3-14');
            },
            register: function() {
                // 校验用户输入数据
                if (Project.verify()) {
                    F.ajax({
                        data: _reg_data,
                        type: 'POST',
                        url: win.G.reg_url,
                        yes: function(_data) {
                            F.jump({
                                msg: '注册成功',
                                url: win.G.user_url
                            });
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
        .on(win.method, Project.sendCode) // 发送验证码
    $conWrap
        .on(win.method, '.j-see-pass', Project.passTypeToggle) // 查看密码
        .on('change', '.j-select', Project.getArea) // 地区select改变
        .on(win.method, '.j-sub-btn', Project.register); // 注册
    // -----------------------
    // 本地模式，获取验证码（还没有开通手机）
    $getCode.on('longTap', function() {
        F.ajax({
            data: { mobile: _reg_data.mobile },
            url: win.G.get_code_url,
            yes: function(_data) {
                // 填写验证码（开发阶段）
                $conWrap.find('.j-ipt[name="vcode"]').val(_data.data);
            }
        });
    });
    // -----------------------
}(window || this, Zepto);
