/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-02-24.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $main = $('#main'),
        _month_lenth = (function() {
            var _date = new Date,
                _month = _date.getMonth();
            if (_month === 11) { // 12月一定是31天
                return 31;
            }
            _date.setMonth(_month + 1);
            _date.setDate(0);
            return _date.getDate();
        })(),
        _listData = {
            pageSize: 10,
            scrollEnd: false,
            nextPage: 1,
            $con: $main.find('.j-tabone-con')
        },
        Project = {
            init: function() {
                Project.loadData();
            },
            loadData: function() {
                win.F.ajax({
                    url: win.G.listUrl
                        .replace('{{page}}', _listData.nextPage)
                        .replace('{{size}}', _listData.pageSize),
                    data: {
                        depid: win.G.depid,
                        areaid: win.G.areaid
                    },
                    type: 'POST',
                    yes: function(_data) {
                        _data = _data.data.data || []; // 获取的数据列表
                        // 加载第一页，没有数据
                        if (_listData.nextPage === 1 && _data.length === 0) {
                            _listData.scrollEnd = true;
                            _listData.$con.html(win._tp.empty);
                            return;
                        }
                        // 加载非第一页，没有数据
                        if (_listData.nextPage !== 1 && _data.length === 0) {
                            _listData.scrollEnd = true;
                            layer.open({
                                content: '没有更多数据了',
                                skin: 'msg',
                                time: 1.5
                            });
                            return;
                        }
                        // 修改页面title
                        document.title = _data[0].dep;
                        // 数据拼接
                        var _html = [];
                        _data.forEach(function(_d) {
                            _html.push(
                                win._tp.manlist
                                .replace('{{gray}}', _d.works ? 'gray' : '')
                                .replace('{{status}}', _d.works ? '已占用' : '空闲')
                                .replace('{{photo}}', _d.photo || win.G.defaultHead)
                                .replace('{{name}}', _d.name)
                                .replace('{{score}}', _d.score || 0)
                                .replace('{{workInMonth}}', _d.workInMonth || 0)
                                .replace('{{works}}', _month_lenth)
                            );
                        });
                        _listData.$con.append(_html.join(''));
                        // 下页数加一
                        _listData.nextPage++;
                    }
                });
            },
            scroll: function() {
                var _top_old = $main.data('scrolltop') || 0,
                    _top_new = $main.scrollTop();
                if (_top_new > _top_old) { // 向下滚动
                    var _bottom = Math.abs(this.scrollHeight - _top_new - $main.height());
                    // 滚动到底部 并且 当前tab没有加载结束
                    if (_bottom < 20 && !_listData.scrollEnd) {
                        Project.loadData();
                    }
                }
                $main.data('scrolltop', _top_new);
            },
        };
    /**
     * 项目初始化
     */
    Project.init();

    /**
     * event binding
     */
    $main
        .on('scroll', Project.scroll); // 检测滚动，加载更多
}(window || this, Zepto);
