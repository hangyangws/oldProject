/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-02-24.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $listHead = $('#listHead'),
        $main = $('#main'),
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
        _tab = {
            tabone: {
                nextPage: 1,
                $label: $listHead.find('.j-1-label'),
                $con: $main.find('.j-tabone-con')
            },
            tabtwo: {
                nextPage: 1,
                $label: $listHead.find('.j-2-label'),
                $con: $main.find('.j-tabtwo-con')
            },
            tabthree: {
                nextPage: 1,
                $label: $listHead.find('.j-3-label'),
                $con: $main.find('.j-tabthree-con')
            },
            tabfour: {
                nextPage: 1,
                $label: $listHead.find('.j-4-label'),
                $con: $main.find('.j-tabfour-con')
            }
        },
        _page_size = 10,
        _label,
        Project = {
            init: function() {

                // 加载第一页动态数据
                Project.tabToggle(location.hash.slice(1));
            },
            loadData: function() {
                var nowTab = _tab[_label];
                win.F.ajax({
                    url: win.G.listUrl
                        .replace('{{page}}', nowTab.nextPage)
                        .replace('{{size}}', _page_size),
                    data: {
                        depid: nowTab.$label.data('code')
                    },
                    type: 'POST',
                    yes: function(_data) {
                        // 显示空闲比例
                        nowTab.$con.find('.j-con-tip').html((_data.data.ext * 100 / _data.data.count).toFixed(2) + '%');
                        _data = _data.data.data || []; // 获取的数据列表
                        // 是否加载过（从其他tab切换过来不用出发加载数据）
                        nowTab.alreadyLoaded = true;
                        // 加载第一页，没有数据
                        if (nowTab.nextPage === 1 && _data.length === 0) {
                            nowTab.scrollEnd = true;
                            nowTab.$con.addClass('con-empty').html(win._tp.empty);
                            return;
                        }
                        // 加载非第一页，没有数据
                        if (nowTab.nextPage !== 1 && _data.length === 0) {
                            nowTab.scrollEnd = true;
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
                                win._tp.manlist
                                .replace('{{id}}', _d.id)
                                .replace('{{photo}}', _d.photo || win.G.defaultHead)
                                .replace('{{name}}', _d.name)
                                .replace('{{dep}}', _d.dep)
                                .replace('{{score}}', _d.score || 0)
                                .replace('{{workInMonth}}', _d.workInMonth || 0)
                                .replace('{{works}}', _month_lenth)
                            );
                        });
                        nowTab.$con.append(_html.join(''));
                        // 下页数加一
                        nowTab.nextPage++;
                    }
                });
            },
            getLabel: function(_l) {
                if (_tab[_l]) {
                    return _l;
                }
                return 'tabone';
            },
            tabToggle: function(_t) {
                _t = Project.getLabel(_t);
                var nowTab = _tab[_t];
                win.location.href = win.location.href.replace(/#\w+$/, '') + '#' + _t;
                // 标签高亮
                nowTab.$label.parent().find('.tag-active').removeClass('tag-active');
                nowTab.$label.addClass('tag-active');
                // 内容展示
                nowTab.$con.parent().find('.list-con-active').removeClass('list-con-active');
                nowTab.$con.addClass('list-con-active');
                // 更新当前渲染标签
                _label = _t;
                // 加载当前标签数据
                !nowTab.alreadyLoaded && Project.loadData();
            },
            scroll: function() {
                var _top_old = $main.data('scrolltop') || 0,
                    _top_new = $main.scrollTop();
                if (_top_new > _top_old) { // 向下滚动
                    var _bottom = Math.abs(this.scrollHeight - _top_new - $main.height());
                    // 滚动到底部 并且 当前tab没有加载结束
                    if (_bottom < 20 && !_tab[_label].scrollEnd) {
                        Project.loadData();
                    }
                }
                $main.data('scrolltop', _top_new);
            },
            labelChoice: function() {
                var $this = $(this),
                    tab = {
                        tab0: 'tabone',
                        tab2: 'tabtwo',
                        tab3: 'tabthree',
                        tab4: 'tabfour'
                    };
                if (!$this.is('.tag-active')) {
                    Project.tabToggle(tab[$this.data('tab')]);
                }
            }
        };
    /**
     * 项目初始化
     */
    Project.init();

    /**
     * event binding
     */
    $listHead
        .on(win.method, '.j-list-tag', Project.labelChoice) // 选择label
    $main
        .on('scroll', Project.scroll); // 检测滚动，加载更多
}(window || this, Zepto);
