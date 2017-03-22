/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-02.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $itemWrap = $('#itemWrap'),
        $ipt = $itemWrap.find('.j-ipt'),
        $footer = $('#footer'),
        _submit_data = {}, // ==>
        /*{
            oldpwd: '',
            newpwd: ''
        }*/
        Project = {
            getData: function() {
                $ipt.each(function(_i, $e) {
                    $e = $($e);
                    _submit_data[$e.attr('name')] = $.trim($e.val());
                });
            },
            verify: function(_type) {
                // 获取用户输入数据
                Project.getData();
                // 旧密码，验证
                if (!(win._reg.pass.test(_submit_data.oldpwd))) {
                    layer.open({ content: '请输入正确的旧密码' });
                    return false;
                }
                // 新密码，验证
                if (!(win._reg.pass.test(_submit_data.newpwd))) {
                    layer.open({ content: '请输入6位数字新密码' });
                    return false;
                }
                // 密码相同验证
                if (_submit_data.oldpwd === _submit_data.newpwd) {
                    layer.open({ content: '新密码不要和旧密码一样' });
                    return false;
                }
                return true;
            },
            passTypeToggle: function() {
                var $this = $(this),
                    $passIpt = $this.parent().find('.j-pass-ipt');
                if ($passIpt.attr('type') === 'text') {
                    $passIpt.attr('type', 'password');
                } else {
                    $passIpt.attr('type', 'text');
                }
                $this.toggleClass('i-1-2');
            },
            submit: function() {
                // 校验用户输入数据
                if (Project.verify()) {
                    F.ajax({
                        data: _submit_data,
                        type: 'POST',
                        url: win.G.repass_url,
                        yes: function(_data) {
                            location.href = win.G.ok_url;
                        }
                    });
                }
            }
        };
    /**
     * event binding
     */
    $itemWrap
        .on(win.method, '.j-see-pass', Project.passTypeToggle); // 查看密码
    $footer
        .on(win.method, '.j-reg-btn', Project.submit); // 确认修改
}(window || this, Zepto);
