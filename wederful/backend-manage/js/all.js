/**
 * Pj 后台管理projet
 * fj in 2015-11-02
 */

! function($) {
    "use strict";
    var Pj = (function() {
        /**
         * 页面全局节点
         */
        var $allWrap = $('#allWrap'),
            $mask = $('#mask'),

            /**
             * 商品列表页
             */
            // 分页
            _page = '1',
            _city = global.countryid,
            _dis = global.destinationid,
            _search = global.keywords,

            /**
             * 商家添加 变量
             */
            _add_merchant = '<div class="m-add-merchant m-add-box dlb r4 bcf">' +
            '<label class="db mb10">' +
            '<span>商家名称</span>' +
            '<input name="name" class="save-item i-input" type="text" />' +
            '</label>' +
            '<label class="db mb10">' +
            '<span>商家地址</span>' +
            '<input name="address" class="save-item i-input" type="text" />' +
            '</label>' +
            '<label class="db mb10">' +
            '<span>联系人</span>' +
            '<input name="contacts" class="save-item i-input" type="text" />' +
            '</label>' +
            '<label class="db mb10">' +
            '<span>联系电话</span>' +
            '<input name="mobile" class="save-item i-input" type="text" />' +
            '</label>' +
            '<label class="db mb10">' +
            '<span>联系邮箱</span>' +
            '<input name="email" class="save-item i-input" type="text" />' +
            '</label>' +
            '<label class="db mb5">' +
            '<span>其他</span>' +
            '<textarea name="other" class="save-item i-textarea bb"></textarea>' +
            '</label>' +
            '<label class="db mb10">' +
            '<span>&emsp;</span>' +
            '<span class="i-error">&emsp;</span>' +
            '</label>' +
            '<div class="db mb10">' +
            '<span>&emsp;</span>' +
            '<div class="dlb">' +
            // 在编辑弹框 class 为 edit-merchant
            '<button class="save-merchant i-button i-b-mw mr20" type="bubtton">保存</button>' +
            '<button class="close-mask i-button i-b-mw" type="bubtton">关闭</button>' +
            '</div>' +
            '</div>' +
            '</div>',
            _merchantSaving = true,
            // 地区
            _areaSelecting = true,

            /**
             * 选择分类
             */
            _choiceCategorying = true,

            /**
             * 品类管理 变量
             */
            _add_category = '<div class="m-add-category m-add-box dlb r4 bcf">' +
            '<label class="db mb10">' +
            '<span>品类名称</span>' +
            '<input name="name" class="save-item i-input" type="text" />' +
            '</label>' +
            '<label class="db mb10">' +
            '<span>&emsp;</span>' +
            '<span class="i-error">&emsp;</span>' +
            '</label>' +
            '<div class="db mb10">' +
            '<span>&emsp;</span>' +
            '<div class="dlb">' +
            // 添加子类 class 为 save-category-sub
            '<button class="save-category i-button i-b-mw mr20" type="bubtton">保存</button>' +
            '<button class="close-mask i-button i-b-mw" type="bubtton">关闭</button>' +
            '</div>' +
            '</div>' +
            '</div>',
            _categorySaving = true,
            _add_category_id,

            /**
             * 属性管理
             */
            // 属性添加模板
            _attr_add = '<div class="m-add-attribute m-add-box dlb r4 bcf">' +
            '<label class="db mb10">' +
            '<span>属性类型</span>' +
            '<select class="attribute-type i-select">' +
            '<option value="input">文本框</option>' +
            '<option value="textarea">文本域</option>' +
            '<option value="select">下拉框</option>' +
            '<option value="radio">单选框</option>' +
            '<option value="checkbox">多选框</option>' +
            '</select>' +
            '</label>' +
            '<div class="attribute-type-wrap c">' +
            '<label class="db fl">' +
            '<span>属性名</span>' +
            '<input type="text" class="attribute-name i-input" />' +
            '</label>' +
            '</div>' +
            '<label class="db mb10">' +
            '<span>&emsp;</span>' +
            '<span class="i-error">&emsp;</span>' +
            '</label>' +
            '<div class="db mb10">' +
            '<span>&emsp;</span>' +
            '<div class="dlb">' +
            '<button class="save-attribute i-button i-b-mw mr20" type="bubtton">保存</button>' +
            '<button class="close-mask i-button i-b-mw" type="bubtton">关闭</button>' +
            '</div>' +
            '</div>' +
            '</div>',
            // 多值属性模板
            _attr_val_multi = '<label class="db mr20 fl">' +
            '<span>属性名</span>' +
            '<input type="text" class="attribute-name i-input i-text-s" />' +
            '</label>' +
            '<section class="attr-val-wrap bcf pr pl20 fr">' +
            '<div class="dlb">' +
            '<label class="db mb10"><span>候选值</span><input type="text" class="save-item i-input i-text-s" /></label>' +
            '</div>' +
            '<button type="buton" class="attr-val-add ml10 i-button i-b-mw">新增值</button>' +
            '</section>',
            // 多值属性 - 值
            _attr_val_add = '<label class="db mb10"><span>候选值</span><input type="text" class="save-item i-input i-text-s" /></label>',
            // 文本属性 模板
            _attr_val_single = '<label class="db fl">' +
            '<span>属性名</span>' +
            '<input type="text" class="attribute-name i-input" />' +
            '</label>',
            _add_attr_id,
            _addAttring = true,
            // 品类 属性 删除
            _delCategory = true;
        return {
            /**
             * public
             */
            ini: function() {
                _city && (
                    $allWrap.find('.area-search-a').find('option[value="' + global.countryid + '"]').attr('selected', 'selected')
                );
                _dis && (
                    $allWrap.find('.area-search-b').find('option[value="' + global.destinationid + '"]').attr('selected', 'selected')
                );
                _search && (
                    $allWrap.find('.goods-search-ipt').val(_search)
                );

                /**
                 * 富文本编辑
                 */
                // 文本框 - 没有文件上传
                var _edit = [],
                    $edit = $('.edit-dom'),
                    _l = $edit.length,
                    _toolbar = [
                              'title',
                              'bold',
                              'italic',
                              'underline',
                              'strikethrough',
                              'color',
                              'ol',             // ordered list
                              'ul',             // unordered list
                              //'blockquote',     // 块引用
                              //'code',           // code block
                              //'table',
                              'link',
                              //'image',
                              'hr',             // horizontal ruler
                              'indent',
                              'outdent',
                              'alignment',
                            ];

                if ($edit.length > 0) {
                    while(_l--) {
                        _edit[_l] = new Simditor({
                            textarea: $edit[_l],
                            toolbar: _toolbar, //工具栏
                            toolbarFloat: false, // 工具条不固定浏览器头部
                            placeholder: '请输入编辑内容...'
                        })
                    };
                };
            },
            /**
             * 商品列表分页
             */
            pagingJudge: function($this) {
                Pj.pagingGo(
                    $this.data('role') === 'p-dir' ? $this.data('p') : $this.val(),
                    _city,
                    _dis,
                    _search
                );
            },
            pagingGo: function(page, city, dis, search) {
                var _u = '/';
                _u += (page ? page : '1') +
                    (city ? '/countryid/' + city : '') +
                    (dis ? '/destinationid/' + dis : '') +
                    (search ? '/search/' + search : '');
                // 设置新的搜索数据
                _page = page;
                _city = city;
                _dis = dis;
                _search = search;
                location.href = global.goodsManageUrl + _u;
            },
            goodsSearch: function(_s) {
                _search = _s;
                Pj.pagingGo('1', _city, _dis, _search);
            },

            /**
             * 地区事件
             */
            selectArea: function($this, _next) {
                var _id = $this.val(), // 一级地区的id
                    _t = '<option value="null">选择地区</option>',
                    _sub_area = _next ? $this.next() : $this.closest('tr').find('.select-area-b');

                if (_id !== 'null') {
                    if (_next) {
                        Pj.pagingGo('1', _id, '', _search);
                    } else if (_areaSelecting) {
                        _areaSelecting = false;
                        $.ajax({
                            url: global.cityListUrl + '/' + _id,
                            dataType: 'json',
                            success: function(r) {
                                if (r.status === 'success') {
                                    if (r.data.length) {
                                        $.each(r.data, function(n, v) {
                                            _t += '<option value="' + v.id + '">' + v.name + '</option>';
                                        });
                                        _sub_area.html(_t).removeClass('none');
                                    } else {
                                        _sub_area.addClass('none').html(_t);
                                    }
                                } else {
                                    $.remaind(r.message, true);
                                };
                                // 复原 select 当前城市
                                $this.find('option[value="' + _id + '"]').attr('selected', 'selected');
                                _areaSelecting = true;
                            },
                            error: function() {
                                $.remaind('网络堵塞', true);
                                _areaSelecting = true;
                            }
                        });
                    };
                } else {
                    // 不搜索任何城市
                    _next && (
                        Pj.pagingGo('1', '', '', _search)
                    );
                };
            },

            selectAreaSub: function($this) {
                var _v = $this.val();
                Pj.pagingGo(
                    '1',
                    _city,
                    _v === 'null' ? '' : _v,
                    _search
                );
            },

            /**
             * 商家添加
             */
            addMerchant: function(_type) {
                $mask.html(_add_merchant).fadeIn(400);
                if (_type === 'check') {
                    var _id = $allWrap.find('.select-merchant').val();
                    if (_id !== 'null') {
                        var $merchant = $mask.find('.m-add-merchant'),
                            $save_item = $merchant.find('.save-item'),
                            $err = $merchant.find('.i-error');

                        // 保存按钮去掉class save-merchant 变为 edit-merchant
                        $merchant.find('.save-merchant').removeClass('save-merchant').addClass('edit-merchant');

                        Pj.tip({
                            d: $err,
                            t: '正在加载数据...',
                            s: false
                        });
                        // 获取id 请求值 填进dom
                        $.ajax({
                            type: 'POST',
                            // ### 查看商家 获取数据的地址
                            url: global.getVendorDetailUrl,
                            data: {
                                id: _id
                            },
                            dataType: 'json',
                            success: function(r) {
                                if (r.status === 'success') {
                                    // 填进dom
                                    $.each(r.data, function(n, v) {
                                        $save_item.filter('[name="' + n + '"]').val(v);
                                    });
                                    Pj.tip({
                                        d: $err,
                                        t: '&emsp;',
                                        s: false
                                    });
                                } else {
                                    Pj.tip({
                                        d: $err,
                                        t: r.message,
                                        s: true
                                    });
                                };
                            },
                            error: function() {
                                Pj.tip({
                                    d: $err,
                                    t: '网络堵塞',
                                    s: true
                                });
                            }
                        });
                    } else {
                        $.remaind('请选择商家', true);
                    };
                };
            },
            // 保存商家添加
            saveMerchant: function($this, _type) {
                if (_merchantSaving) {
                    _merchantSaving = false;
                    // 获取数据
                    var $p_dom = $this.closest('.m-add-merchant'),
                        $save_item = $p_dom.find('.save-item'),
                        $err = $p_dom.find('.i-error'),
                        _length = $save_item.length,
                        _data = {};
                    while (_length--) {
                        _data[$save_item[_length].name] = $save_item.eq(_length).val();
                    };

                    _type && (_data.id = $allWrap.find('.select-merchant').val());

                    // 提示信息
                    Pj.tip({
                        d: $err,
                        t: _type ? '正在保存...' : '正在添加...',
                        s: false
                    });
                    $.ajax({
                        type: 'POST',
                        url: global.addVendorsUrl,
                        data: _data,
                        dataType: 'json',
                        success: function(r) {
                            if (r.status === 'success') {
                                if (_type) {
                                    // 修改商家 页面修改节点
                                    $allWrap.find('.select-merchant').find('option[value="' + r.data.id + '"]').val(r.data.id).html(r.data.name);
                                } else {
                                    // 添加商家 页面插入节点
                                    $allWrap.find('.select-merchant').append('<option value="' + r.data.id + '">' + r.data.name + '</option>');
                                };
                                // 提示成功
                                Pj.tip({
                                    d: $err,
                                    t: _type ? '保存成功' : '添加成功',
                                    s: false
                                });
                                setTimeout(function() {
                                    $.showMask(false);
                                }, 600);
                            } else {
                                Pj.tip({
                                    d: $err,
                                    t: r.message,
                                    s: true
                                });
                            };
                            _merchantSaving = true;
                        },
                        error: function() {
                            Pj.tip({
                                d: $err,
                                t: '网络堵塞',
                                s: true
                            });
                            _merchantSaving = true;
                        }
                    });
                };
            },

            /**
             * 分类选择
             */
            choiceCategory: function($this) {
                var _id = $this.val(), // 一级品类的id
                    _t = '<option value="null">选择地区</option>',
                    $subCategory = $this.closest('tr').find('.choice-category-b');
                if (_choiceCategorying) {
                    _choiceCategorying = false;
                    $.ajax({
                        type: 'POST',
                        url: global.getChildrenCategoryUrl,
                        data: {
                            id: _id
                        },
                        dataType: 'json',
                        success: function(r) {
                            if (r.status === 'success') {
                                // 展示二级品类
                                $.each(r.data, function(n, v) {
                                    _t += '<option value="' + v.id + '">' + v.name + '</option>';
                                });
                                $subCategory.html(_t).removeClass('none');
                            } else {
                                $.remaind(r.message, true);
                            };
                            _choiceCategorying = true;
                        },
                        error: function() {
                            $.remaind('网络堵塞', true);
                            _choiceCategorying = true;
                        }
                    });
                };
            },
            choiceCategorySub: function($this) {
                var _id = $this.val(), // 二级品类的id
                    _t = '',
                    $categoryWrap = $allWrap.find('.category-wrap'),
                    _v,
                    _l;
                if (_choiceCategorying) {
                    _choiceCategorying = false;
                    $.ajax({
                        type: 'POST',
                        url: global.getCategoryAttrUrl,
                        data: {
                            id: _id
                        },
                        dataType: 'json',
                        success: function(r) {
                            if (r.status === 'success') {
                                // 展示二级品类下面的属性
                                $.each(r.data, function(n, v) {
                                    switch (v.type) {
                                        case 'input':
                                            _t += '<div class="mb10">' +
                                                '<span class="vat">' + v.name + '：</span>' +
                                                '<input name="attr_' + v.id + '" class="i-input i-w-short" type="text" />' +
                                                '</div>';
                                            break;
                                        case 'textarea':
                                            _t += '<div class="mb10">' +
                                                '<span class="vat">' + v.name + '：</span>' +
                                                '<textarea name="attr_' + v.id + '" class="i-textarea i-w-short bb"></textarea>' +
                                                '</div>';
                                            break;
                                        case 'select':
                                            _v = v.options;
                                            _l = _v.length;

                                            _t += '<div class="mb10">' +
                                                '<span class="vat">' + v.name + '：</span>' +
                                                '<select name="attr_' + v.id + '" class="i-select i-w-short">';

                                            while (_l--) {
                                                _t += '<option value="' + _v[_l].id + '">' + _v[_l].option + '</option>';
                                            };

                                            _t += '</select>' +
                                                '</div>';
                                            break;
                                        case 'radio':
                                            _v = v.options;
                                            _l = _v.length;

                                            _t += '<div class="mb10">' +
                                                '<span class="vat">' + v.name + '：</span>';

                                            while (_l--) {
                                                _t += '<label class="mr20"><input name="attr_' + v.id + '" class="mr5" type="radio" value="' + _v[_l].id + '" />' + _v[_l].option + '</label>';
                                            };

                                            _t += '</div>';
                                            break;
                                        case 'checkbox':
                                            _v = v.options;
                                            _l = _v.length;

                                            _t += '<div class="mb10">' +
                                                '<span class="vat">' + v.name + '：</span>';

                                            while (_l--) {
                                                _t += '<label class="mr20"><input name="attr_' + v.id + '[]" class="mr5" type="checkbox" value="' + _v[_l].id + '" />' + _v[_l].option + '</label>';
                                            };

                                            _t += '</div>';
                                            break;
                                    };
                                });
                                $categoryWrap.html(_t).removeClass('none');
                            } else {
                                $.remaind(r.message, true);
                            };
                            _choiceCategorying = true;
                        },
                        error: function() {
                            $.remaind('网络堵塞', true);
                            _choiceCategorying = true;
                        }
                    });
                };
            },

            /**
             * 品类管理
             */
            // 弹出添加(子类)品类 框
            addCategory: function($this) {
                $mask.html(_add_category).fadeIn(400);
                $this && (
                    // 保存按钮去掉class save-category 变为 save-category-sub
                    $mask.find('.m-add-category').find('.save-category').removeClass('save-category').addClass('save-category-sub'),
                    // 设置当前要增加二级品类的id
                    _add_category_id = $this.closest('li').data('id')
                );
            },
            // 保存增加(子类)品类
            saveCategory: function($this, _type) {
                // 获取值
                // ajax
                // 成功
                // 提示 然后 600ms later 刷新当前页
                // 失败
                // 提示
                if (_categorySaving) {
                    _categorySaving = false;
                    // 获取数据
                    var $p_dom = $this.closest('.m-add-category'),
                        $save_item = $p_dom.find('.save-item'),
                        $err = $p_dom.find('.i-error'),
                        _length = $save_item.length,
                        _data = {};
                    while (_length--) {
                        _data[$save_item[_length].name] = $save_item.eq(_length).val();
                    };

                    _type && (_data.parentId = _add_category_id);

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
                            _categorySaving = true;
                        },
                        error: function() {
                            Pj.tip({
                                d: $err,
                                t: '网络堵塞',
                                s: true
                            });
                            _categorySaving = true;
                        }
                    });
                };
            },

            /**
             * 属性管理
             */
            // 弹出增加属性框
            addAttribute: function($this) {
                _add_attr_id = $this.closest('li').data('id');
                $mask.html(_attr_add).fadeIn(400);
            },
            // 改变属性类型 （input select checkbox radio）
            changeAttr: function($this) {
                var _val = $this.val();
                $('#mask').find('.attribute-type-wrap').html(
                    (_val === 'input' || _val === 'textarea') ? _attr_val_single : _attr_val_multi
                );
            },
            // 增加候选属性 - 值
            attrValAdd: function($this) {
                $this.prev().append(_attr_val_add);
            },
            // 保存新增属性
            saveAttr: function() {
                // 获取数据
                var $p_dom = $mask.find('.m-add-attribute'),
                    $err = $p_dom.find('.i-error'),
                    _d = {};
                if (_addAttring) {
                    _addAttring = false;
                    // 拼接数据
                    _d.id = _add_attr_id;
                    _d.type = $p_dom.find('.attribute-type').val();
                    _d.name = $.trim($p_dom.find('.attribute-name').val());

                    var _v = [],
                        $v = $p_dom.find('.save-item'),
                        _l = $v.length;
                    while (_l--) {
                        _v.push(
                            $.trim(
                                $v.eq(_l).val()
                            )
                        )
                    };

                    _v.length && (_d.option = _v);

                    Pj.tip({
                        d: $err,
                        t: '保存中...',
                        s: false
                    });
                    $.ajax({
                        type: 'POST',
                        url: global.addAttributeUrl,
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
                            _addAttring = true;
                        },
                        error: function() {
                            Pj.tip({
                                d: $err,
                                t: '网络堵塞',
                                s: true
                            });
                            _addAttring = true;
                        }
                    });
                };
            },

            /**
             * 删除品类属性
             */
            delCategory: function($this, _attr) {
                var _id = $this.closest('li').data('id');
                if (_delCategory && confirm('确认要删除\n' + $this.data('i'))) {
                    _delCategory = false;
                    $.ajax({
                        type: 'POST',
                        url: _attr ? global.delAttributeUrl : global.delCategoryUrl,
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
                            _delCategory = true;
                        },
                        error: function() {
                            $.remaind('网络堵塞', true);
                            _delCategory = true;
                        }
                    });
                };
            },

            /**
             * [tip 所有错误提示]
             * @param  o   [参数对象]
             * @param  o.d [错误节点]
             * @param  o.t [错误内容]
             * @param  o.s [错误状态 true-> 红色, false-> 正常色]
             */
            tip: function(o) {
                o.d.css('color', o.s ? '#f00' : '#bdb099').html(o.t);
            }
        };
    })();
    /**
     * 初始化
     */
    Pj.ini();

    /**
     * 商品列表
     */
    // 翻页
    $('#allWrap').find('.con-paging').on('click', '.paging-dir', function() {
        Pj.pagingJudge($(this));
    });
    // 到第几页
    $('#allWrap').find('.con-paging').on('change', '.pading-change', function() {
        Pj.pagingJudge($(this));
    });
    // 一级地区选择 (商品列表页)
    $('#allWrap').on('change', '.area-search-a', function() {
        Pj.selectArea($(this), true);
    });
    // 二级地区选择 （商品列表页）
    $('#allWrap').on('change', '.area-search-b', function() {
        Pj.selectAreaSub($(this));
    });
    // 关键字搜索
    $('#allWrap').find('.goods-search-btn').on('click', function() {
        Pj.goodsSearch(
            $.trim(
                $('#allWrap').find('.goods-search-ipt').val()
            )
        );
    });
    $('#allWrap').find('.goods-search-ipt').on('keyup', function(e) {
        e = e || window.e;
        e.keyCode === 13 && (
            $('#allWrap').find('.goods-search-btn').trigger('click')
        );
    });

    /**
     * 地区
     */
    // 一级地区选择 (新增商品页)
    $('#allWrap').on('change', '.select-area-a', function() {
        Pj.selectArea($(this));
    });

    /**
     * 商家
     */
    // 添加商家
    $('#allWrap').on('click', '.add-merchant', function() {
        Pj.addMerchant();
    });
    // 查看商家详细信息
    $('#allWrap').on('click', '.check-merchant', function() {
        Pj.addMerchant('check');
    });
    // 添加按钮 ->保存商家
    $('#mask').on('click', '.save-merchant', function() {
        Pj.saveMerchant($(this));
    });
    // 查看按钮 ->保存商家
    $('#mask').on('click', '.edit-merchant', function() {
        Pj.saveMerchant($(this), 'edit');
    });

    /**
     * 分类选择
     */
    // 一级分类选择
    $('#allWrap').on('change', '.choice-category-a', function() {
        Pj.choiceCategory($(this));
    });
    // 二级分类选择
    $('#allWrap').on('change', '.choice-category-b', function() {
        Pj.choiceCategorySub($(this));
    });

    /**
     * 品类
     */
    // 增加品类
    $('#allWrap').on('click', '.add-category', function() {
        Pj.addCategory();
    });
    // 增加子类
    $('#allWrap').on('click', '.add-category-sub', function() {
        Pj.addCategory($(this));
    });
    // 保存添加品类
    $('#mask').on('click', '.save-category', function() {
        Pj.saveCategory($(this));
    });
    // 保存添加品类 - 子类
    $('#mask').on('click', '.save-category-sub', function() {
        Pj.saveCategory($(this), 'sub');
    });

    /**
     * 属性添加
     */
    // 弹出属性添加框
    $('#allWrap').on('click', '.add-attribute', function() {
        Pj.addAttribute($(this));
    });
    // 改变属性类型
    $('#mask').on('change', '.attribute-type', function() {
        Pj.changeAttr($(this));
    });
    // 新增属性候选值
    $('#mask').on('click', '.attr-val-add', function() {
        Pj.attrValAdd($(this));
    });
    // 保存添加属性
    $('#mask').on('click', '.save-attribute', function() {
        Pj.saveAttr();
    });

    /**
     * 删除品类和属性
     */
    // 删除品类
    $('#allWrap').on('click', '.del-category', function() {
        Pj.delCategory($(this));
    });
    // 删除属性
    $('#allWrap').on('click', '.del-attr', function() {
        Pj.delCategory($(this), 'attr');
    });

    /**
     * 其他
     */
    // 关闭mask
    $('#body').on('click', '.close-mask', function() {
        $.showMask(false);
    });

    // 导航栏展开
    $('#mainNav').on('click', '.nav-dir', function() {
        $(this).closest('li').toggleClass('active');
    });
    $('#allWrap').on('click', '.fold-nav-open', function() {
        $(this).closest('li').toggleClass('active');
    });

    // 日期选择框初始化
    $('.input-date').glDatePicker({
        calendarOffset: {
            x: 0,
            y: -1
        },
        format: 'yyyy-mm-dd',
        zIndex: 1
    });
}(jQuery);
