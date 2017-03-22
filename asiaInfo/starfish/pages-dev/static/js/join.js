/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-20.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $added = $('#added'),
        $addMan = $('#addMan'),
        $addedWrap = $added.find('.j-added-wrap'), // 已添加被保人
        $name = $addMan.find('.j-name'), // 姓名
        $id = $addMan.find('.j-id'), // 身份证号码
        $pay = $('#pay'),
        $balancePay = $pay.find('.j-balance-wrap'),
        $balancePayRadio = $pay.find('.j-balance-radio'),
        $weixinPay = $pay.find('.j-weixin-pay'),
        $payBtn = $('#payBtn'), // 支付按钮
        $payMoney = $payBtn.find('.j-pay-money'), // 支付价格
        _added_html, // 已添加被保人字符串模板
        _temp_pool = [], // 已加入用户缓存
        _is_ajax = true, // 是否可以发送ajax
        Project = {
            init: function() {
                // 其他
                var $added = $('#tpAdded');
                _added_html = $added.html();
                $added.remove();
            },
            verifyData: function() {
                var name = $name.val(),
                    id = $id.val().toUpperCase();
                if (!/^[\u4e00-\u9fa5·]{2,20}$/.test(name)) {
                    Project.dataEnd('请输入合法的姓名');
                    return null;
                }
                if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(id)) {
                    Project.dataEnd('请输入正确的身份证号码');
                    return null;
                }
                return {
                    name: name,
                    idcard: id
                };
            },
            addMan: function() {
                // 阻止默认事件后，input输入框没有失去焦点，需要手动失去焦点
                $addMan.find('input:focus').blur();
                // 获取姓名和身份证号码
                var data = Project.verifyData();
                if (!data) {
                    return;
                }
                // 前端验证此用户是否可用
                var _l = _temp_pool.length,
                    _temp;
                while (_l--) {
                    _temp = _temp_pool[_l];
                    if (_temp.idcard === data.idcard) {
                        Project.dataEnd('请勿重复添加保障人');
                        return;
                    }
                }
                // 后端验证此用户是否可用
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: win.G.baseUrl + '/plan/' + win.G.planId + '/insurer/' + data.idcard + '/exist',
                        dataType: 'json',
                        success: function(_data) {
                            if (_data.code === 0 && _data.data) {
                                _data.msg = '保障人已参加过该计划';
                            }
                            Project.dataEnd(_data.msg);
                            if (_data.code === 0 && _data.data === false) {
                                // 插入DOM数据
                                $addedWrap.append(
                                    _added_html
                                    .replace('{{name}}', data.name)
                                    .replace(/{{id}}/g, data.idcard)
                                );
                                $added.removeClass('none');
                                // 插入内存数据
                                _temp_pool.push(data);
                                // 清空已填数据
                                $name.add($id).val('');
                                // 余额验证
                                Project.verifyBalance();
                            }
                        },
                        error: function() {
                            Project.dataEnd('网路堵塞');
                        }
                    });
                }
            },
            verifyBalance: function() {
                // 人数改变后改变自动支付方式
                var _pay_money = (_temp_pool.length || 1) * 3;
                if (_pay_money > win.G.balance) { // 余额不足
                    $weixinPay.trigger('click');
                    $balancePayRadio.attr('disabled', 'disabled'); // 不能选择零钱支付
                    $balancePay.addClass('pay-disable'); // 零钱选择变灰
                } else {
                    $balancePayRadio.removeAttr('disabled'); // 余额按钮可以点击
                    $balancePay.removeClass('pay-disable'); // 余额选择不变灰
                    $balancePayRadio.trigger('click');
                }
                // 改变支付价格
                $payMoney.html(_pay_money);
            },
            del: function() {
                var $this = $(this).closest('.j-man-each'),
                    _id = $this.data('id'),
                    _l = _temp_pool.length,
                    _temp;
                // 删除DOM数据
                // input不可用
                $name.add($id).attr('disabled', 'disabled');
                $this.remove();
                _l === 1 && $added.addClass('none');
                // input可以用
                setTimeout(function() {
                    $name.add($id).removeAttr('disabled');
                }, 100);
                while (_l--) {
                    _temp = _temp_pool[_l];
                    if (_id === _temp.idcard) {
                        // 删除内存数据
                        _temp_pool.splice(_l, 1);
                        // 余额验证
                        Project.verifyBalance();
                        break;
                    }
                }
            },
            pay: function() {
                // 验证是否有用户
                if (_temp_pool.length === 0) {
                    layer.open({ content: '请添加保障人' });
                    return;
                }
                // 验证是否勾选公约
                if (!$pay.find('.j-convention').is(':checked')) {
                    layer.open({ content: '请勾选公约' });
                    return;
                }
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    var _pay_type = ~~($pay.find('input[name="pay"]:checked').val());
                    $.ajax({
                        url: win.G.baseUrl + '/plan/' + win.G.planId + '/join/do',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            insurers: JSON.stringify(_temp_pool),
                            type: _pay_type
                        },
                        success: function(_data) {
                            if (_data.code === 0) {
                                layer.closeAll();
                                // 判断是否是微信支付
                                if (_pay_type === 1) {
                                    // 得到数据 调用微信接口（目前微信支付还未开通）
                                    win.location.href = win.G.baseUrl + '/plan/' + win.G.planId + '/join/notice/success/' + _data.data;
                                } else {
                                    win.location.href = win.G.baseUrl + '/plan/' + win.G.planId + '/join/notice/success/' + _data.data;
                                }
                            } else {
                                Project.dataEnd(_data.msg || '未知错误');
                            }
                        },
                        error: function() {
                            Project.dataEnd('网络堵塞');
                        }
                    });
                }
            },
            dataEnd: function(s) {
                layer.closeAll();
                s && layer.open({ content: s });
                _is_ajax = true;
            }
        };
    // 项目初始化
    Project.init();
    /**
     * event binding
     */
    $addMan
        .on(win.method, '.j-add-man', Project.addMan) // 添加保障人
    $addedWrap
        .on(win.method, '.j-del', Project.del) // 删除保障人
    $payBtn
        .on(win.method, Project.pay) // 确认支付
}(window || this, Zepto);
