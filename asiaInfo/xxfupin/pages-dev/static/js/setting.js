/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-01.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $mainWrap = $('#mainWrap'),
        $mask = $mainWrap.find('.j-mask'),
        $ipt = $('#itemWrap').find('.j-ipt'),
        $footer = $('#footer'),
        _modify_data = {}, // ==>
        /*{
            email: '',
            name: ''
        }*/
        Project = {
            getData: function() {
                $ipt.each(function(_i, $e) {
                    $e = $($e);
                    _modify_data[$e.attr('name')] = $.trim($e.val());
                });
            },
            verify: function(_type) {
                // 获取用户输入数据
                Project.getData();
                // 姓名，验证
                if (!(win._reg.name.test(_modify_data.name))) {
                    layer.open({ content: '请输入合法的姓名' });
                    return false;
                }
                // 邮箱，验证
                if (!(win._reg.email.test(_modify_data.email))) {
                    layer.open({ content: '请输入合法的邮箱' });
                    return false;
                }
                return true;
            },
            loginOut: function() {
                win.F.ajax({
                    url: win.G.logout_url,
                    yes: function(_data) {
                        layer.open({ content: '退出成功，跳转中…' });
                        location.href = win.G.user_url;
                    }
                });
            },
            modify: function() {
                // 校验用户输入数据
                if (Project.verify()) {
                    F.ajax({
                        data: _modify_data,
                        type: 'POST',
                        url: win.G.modify_url,
                        yes: function(_data) {
                            location.href = win.G.ok_url;
                        }
                    });
                }
            },
            toggleDom: function() {
                var _t;
                if ($mask.is('.mask-active')) {
                    $mask.removeClass('mask-active');
                    _t = setTimeout(function() {
                        $mask.addClass('none');
                        clearTimeout(_t);
                    }, 600);
                } else {
                    $mask.removeClass('none');
                    _t = setTimeout(function() {
                        $mask.addClass('mask-active');
                        clearTimeout(_t);
                    }, 100);
                }
            }
        };
    /**
     * event binding
     */
    $footer
        .on(win.method, '.j-loginout', Project.loginOut) // 退出登录
        .on(win.method, '.j-modify', Project.modify); // 修改信息
    $mainWrap
        .on(win.method, '.j-sign-flow', Project.toggleDom); // 查看认证申请流程
    $mask
        .on(win.method, Project.toggleDom); // 关闭认证申请流程
}(window || this, Zepto);
