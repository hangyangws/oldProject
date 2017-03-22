/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-09.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $conWrap = $('#conWrap'),
        $form = $conWrap.find('.j-form'),
        $areaSelect = $conWrap.find('.j-area-select'),
        _option_temp = '<option value="{{val}}" {{check}}>{{str}}</option>',
        _area_val = {}, // 缓存地区数据
        _submit_data = {}, // ==>
        /*{
            address: '',
            householder.name: '',
            householder.sex: '' // 单选框
            contactPhone: '',
            householder.idcard: '',
            bankName: '',
            bankCard: '',
            standardFlag: '',
            status: '',
            attribute: '',
            isSpecialCare: '' // 单选框
        }*/
        Project = {
            init: function() {
                // 获取县
                Project.getArea('2010');
            },
            getArea: function(_val) {
                var $this = $(this), // 当前改变值得Dom
                    _next_select_num = $this.data('i') || 0, // 下一个需要渲染的Dom的下表顺序（以0开始）
                    $dom = $areaSelect.eq(_next_select_num), // 下一个需要渲染内容的Dom
                    _next_val = $dom.val();
                // _val ===> 选一个需要渲染内容的父节点值
                (_next_select_num > 0) && (_val = $this.val());
                var _data = _area_val[_val] || [],
                    _option = ['<option value="">请选择</option>'];
                if (_data.length) {
                    _data.forEach(function(_v) {
                        _option.push(
                            _option_temp
                            .replace('{{val}}', _v.code)
                            .replace('{{check}}', _v.code === _next_val ? 'selected="selected"' : '')
                            .replace('{{str}}', _v.label)
                        );
                    });
                    Project.putArea($this, _option);
                } else {
                    if (_val) {
                        F.ajax({
                            url: win.G.area_url + _val,
                            yes: function(_d) {
                                _d = _d.data || [];
                                if (_d.length) {
                                    _data = _area_val[_val] = _d;
                                    _data.forEach(function(_v) {
                                        _option.push(
                                            _option_temp
                                            .replace('{{val}}', _v.code)
                                            .replace('{{check}}', _v.code === _next_val ? 'selected="selected"' : '')
                                            .replace('{{str}}', _v.label)
                                        );
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
                var $dom = $areaSelect.eq($this.data('i') || 0);
                // 如果是最后一个select下拉框，就不会触发
                $dom.length && $dom.html(_option.join('')).trigger('change');
                if ($this.val()) {
                    $this.addClass('each-addr-active');
                } else {
                    $this.removeClass('each-addr-active');
                }
            },
            getData: function() {
                var item,
                    _data = $form.serialize().split('&').forEach(function(_item) {
                        item = _item.split('=');
                        _submit_data[item[0]] = item[1];
                    });
                _submit_data.address = $areaSelect.eq(-1).val();
            },
            verify: function(_type) {
                // 获取用户输入数据
                Project.getData();
                // 地址验证
                if (!_submit_data.address) {
                    layer.open({ content: '请选择完整的家庭住址' });
                    return false;
                }
                // 户主，验证
                if (!_submit_data['householder.name']) {
                    layer.open({ content: '请输入正确的户主姓名' });
                    return false;
                }
                // 性别，验证
                if (!_submit_data['householder.sex']) {
                    layer.open({ content: '请选择性别' });
                    return false;
                }
                // 电话，验证
                if (!(win._reg.phone.test(_submit_data.contactPhone))) {
                    layer.open({ content: '请输入正确的联系电话' });
                    return false;
                }
                // 证件号码，验证
                if (!win._reg.idcard.test(_submit_data['householder.idcard'])) {
                    layer.open({ content: '请输入正确的证件号码' });
                    return false;
                }
                // 银行帐号，验证
                if (_submit_data.bankCard && !(win._reg.bank.test(_submit_data.bankCard))) {
                    layer.open({ content: '请输入正确的银行账号' });
                    return false;
                }
                // 识别标准，验证
                if (!_submit_data.standardFlag) {
                    layer.open({ content: '请选择识别标准' });
                    return false;
                }
                // 脱贫状态，验证
                if (!_submit_data.status) {
                    layer.open({ content: '请选择脱贫状态' });
                    return false;
                }
                // 属性，验证
                if (!_submit_data.attribute) {
                    layer.open({ content: '请选择属性' });
                    return false;
                }
                return true;
            },
            register: function() {
                // 校验用户输入数据
                if (Project.verify()) {
                    var _sub_data = [],
                        key;
                    for (key in _submit_data) {
                        _sub_data.push(key + '=' + _submit_data[key]);
                    }
                    F.ajax({
                        data: _sub_data.join('&'),
                        type: 'POST',
                        url: win.G.submit_url,
                        yes: function(_data) {
                            F.jump({
                                msg: win.G.tit + '成功',
                                url: win.G.user_url
                            });
                        }
                    });
                }
            },
            select: function() {
                var $this = $(this);
                if ($this.val()) {
                    $this.addClass('each-addr-active')
                } else {
                    $this.removeClass('each-addr-active');
                }
            }
        };
    Project.init();
    /**
     * event binding
     */
    $conWrap
        .on('change', '.j-area-select', Project.getArea) // 地区select改变
        .on('change', '.j-select', Project.select) // 其他select改变
        .on(win.method, '.j-submit', Project.register); // 提交数据
}(window || this, Zepto);
