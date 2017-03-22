/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-01-05.
 */

;
! function(win, $, doc, undefined) {
    'use strict';
    var $win = $(win),
        $body = $('#body'),
        $content = $('#content'),
        $scrollTopDom = (function() {
            if (doc.documentElement && doc.documentElement.scrollTop) {
                return doc.documentElement;
            }
            return doc.body;
        })(),
        _next_page = 1,
        _page_size = 10,
        _now_top = 0, // 当前滚动条的顶位置
        _tp = {},
        Project = {
            init: function() {
                // 字符串模板获取
                $body.find('.tp').forEach(function($e) {
                    _tp[$e.dataset.name] = $e.innerHTML;
                    $e.remove();
                });
                // 加载第一页动态数据
                Project.loadData();
            },
            loadData: function() {
                win.F.ajax({
                    url: win.G.list_url
                        .replace('{{page}}', _next_page)
                        .replace('{{size}}', _page_size),
                    data: win.G.data,
                    type: 'POST',
                    yes: function(_data) {
                        var _data = _data.data.data || []; // 获取的数据列表
                        // 如果加载第一页 && 没有数据 -> 移除滚动加载数据事件
                        if (_next_page === 1 && _data.length === 0) {
                            $win.off('scroll');
                            return;
                        }
                        // 如果加载非第一页 && 没有数据 -> 移除滚动加载数据事件 && 提示没有数据了
                        if (_next_page !== 1 && _data.length === 0) {
                            $win.off('scroll');
                            layer.open({
                                content: '没有更多数据了',
                                skin: 'msg',
                                time: 1
                            });
                            return;
                        }
                        var _html = [];
                        _data.forEach(function(_d) {
                            _html.push(
                                _tp.dynamicsList
                                .replace('{{id}}', _d.newsId)
                                .replace('{{head}}', _d.head || win.G.tempHead)
                                .replace('{{from}}', _d.actorName)
                                .replace('{{class}}', _d.actType === '赞' ? 'i-4-14' : 'i-4-13')
                                .replace('{{type}}', _d.actType)
                                .replace('{{to}}', _d.destUserName)
                                .replace('{{time}}', Project.getTime(_d.updateTime))
                                .replace('{{id}}', _d.newsId)
                            );
                        });
                        $content.append(_html.join(''));
                        // 加载图片(需要优化，滚动加载)
                        Project.syncImg();
                        // 移除“空数据提示”Dom
                        (_next_page === 1) && $body.find('.j-no-data').remove();
                        // 一下页数加一
                        _next_page++;
                    }
                });
            },
            getTime: function(_time) {
                var date = new Date(),
                    y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate();
                if (_time) {
                    date = new Date(_time);
                    var _y = date.getFullYear(),
                        _m = date.getMonth() + 1,
                        _d = date.getDate(),
                        _h = date.getHours(),
                        _min = date.getMinutes();
                    if (y === _y && m === _m && d === _d) {
                        return '今天 ' + _h + ':' + _min;
                    }
                    if (y === _y) {
                        return _m + '月' + _d + '日';
                    }
                    return _y + '年' + _m + '月' + _d + '日';
                } else {
                    return y + '年' + m + '月' + d + '日';
                }
            },
            syncImg: function() {
                var _bg_css = 'url({img}) no-repeat 50% 50% / cover;';
                $content.find('.j-sync-img').forEach(function($e) {
                    $e = $($e);
                    $e.css({
                        background: _bg_css.replace('{img}', $e.data('bg'))
                    }).removeAttr('data-bg').removeClass('j-sync-img');
                });
            },
            scrollLoad: function() {
                var _scroll_top = $scrollTopDom.scrollTop;
                if (_scroll_top > _now_top) { // 向下滚动
                    // 滚动到底部，加载当前tab下一页数据
                    (Math.abs($scrollTopDom.scrollHeight - _scroll_top - $win.height()) < 10) && Project.loadData();
                }
                _now_top = _scroll_top;
            }
        };
    /**
     * 项目初始化
     */
    Project.init();

    /**
     * event binding
     */
    $win
        .on('scroll', Project.scrollLoad); // 检测滚动，加载更多
}(window || this, Zepto, document);
