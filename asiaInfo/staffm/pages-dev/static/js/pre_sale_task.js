/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-02-24.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $scroll = $(win),
        $html = document.documentElement,
        _scroll = { // 滚动加载相关数据
            $con: $('#taskWrap'), // 内容父容器
            pageSize: 10, // 一次加载数量
            nextPage: 1,
            scrollTop: 0, // 当前滚动的top
            continueLoad: true // 是否继续滚动加载
        },
        _work_way = {
            '0': '现场支持',
            '1': '远程支持'
        },
        Project = {
            init: function() {
                // 加载第一页动态数据
                Project.loadData();
            },
            loadData: function() {
                win.F.ajax({
                    url: win.G.taskUrl
                        .replace('{{page}}', _scroll.nextPage)
                        .replace('{{size}}', _scroll.pageSize),
                    type: 'POST',
                    yes: function(_data) {
                        _data = _data.data.data || []; // 获取的数据列表
                        // 加载第一页，没有数据
                        if (_scroll.nextPage === 1 && _data.length === 0) {
                            _scroll.continueLoad = false;
                            _scroll.$con.html(win._tp.empty);
                            return;
                        }
                        // 加载非第一页，没有数据
                        if (_scroll.nextPage !== 1 && _data.length === 0) {
                            _scroll.continueLoad = false;
                            layer.open({
                                content: '没有更多数据了',
                                skin: 'msg',
                                time: 1.5
                            });
                            return;
                        }
                        // 数据拼接
                        var _html = [];
                        _data.forEach(function(_d) {
                            _html.push(
                                win._tp.tasklist
                                .replace('{{isAccept}}', _d.isAccept ? 'gray' : '')
                                .replace('{{supportid}}', _d.supportid)
                                .replace('{{askerName}}', _d.askerName)
                                .replace('{{createTime}}', F.getLongDate(_d.createTime))
                                .replace('{{starttime}}', F.getShortDate(_d.starttime))
                                .replace('{{endtime}}', F.getShortDate(_d.endtime))
                                .replace('{{workWay}}', _work_way[_d.workWay])
                                .replace('{{supportDesc}}', _d.supportDesc)
                            );
                        });
                        _scroll.$con.append(_html.join(''));
                        // 下页数加一
                        _scroll.nextPage++;
                    }
                });
            },
            scroll: function() {
                var _top_new = $scroll.scrollTop(),
                    _bottom;
                if (_top_new > _scroll.scrollTop) { // 向下滚动
                    _bottom = Math.abs($html.scrollHeight - _top_new - $scroll.height());
                    if (_bottom < 20 && _scroll.continueLoad) {
                        Project.loadData();
                    }
                }
                _scroll.scrollTop = _top_new;
            }
        };
    /**
     * 项目初始化
     */
    Project.init();

    /**
     * event binding
     */
    $scroll
        .on('scroll', Project.scroll); // 检测滚动，加载更多
}(window || this, Zepto);
