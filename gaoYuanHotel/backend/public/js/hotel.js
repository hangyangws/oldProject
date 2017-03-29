;
/**
 * [created by hangyangws in 2016-02-26]
 * [后台管理系统 - 酒店 - 管理]
 * @return {[Object - IIFE]}   [Hotel - hotel list]
 */
! function($) {
    "use strict";
    var Hotel = (function() {
        var $paging = $allWrap.find('.paging'), // 分页的父元素
            _is_del = true, // 现在是否可以执行删除操作
            _page_size = 10;
        return {
            init: function() {
                // 获取酒店品牌
                Hotel.getBrand();
                // 页面分页
                Hotel.renderPage();
            },
            delHotel: function($this) {
                var $tr = $this.closest('tr');
                if (_is_del) {
                    layer.confirm('删除酒店：' + $tr.data('name'), { icon: 3, title: '酒店删除' }, function() {
                        _is_del = false;
                        layer.msg('删除中…');
                        $.ajax({
                                url: '/hotel/' + $tr.data('id'),
                                type: 'DELETE',
                                dataType: 'json'
                            })
                            .done(function(_d) {
                                if (_d.status) {
                                    layer.msg('删除成功');
                                    setTimeout(function() {
                                        location.reload();
                                    }, 100);
                                } else {
                                    layer.msg(_d.msg);
                                };
                                _is_del = true;
                            })
                            .fail(function() {
                                layer.alert('网络堵塞');
                                _is_del = true;
                            });
                    });
                };
            },
            search: function(_v) {
                layer.msg('搜索中');
                location.href = '/hotel' + (_v && ('/search/' + _v)) + (RenderData.hotelbrandid ? ('?hotelbrandid=' + RenderData.hotelbrandid) : '');
            },
            searchBrand: function(_id) {
                layer.msg('搜索中');
                location.href = ['/hotel',
                    (RenderData.search ? ('/search/' + RenderData.search) : ''),
                    (_id !== 'null' ? ('?hotelbrandid=' + _id) : '')
                ].join('');
            },
            renderPage: function() {
                var _p = {
                        now: ~~RenderData.pageNum, // 现在的页数
                        total: ~~RenderData.total // 总共的数量
                    },
                    _base_url = ['/hotel',
                        (RenderData.search ? ('/search/' + RenderData.search + '?') : '?'),
                        (RenderData.hotelbrandid ? ('hotelbrandid=' + RenderData.hotelbrandid + '&') : '')
                    ].join(''),
                    _temp = [],
                    _pages; // 总共的页数
                // 总数还不够一页显示的情况
                if (_p.total <= _page_size) {
                    $paging.addClass('none');
                    return;
                };
                // total > _page_size
                _pages = Math.ceil(_p.total / _page_size);
                if (_pages < 4) {
                    // totals 为 1 || 2 || 3
                    while (_pages) {
                        _temp.push(['<a ',
                            _p.now === _pages ? 'class="current"' : ('href=' + _base_url + 'pageIndex=' + _pages),
                            '>',
                            _pages,
                            '</a>'
                        ].join(''));
                        _pages--;
                    };
                } else {
                    // totals >= 4
                    // 下一页
                    if (_p.now !== _pages) {
                        _temp.push('<a class="next" href="' + _base_url + 'pageIndex=' + (_p.now + 1) + '">&gt;</a>');
                    };
                    // 最后一页
                    _temp.push(['<a ',
                        _p.now === _pages ? 'class="current"' : ('href=' + _base_url + 'pageIndex=' + _pages),
                        '>',
                        _pages,
                        '</a>'
                    ].join(''));
                    // ************************************************************
                    if (_p.now === _pages) {
                        _temp.push('<a>…</a>');
                        _temp.push('<a href="' + _base_url + 'pageIndex=2">2</a>');
                    } else if (_p.now === 1) {
                        _temp.push('<a href="' + _base_url + 'pageIndex=' + (_pages - 1) + '">' + (_pages - 1) + '</a>');
                        _temp.push('<a>…</a>');
                    } else {
                        if (_p.now === 2) {
                            _temp.push('<a>…</a>');
                            _temp.push('<a class="current">2</a>');
                        } else if (_p.now === _pages - 1) {
                            _temp.push('<a class="current">' + (_pages - 1) + '</a>');
                            _temp.push('<a>…</a>');
                        } else {
                            _temp.push('<a>…</a>');
                            _temp.push('<a class="current">' + _p.now + '</a>');
                            _temp.push('<a>…</a>');
                        };
                    };
                    // ************************************************************
                    // 第一页
                    _temp.push(['<a ',
                        _p.now === 1 ? 'class="current"' : ('href=' + _base_url + 'pageIndex=1'),
                        '>',
                        1,
                        '</a>'
                    ].join(''));
                    // 上一页
                    if (_p.now !== 1) {
                        _temp.push('<a class="prev" href="' + _base_url + 'pageIndex=' + (_p.now - 1) + '">&lt;</a>');
                    };
                };
                $paging.html(_temp.reverse().join(''));
            },
            getBrand: function() {
                var _now_brand = RenderData.hotelbrandid;
                $.ajax({
                        url: '/hotelType?isPage=false',
                        dataType: 'json'
                    })
                    .done(function(_data) {
                        if (_data.msg === '获取数据正常') {
                            var _brand_list = _data.data.data.list,
                                _list_l = _brand_list.length,
                                _list_dom = ['<option value="null">选择品牌</option>'];
                            while (_list_l--) {
                                _list_dom.push(['<option value="',
                                    _brand_list[_list_l].id,
                                    '"',
                                    _now_brand === _brand_list[_list_l].id ? ' selected="selected"' : '',
                                    '>',
                                    _brand_list[_list_l].name,
                                    '</option>'
                                ].join(''));
                            };
                            $allWrap.find('.brand-list').html(_list_dom.join(''));
                        } else {
                            // layer.alert(_data.msg);
                        };
                    })
                    .fail(function() {
                        layer.alert('网络堵塞，获取品牌失败');
                    });
            }
        };
    })();
    // 页面初始化
    Hotel.init();
    // 删除品牌
    $allWrap.on('click', '.hotel-del', function() {
        Hotel.delHotel($(this));
    });
    // 品牌搜索
    $allWrap.on('change', '.brand-list', function() {
        Hotel.searchBrand($(this).val());
    });
    // 关键字搜索
    $allWrap.on('click', '.hotel-search-btn', function() {
        Hotel.search($.trim($(this).prev().val()));
    });
}(jQuery);
