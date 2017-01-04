/**
 * 2015-12-08 by hangyangws
 * [Service 服务项管理]
 */

! function($) {
    "use strict";
    var Service = (function() {
        var _service = true, // 是否可以开始获取服务商的数据
            _category = true, // 是否可以开始获取服务项属性的数据
            $provider = $allWrap.find('.provider-sel'),
            $category = $allWrap.find('.category-wrap'),
            $addDom = $('#addDom').html(),
            _operation = true;
        return {
            ini: function() {
                global.categoryid && ( // 页面如果有当前文章类型 处触改变
                    $allWrap.find('.category-type-list').find('option[value="' + global.categoryid + '"]').attr('selected', 'selected')
                );
                global.vendorid && ( // 页面如果有当前文章类型 处触改变
                    $allWrap.find('.provider-type').find('option[value="' + global.vendorid + '"]').attr('selected', 'selected')
                );
                global.keywords && ( // 页面如果有搜索关键字 处触改变
                    $allWrap.find('.search-list').val(global.keywords)
                );
                Pj.qiNiu();
                Pj.inputText();
                Pj.inputDate($allWrap.find('.package-form'));
            },
            choiceType: function($this) {
                var _id;
                if (_service && _category) {
                    _service = false;
                    _category = false;
                    _id = $this.val();
                    if (_id !== 'null') {
                        Service.service(_id);
                        Service.category(_id);
                    } else {
                        $provider.html('<option value="null">选择服务商</option>');
                        $category.html('请选择商品大类');
                        _service = true;
                        _category = true;
                    };
                };
            },
            service: function(_id) {
                var _d = [],
                    _l;
                $.ajax({
                    type: 'POST',
                    url: global.getVendorsUrl,
                    dataType: 'json',
                    data: {
                        id: _id
                    },
                    success: function(r) {
                        if (r.status === 'success') {
                            _l = r.data.length;
                            while (_l--) {
                                _d.push('<option value="' + r.data[_l].id + '">' + r.data[_l].name + '</option>')
                            };
                            _d.join('');
                            $provider.html(_d.length < 1 ? '<option value="null">此商品分类下面服务商</option>' : _d);
                        } else {
                            $.remaind(r.message, true);
                        };
                        _service = true;
                    },
                    error: function() {
                        $.remaind('网络堵塞', true);
                        _service = true;
                    }
                });
            },
            category: function(_id) {
                var _t = '',
                    _v,
                    _l;
                $.ajax({
                    type: 'POST',
                    url: global.getCategoryAttrUrl,
                    dataType: 'json',
                    data: {
                        id: _id
                    },
                    success: function(r) {
                        if (r.status === 'success') {
                            $.each(r.data, function(n, v) {
                                switch (v.type) {
                                    case 'input':
                                        _t += '<div class="mb10">' +
                                            '<span class="vat">' + v.name + '：</span>' +
                                            '<input name="attr[' + v.id + ']" class="i-input i-w-short" type="text" />' +
                                            '</div>';
                                        break;
                                    case 'textarea':
                                        _t += '<div class="mb10">' +
                                            '<span class="vat">' + v.name + '：</span>' +
                                            '<textarea name="attr[' + v.id + ']" class="i-textarea i-w-short bb"></textarea>' +
                                            '</div>';
                                        break;
                                    case 'select':
                                        _v = v.options;
                                        _l = _v.length;

                                        _t += '<div class="mb10">' +
                                            '<span class="vat">' + v.name + '：</span>' +
                                            '<select name="attr[' + v.id + ']" class="i-select i-w-short">';

                                        while (_l--) {
                                            _t += '<option value="' + _v[_l].id + '">' + _v[_l].option + '</option>';
                                        };

                                        _t += '</select>' +
                                            '</div>';
                                        break;
                                    case 'radio':
                                        _v = v.options;
                                        _l = _v.length;

                                        _t += '<div class="mb10 c">' +
                                            '<span class="vat fl">' + v.name + '：</span><div style="width: 80%; float: left">';

                                        while (_l--) {
                                            _t += '<label class="dlb mr20"><input name="attr[' + v.id + ']" class="mr5" type="radio" value="' + _v[_l].id + '" />' + _v[_l].option + '</label>';
                                        };

                                        _t += '</div></div>';
                                        break;
                                    case 'checkbox':
                                        _v = v.options;
                                        _l = _v.length;

                                        _t += '<div class="mb10 c">' +
                                            '<span class="vat">' + v.name + '：</span>';

                                        while (_l--) {
                                            _t += '<label class="dlb mr20"><input name="attr[' + v.id + '][]" class="mr5" type="checkbox" value="' + _v[_l].id + '" />' + _v[_l].option + '</label>';
                                        };

                                        _t += '</div>';
                                        break;
                                };
                            });
                            $category.html(_t === '' ? '此商品分类下面没有属性' : _t);
                        } else {
                            $.remaind(r.message, true);
                        };
                        _category = true;
                    },
                    error: function() {
                        $.remaind('网络堵塞', true);
                        _category = true;
                    }
                });
            },
            addCancelFee: function($this) {
                $this.prev().append($addDom);
            },
            pagingIndex: function($this, e) {
                if ($.getKey(e) === 13) {
                    Service.pagingGo(
                        $this.val(),
                        global.categoryid,
                        global.vendorid,
                        global.keywords
                    );
                };
            },
            pagingGo: function(page, type, type2, search) {
                var _u = '';
                type = type === 'null' ? '' : type;
                type2 = type === 'null' ? '' : type2;
                _u += (page ? '/p/' + page : '') +
                    (type ? '/categoryid/' + type : '') +
                    (type2 ? '/vendorid/' + type2 : '') +
                    (search ? '/search/' + search : '');
                // 跳转
                location.href = global.localUrl + _u;
            },
            search: function(_s) {
                Service.pagingGo('', global.categoryid, global.vendorid, _s);
            },
            operation: function($this, _type) {
                var $tr = $this.closest('tr'),
                    _del = _type === 'del';
                if (confirm('确认' + (_del ? '删除' : '发布') + '服务项: ' + $tr.data('name'))) {
                    if (_operation) {
                        _operation = false;
                        $.remaind('操作中，请稍后...', false);
                        $.ajax({
                            type: 'POST',
                            url: _type === 'del' ? global.delProductUrl : global.isShowUrl,
                            dataType: 'json',
                            data: {
                                id: $tr.data('id')
                            },
                            success: function(r) {
                                if (r.status === 'success') {
                                    $.showMask(false);
                                    if (_del) {
                                        $tr.remove();
                                    } else {
                                        $this.html(r.data === '1' ? '取消发布' : '发布');
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
                }
            }
        };
    })();
    Service.ini();
    // 选择类型
    $allWrap.on('change', '.category-type', function() {
        Service.choiceType($(this));
    });
    // 删除
    $allWrap.on('click', '.service-del', function() {
        Service.operation($(this), 'del');
    });
    // 发布
    $allWrap.on('click', '.service-publish', function() {
        Service.operation($(this), 'publish');
    });
    // 添加节点（取消费用）
    $allWrap.on('click', '.add-cancel-fee', function() {
        Service.addCancelFee($(this));
    });
    // 板块选择
    $allWrap.on('change', '.category-type-list', function() {
        Service.pagingGo('', $(this).val(), '', '');
    });
    $allWrap.on('change', '.provider-type', function() {
        Service.pagingGo('', global.categoryid, $(this).val(), '');
    });
    // 关键字搜索
    $allWrap.on('click', '.service-search-btn', function() {
        Service.search($.trim($(this).prev().val()));
    });
    // 翻页
    $allWrap.on('keyup', '.paging-go', function(e) {
        Service.pagingIndex($(this), e);
    });
}(jQuery);
