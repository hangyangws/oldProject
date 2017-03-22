/**
 * 2015-12-08 by hangyangws
 * [Attribute 内容管理]
 */

! function($) {
    "use strict";
    var Attribute = (function() {
        var $addCategory = $('#addCategory').html(),
            $iconDom = $('#iconDom').html(),
            $addAttr = $('#addAttr').html().replace('{{iconDom}}', $iconDom),
            $valSingle = $('#valSingle').html().replace('{{iconDom}}', $iconDom),
            $delDom = $('#delDom').html(),
            $valMulti = $('#valMulti').html().replace('{{iconDom}}', $iconDom).replace('{{delDom}}', $delDom),
            $valMultiTwo = $('#valMultiTwo').html().replace('{{iconDom}}', $iconDom).replace('{{delDom}}', $delDom),
            _operation = true,
            _add_attr_id;
        return {
            addCategory: function() {
                $mask.html($addCategory).fadeIn(400);
            },
            saveCategory: function($this) {
                if (_operation) {
                    _operation = false;
                    // 获取数据
                    var $p_dom = $this.closest('.m-add-category'),
                        $save_item = $p_dom.find('.save-item'),
                        $err = $p_dom.find('.i-error'),
                        _length = $save_item.length,
                        _data = {};
                    while (_length--) {
                        _data[$save_item[_length].name] = $save_item.eq(_length).val();
                    };

                    // 提示信息
                    Pj.tip({
                        d: $err,
                        t: '正在保存...',
                        s: false
                    });

                    $.ajax({
                        type: 'POST',
                        url: global.categoryMdUrl,
                        data: _data,
                        dataType: 'json',
                        success: function(r) {
                            if (r.status === 'success') {
                                // 提示成功
                                Pj.tip({
                                    d: $err,
                                    t: '保存成功',
                                    s: false
                                });
                                setTimeout(function() {
                                    location.reload();
                                }, 600);
                            } else {
                                Pj.tip({
                                    d: $err,
                                    t: r.message,
                                    s: true
                                });
                            };
                            _operation = true;
                        },
                        error: function() {
                            Pj.tip({
                                d: $err,
                                t: '网络堵塞',
                                s: true
                            });
                            _operation = true;
                        }
                    });
                };
            },
            delOperation: function($this, _type) {
                var _id = $this.closest('li').data('id');
                if (_operation && confirm('确认要删除\n' + $this.data('i'))) {
                    _operation = false;
                    $.ajax({
                        type: 'POST',
                        url: _type === 'attr' ? global.delAttributeUrl : global.delCategoryUrl,
                        dataType: 'json',
                        data: {
                            id: _id
                        },
                        success: function(r) {
                            if (r.status === 'success') {
                                $.remaind('删除成功', false);
                                setTimeout(function() {
                                    location.reload();
                                }, 600);
                            } else {
                                $.remaind(r.message, true);
                            };
                            _operation = true;
                        },
                        error: function() {
                            $.remaind('网络堵塞', true);
                            _operation = true;
                        }
                    });
                };
            },
            addAttribute: function($this) {
                _add_attr_id = $this.closest('li').data('id');
                $mask.html($addAttr).fadeIn(400);
            },
            choiceIcon: function($this) {
                $this.parent().prev().attr({
                    'data-pic': $this.data('id') + '',
                    'src': $this.find('img').attr('src')
                });
            },
            saveOperation: function($this) {
                // 获取数据
                var $p_dom = $mask.find('.m-add-attribute'),
                    $err = $p_dom.find('.i-error'),
                    _d = {};
                if (_operation) {
                    _operation = false;
                    // 拼接数据
                    $this.data('type') === 'edit' ? _d.attr_id = _add_attr_id : _d.id = _add_attr_id;
                    _d.type = $p_dom.find('.attribute-type').val();
                    _d.name = $.trim($p_dom.find('.attribute-name').val());

                    // 多值的情况
                    var _v = [],
                        $v = $p_dom.find('.save-item'),
                        _l = $v.length;
                    if (_l > 0) {
                        while (_l--) {
                            _v.push({
                                'id': $v.eq(_l).data('id'),
                                'value': $.trim($v.eq(_l).val()),
                                'pic': $v.eq(_l).parent().find('.icon_id').attr('data-pic')
                            });
                        };
                        _d.option = _v;
                    };

                    // 单值情况（文版框 文本域）
                    _d.pic = $p_dom.find('.attribute-name').parent().find('.icon_id').attr('data-pic');

                    Pj.tip({
                        d: $err,
                        t: '保存中...',
                        s: false
                    });

                    $.ajax({
                        type: 'POST',
                        url: $this.data('type') === 'edit' ? global.editAttributeUrl : global.addAttributeUrl,
                        data: _d,
                        dataType: 'json',
                        success: function(r) {
                            if (r.status === 'success') {
                                // 提示成功
                                Pj.tip({
                                    d: $err,
                                    t: '保存成功',
                                    s: false
                                });
                                setTimeout(function() {
                                    location.reload();
                                }, 600);
                            } else {
                                Pj.tip({
                                    d: $err,
                                    t: r.message,
                                    s: true
                                });
                            };
                            _operation = true;
                        },
                        error: function() {
                            Pj.tip({
                                d: $err,
                                t: '网络堵塞',
                                s: true
                            });
                            _operation = true;
                        }
                    });
                };
            },
            changeAttr: function($this) {
                var _val = $this.val();
                $mask.find('.attribute-type-wrap').html(
                    (_val === 'input' || _val === 'textarea') ? $valSingle : $valMulti
                );
            },
            attrValAdd: function($this) {
                $this.prev().append($valMultiTwo);
            },
            editCategory: function($this) {
                if (_operation) {
                    _operation = false;
                    // 用于请求数据的属性id
                    _add_attr_id = $this.closest('li').data('id');
                    $.remaind('数据请求中...', false);
                    $.ajax({
                        url: global.getAttributeUrl,
                        dataType: 'json',
                        data: {
                            attr_id: _add_attr_id
                        },
                        success: function(r) {
                            var $wrap,
                                _opt_l,
                                $attrAdd,
                                $now;
                            if (r.status === 'success') {
                                //属性框弹出
                                $mask.html($addAttr);
                                $wrap = $mask.find('.m-add-attribute');
                                // 保存按钮 改为保存属性编辑
                                $wrap.find('.save-attribute').data('type', 'edit');

                                // 改变类型
                                $wrap.find('.attribute-type').val(r.data.type).trigger('change');

                                if (r.data.type === 'input' || r.data.type === 'textarea') {
                                    // 单值得情况
                                    $wrap.find('.attribute-name').val(r.data.name).next().find('li[data-id="' + r.data.icon_id + '"]').trigger('click');
                                } else {
                                    // 多值情况
                                    $wrap.find('.attribute-name').val(r.data.name);
                                    // 遍历每一个候选值
                                    _opt_l = r.data.options.length - 1;
                                    $attrAdd = $wrap.find('.attr-val-add');
                                    $now = $wrap.find('.attr-val-wrap').find('label');
                                    // 第一个列外 ^_^
                                    $now.find('.save-item').data('id', r.data.options[_opt_l].id)
                                        .val(r.data.options[_opt_l].option)
                                        .next().find('li[data-id="' + r.data.options[_opt_l].icon_id + '"]').trigger('click');

                                    while (_opt_l--) {
                                        $attrAdd.trigger('click');
                                        $now = $now.next();
                                        $now.find('.save-item').data('id', r.data.options[_opt_l].id)
                                            .val(r.data.options[_opt_l].option)
                                            .next().find('li[data-id="' + r.data.options[_opt_l].icon_id + '"]').trigger('click');
                                    };

                                    // 给所有删除按钮添加属性 data-role="edit"
                                    $wrap.find('.del-temp-dom').data('role', 'edit');
                                };
                            } else {
                                $.remaind(r.message, true);
                            };
                            _operation = true;
                        },
                        error: function() {
                            $.remaind('网络堵塞', true);
                            _operation = true;
                        }
                    });
                };
            },
            delTempDom: function($this) {
                if ($this.data('role') === 'edit') {
                    if (_operation) {
                        _operation = false;
                        $this.html('删除中...');
                        $.ajax({
                            url: global.delOptionUrl,
                            dataType: 'json',
                            data: {
                                id: $this.closest('label').find('.save-item').data('id')
                            },
                            success: function(r) {
                                if (r.status === 'success') {
                                    $this.parent().remove();
                                } else {
                                    $.remaind(r.message, true);
                                };
                                _operation = true;
                            },
                            error: function() {
                                $.remaind('网络堵塞', true);
                                _operation = true;
                            }
                        });
                    };
                } else {
                    $this.parent().remove();
                };
            },
        };
    })();
    // 品类已经导航折叠
    $allWrap.on('click', '.fold-nav-open', function() {
        $(this).closest('li').toggleClass('active');
    });
    // 增加品类
    $allWrap.on('click', '.add-category', function() {
        Attribute.addCategory();
    });
    // 保存添加品类
    $mask.on('click', '.save-category', function() {
        Attribute.saveCategory($(this));
    });
    // 删除一级品类
    $allWrap.on('click', '.del-category', function() {
        Attribute.delOperation($(this));
    });
    // 删除属性
    $allWrap.on('click', '.del-attr', function() {
        Attribute.delOperation($(this), 'attr');
    });
    // 弹出属性添加框
    $allWrap.on('click', '.add-attribute', function() {
        Attribute.addAttribute($(this));
    });
    // 选择属性图标
    $mask.on('click', '.atrr_icon', function() {
        Attribute.choiceIcon($(this));
    });
    // 保存添加属性
    $mask.on('click', '.save-attribute', function() {
        Attribute.saveOperation($(this));
    });
    // 改变属性类型
    $mask.on('change', '.attribute-type', function() {
        Attribute.changeAttr($(this));
    });
    // 新增属性候选值
    $mask.on('click', '.attr-val-add', function() {
        Attribute.attrValAdd($(this));
    });
    // 编辑属性
    $allWrap.on('click', '.edit-attr', function() {
        Attribute.editCategory($(this));
    });
    // 删除多余dom节点
    $mask.on('click', '.del-temp-dom', function() {
        Attribute.delTempDom($(this));
    });
}(jQuery);
