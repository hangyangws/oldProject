/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-30.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $mainCon = $('#mainCon'),
        $proNum = $mainCon.find('.j-pro-num'),
        $proWrap = $mainCon.find('.j-pro-wrap'),
        _page_size = 10,
        _next_page = 1,
        _tp_list_html = $('#proList').html(),
        Project = {
            init: function() {
                // 加载第一页数据
                Project.loadData();
            },
            loadData: function() {
                win.F.ajax({
                    url: win.G.load_url.replace('{{page}}', _next_page).replace('{{size}}', _page_size),
                    yes: function(_data) {
                        var _count = _data.data.count;
                        _data = _data.data.data;
                        $proNum.html('我的项目（' + _count + '）');
                        // 如果是最后一页删除“加载更多”
                        ((_page_size * (_next_page - 1) + _data.length) >= _count) && $mainCon.find('.j-more').remove();
                        if (_data.length) {
                            var _html = [];
                            _data.forEach(function(_d) {
                                _html.push(
                                    _tp_list_html
                                    .replace('{{id}}', _d.projectId)
                                    .replace('{{tit}}', _d.projectName)
                                    .replace('{{content}}', _d.projectDesc)
                                    .replace('{{helpNum}}', _d.planCount)
                                    .replace('{{addNum}}', _d.actualCount)
                                );
                            });
                            $proWrap.append(_html.join(''));
                            (_next_page === 1) && $mainCon.find('.j-empty-tip').remove();
                            _next_page++;
                        }
                    }
                });
            }
        };
    Project.init();
    /**
     * event binding
     */
    $mainCon
        .on(win.method, '.j-more', Project.loadData); // 加载更多
}(window || this, Zepto);
