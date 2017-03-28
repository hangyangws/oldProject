/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-02-24.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $app = $('#app'),
        $main = $('#main'),
        $mask = $('#mask'),
        _page_size = 10,
        _tab = {
            tabone: {
                nextPage: 1,
                data: 'mType=100',
                $label: $app.find('.j-tabone-label'),
                $con: $app.find('.j-tabone-con')
            },
            tabtwo: {
                nextPage: 1,
                data: 'mType=0',
                $label: $app.find('.j-tabtwo-label'),
                $con: $app.find('.j-tabtwo-con')
            },
            tabthree: {
                nextPage: 1,
                data: 'mType=10',
                $label: $app.find('.j-tabthree-label'),
                $con: $app.find('.j-tabthree-con')
            }
        },
        _label,
        getWork = {
            '0': '现场支持',
            '1': '远程支持'
        },
        Project = {
            init: function() {
                // 加载第一页动态数据
                Project.tabToggle(Project.getLabel(location.hash.slice(1)));
            },
            loadData: function() {
                var nowTab = _tab[_label];
                win.F.ajax({
                    url: win.G.listUrl
                        .replace('{{page}}', nowTab.nextPage)
                        .replace('{{size}}', _page_size),
                    data: nowTab.data,
                    type: 'POST',
                    yes: function(_data) {
                        _data = _data.data.data || []; // 获取的数据列表
                        // 是否加载过（从其他tab切换过来不用出发加载数据）
                        nowTab.alreadyLoaded = true;
                        // 加载第一页，没有数据
                        if (nowTab.nextPage === 1 && _data.length === 0) {
                            nowTab.scrollEnd = true;
                            nowTab.$con.html(win._tp.empty);
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
                                win._tp.asklist
                                .replace(/{{supportid}}/g, _d.supportid)
                                .replace('{{createTime}}', F.getLongDate(_d.createTime))
                                .replace('{{supporterName}}', _d.supporterName)
                                .replace('{{workWay}}', getWork[_d.workWay])
                                .replace('{{starttime}}', F.getShortDate(_d.starttime))
                                .replace('{{endtime}}', F.getShortDate(_d.endtime))
                                .replace('{{rejectReason}}', _d.rejectReason)
                                .replace('{{btnType}}', _label)
                                .replace('{{gray}}', _d.commentDesc ? 'gray' : '')
                            );
                        });
                        nowTab.$con.append(_html.join(''));
                        // 下页数加一
                        nowTab.nextPage++;
                    }
                });
            },
            closeReject: function() {
                $mask.addClass('none');
            },
            showReject: function() {
                $mask.find('.j-reject-txt').html($(this).data('txt'));
                $mask.removeClass('none');
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
                var $this = $(this);
                if (!$this.is('.tag-active')) {
                    Project.tabToggle($this.data('tab'));
                }
            },
            goComment: function() {
                if (!/gray/.test(this.className)) {
                    location.href = this.dataset.href;
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
    $app
        .on(win.method, '.j-list-tag', Project.labelChoice) // 选择label
        .on(win.method, '.j-reject-view', Project.showReject); // 展示弹窗
    $main
        .on(win.method, '.j-go-comment', Project.goComment) // 评论
        .on('scroll', Project.scroll); // 检测滚动，加载更多
    $mask
        .on(win.method, '.j-close-mask', Project.closeReject); // 关闭弹窗
}(window || this, Zepto);
