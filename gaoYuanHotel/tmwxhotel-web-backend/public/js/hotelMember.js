/**
 * [created by derek in 2016-03-09]
 * [后台管理系统 - 会员查询 - 管理]
 * @return {[Object - IIFE]}   [Member - hotel member list]
 */
! function($) {
    "use strict";
    var Member = (function() {
        var $paging = $allWrap.find('.paging'),
            _page_size = 10;
        return {
            init: function() {
                // 页面分页
                Member.renderPage();
                // 选择启动状态
                Member.getUse();
            },
            search: function(_v) {
                layer.msg('搜索中');
                location.href = ['/hotelMember',
                    (_v ? ('/search/' + _v) : ''),
                    (RenderData.useable ? ('?isaccountenabled=' + RenderData.useable) : '')
                ].join('');
            },
            searchMember: function(_v) {
                layer.msg('搜索中');
                location.href = ['/hotelMember',
                    (RenderData.search ? ('/search/' + RenderData.search) : ''),
                    (_v === 'null' ? '' : ('?isaccountenabled=' + _v)),
                ].join('');
            },
            renderPage: function() {
                var _p = {
                        now: ~~RenderData.pageNum, // 现在的页数
                        total: ~~RenderData.total // 总共的数量
                    },
                    _base_url = ['/hotelMember',
                        (RenderData.search ? ('/search/' + RenderData.search + '?') : '?'),
                        (RenderData.useable ? ('isaccountenabled=' + RenderData.useable + '&') : '')
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
            getUse: function() {
                if (RenderData.useable) {
                    $allWrap.find('.member-list')
                        .find('option[value=' + RenderData.useable + ']')
                        .attr('selected', 'selected');
                }
            },
            userToggle: function($this) {
                layer.alert('功能尚未开通');
            }
        };
    })();
    // 页面初始化
    Member.init();
    // 关键字搜索
    $allWrap.on('click', '.mem-search-btn', function() {
        Member.search($.trim($(this).prev().val()));
    });
    // 会员搜索（是否禁用）
    $allWrap.on('change', '.member-list', function() {
        Member.searchMember($(this).val());
    });
    // 用户操作
    $allWrap.on('click', '.user-toggle', function() {
        Member.userToggle();
    });
}(jQuery);
