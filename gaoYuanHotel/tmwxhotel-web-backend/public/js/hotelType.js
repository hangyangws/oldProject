;
/**
 * [created by hangyangws in 2016-02-26]
 * [后台管理系统 - 酒店品牌 - 管理]
 * @return {[Object - IIFE]}   [Brand - hotel brand list]
 */
! function($) {
    "use strict";
    var Brand = (function() {
        var $paging = $allWrap.find('.paging'),
            _is_del = true,
            _page_size = 10;
        return {
            init: function() {
                // 页面分页
                Brand.renderPage();
            },
            delType: function($this) {
                var $tr = $this.closest('tr');
                if (_is_del) {
                    layer.confirm('删除品牌：' + $tr.data('name'), { icon: 3, title: '品牌删除' }, function(index) {
                        layer.close(index);
                        _is_del = false;
                        layer.msg('删除中…');
                        $.ajax({
                                url: '/hotelType/' + $tr.data('id'),
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
                                    layer.alert(_d.msg);
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
                location.href = '/hotelType' + (_v && ('/search/' + _v));
            },
            renderPage: function() {
                var _p = {
                        now: ~~RenderData.pageNum, // 现在的页数
                        total: ~~RenderData.total // 总共的数量
                    },
                    _base_url = '/hotelType' + (RenderData.search ? ('/search/' + RenderData.search + '?') : '?'),
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
            }
        };
    })();
    // 页面初始化
    Brand.init();
    // 删除品牌
    $allWrap.on('click', '.brand-del', function() {
        Brand.delType($(this));
    });
    // 关键字搜索
    $allWrap.on('click', '.brand-search-btn', function() {
        Brand.search($.trim($(this).prev().val()));
    });
}(jQuery);
