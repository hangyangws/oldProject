/**
 * 2015-12-08 by hangyangws
 * [Goods 商品管理]
 */

! function($) {
    "use strict";
    var Goods = (function() {
        var $dateWrap = $allWrap.find('.package-form'),
            addDom = {
                unDayDom: $('#unDayDom').html(),
                dayPriceDom: $('#dayPriceDom').html(),
                goodsPromotDom: $('#goodsPromotDom').html(),
                exPriceDom: $('#exPriceDom').html()
            },
            $category = $allWrap.find('.category-type'), // 一级类型
            $provider = $allWrap.find('.provider-type'), // 服务商
            $service = $allWrap.find('.service-type'), // 服务项
            $siteOnly = $allWrap.find('.site-only'),
            $siteOnlyInput = $allWrap.find('.site-only').find('input'),
            _operation = true;
        return {
            ini: function() {
                global.categoryid && ( // 页面如果有当前文章类型 处触改变
                    $allWrap.find('.category-type-list').find('option[value="' + global.categoryid + '"]').attr('selected', 'selected')
                );
                global.vendorid && ( // 页面如果有当前文章类型 处触改变
                    $allWrap.find('.provider-type-list').find('option[value="' + global.vendorid + '"]').attr('selected', 'selected')
                );
                global.area && ( // 页面如果有当前文章类型 处触改变
                    $allWrap.find('.area-type-list').find('option[value="' + global.area + '"]').attr('selected', 'selected')
                );
                global.keywords && ( // 页面如果有搜索关键字 处触改变
                    $allWrap.find('.search-list').val(global.keywords)
                );
                Pj.inputText();
                Pj.inputDate($dateWrap);
            },
            addDom: function($this) {
                $this.prev().append(addDom[$this.data('html')]);
                // 初始化日期
                Pj.inputDate($dateWrap, $this.data('type'));
            },
            removeGldp: function($this) {
                var $input = $this.parent().find('input'),
                    _l = $input.length;
                while (_l--) {
                    $input.eq(_l).attr('gldp-id');
                    $('div[gldp-el="' + $input.eq(_l).attr('gldp-id') + '"]').remove();
                };
            },
            choiceOperation: function($this, _type) {
                var _id,
                    _d = ['<option value="null">选择服务' + (_type === 'category' ? '商' : '项') + '</option>'],
                    _l,
                    _only_l;
                if (_operation) {
                    _id = $this.val();
                    if (_id !== 'null') {
                        _operation = false;
                        $.ajax({
                            type: 'POST',
                            url: _type === 'category' ? global.getVendorsUrl : global.getServicesUrl,
                            dataType: 'json',
                            data: {
                                id: _id
                            },
                            success: function(r) {
                                if (r.status === 'success') {
                                    // 如果是婚礼场地 就把摄影没有的删掉
                                    if ($this.data('type') === 'category') {
                                        if ($this.find('option[value="' + $this.val() + '"]').html() !== '婚礼场地') {
                                            $siteOnly.hide();
                                            $siteOnlyInput.removeAttr('name');
                                        } else {
                                            _only_l = $siteOnlyInput.length;
                                            while (_only_l--) {
                                                $siteOnlyInput.eq(_only_l).attr('name', $siteOnlyInput.eq(_only_l).data('name'));
                                            };
                                            $siteOnly.show();
                                        };
                                    };

                                    _l = r.data.length;
                                    while (_l--) {
                                        _d.push('<option value="' + r.data[_l].id + '">' + r.data[_l].name + '</option>')
                                    };
                                    _d.join('');
                                    if (_type === 'category') {
                                        $provider.html(_d.length < 2 ? '<option value="null">此分类下面服务商</option>' : _d);
                                    } else {
                                        $service.html(_d.length < 2 ? '<option value="null">此服务商下面服务项</option>' : _d);
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
                    } else {
                        _type === 'category' && $provider.html('<option value="null">选择服务商</option>');
                        $service.html('<option value="null">选择服务项</option>');
                    };
                };
            },
            pagingIndex: function($this, e) {
                if ($.getKey(e) === 13) {
                    Goods.pagingGo(
                        $this.val(),
                        global.categoryid,
                        global.vendorid,
                        global.area,
                        global.keywords,
                        global.order
                    );
                };
            },
            pagingGo: function(page, type, type2, area, search, order) { // 页数 商品大类 服务商 搜索关键字 排序
                var _u = global.localUrl;
                _u += (page ? '/p/' + page : '') +
                    (type ? '/categoryid/' + type : '') +
                    (type2 ? '/vendorid/' + type2 : '') +
                    (area ? '/area/' + area : '') +
                    (search ? '/search/' + search : '') +
                    (order ? '/order/' + order : '');
                // 跳转
                location.href = _u;
            },
            search: function(_s) {
                Goods.pagingGo('', '', '', '', _s);
            },
            operation: function($this, _type) {
                var $tr = $this.closest('tr'),
                    _del = _type === 'del' ? true : false;
                if (_operation && confirm('确认' + (_del ? '删除' : $this.html()) + '商品:\n' + $tr.data('name') + '?')) {
                    _operation = false;
                    $.remaind('操作中，请稍后...', false);
                    $.ajax({
                        type: 'POST',
                        url: _del ? global.delGoodsUrl : global.isShowUrl,
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
        };
    })();
    Goods.ini();
    $allWrap.on('click', '.add-dom', function() {
        Goods.addDom($(this));
    });
    // 删除临时节点
    $allWrap.on('click', '.del-temp-dom', function() {
        Goods.removeGldp($(this));
    });
    // 类型选择
    $allWrap.on('change', '.category-type', function() {
        Goods.choiceOperation($(this), 'category');
    });
    // 服务商选择
    $allWrap.on('change', '.provider-type', function() {
        Goods.choiceOperation($(this), 'provider');
    });
    // 板块选择
    $allWrap.on('change', '.category-type-list', function() {
        Goods.pagingGo('', $(this).val());
    });
    $allWrap.on('change', '.provider-type-list', function() {
        Goods.pagingGo('', global.categoryid, $(this).val());
    });
    $allWrap.on('change', '.area-type-list', function() {
        Goods.pagingGo('', global.categoryid, '',$(this).val());
    });
    // 关键字搜索
    $allWrap.on('click', '.goods-search-btn', function() {
        Goods.search($.trim($(this).prev().val()));
    });
    // 翻页
    $allWrap.on('keyup', '.paging-go', function(e) {
        Goods.pagingIndex($(this), e);
    });
    // 排序
    $allWrap.on('click', '.order', function(e) {
        var _o = {
            'desc': 'asc',
            'asc': '',
            '': 'desc'
        };
        Goods.pagingGo('', global.categoryid, global.vendorid, global.area, global.keywords, _o[global.order]);
    });
    // 删除
    $allWrap.on('click', '.goods-del', function() {
        Goods.operation($(this), 'del');
    });
    // 发布
    $allWrap.on('click', '.goods-publish', function() {
        Goods.operation($(this), 'publish');
    });
}(jQuery);
