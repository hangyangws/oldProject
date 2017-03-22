/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-14.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $doc = $(document),
        $main = $('#main'),
        $replay = $('#replay'),
        $replayIpt = $replay.find('.j-re-ipt'),
        $content = $('#content'),
        $imgMask = $('#imgMask'),
        $closeImg = $imgMask.find('.j-close-img'),
        $imgView = $imgMask.find('.j-img-view'),
        $scroll = $content.find('.j-scroll'),
        _bg_css = 'url({{img}}) no-repeat 50% 50% / contain #000;',
        _next_page = {
            '0': 1,
            '1': 1
        },
        _now_top = {
            '0': 0,
            '1': 0
        },
        _page_size = 5,
        _tp = {},
        $replayCom = null, // 当前评论的帮扶记事Dom
        $replayTrigger = null, // 出发评论的Dom
        _reply_user = {}, // 当前被评论的用户信息
        Project = {
            init: function() {
                // 字符串模板获取
                $('#body').find('.tp').forEach(function($e) {
                    _tp[$e.dataset.name] = $e.innerHTML;
                    $e.remove();
                });
                // 加载第一页tab数据(参数只是代表显示哪一个tab)
                // userList、gov(带有#tab1)才显示右边的tab
                if (/#tab1$/.test(win.location.href) || G.type === 'userList') {
                    Project.tabToggle(1);
                } else {
                    Project.tabToggle(0);
                }
            },
            imgLazyLoad: function() {
                // 图片懒加载
                var $this,
                    _bg = 'url({img}) no-repeat 50% 50% / cover';
                $content.find('.j-lazy-img').forEach(function($e) {
                    $this = $($e);
                    $this.find('span').css('background', _bg.replace('{img}', $this.data('thumbnail')));
                    $this.removeAttr('data-thumbnail').removeClass('j-lazy-img');
                });
            },
            getPageType: function(_method) {
                if (_method === 'back') {
                    return /#\w+$/.test(location.href) ? 'all' : 'my';
                }
                return /#\w+$/.test(location.href) ? 'my' : 'all';
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
            loadData: function(_tab_index) {
                var $nowScroll = $scroll.eq(_tab_index);
                win.F.ajax({
                    url: win.G.list_url[(_tab_index == '1' && win.G.type === 'gov') ? 'my' : 'all']
                        .replace('{{page}}', _next_page[_tab_index])
                        .replace('{{size}}', _page_size),
                    data: win.G.family ? {
                        'family': win.G.family
                    } : undefined,
                    type: 'POST',
                    yes: function(_data) {
                        var _count = _data.data.count; // 数据库总数
                        _data = _data.data.data || []; // 获取的数据列表
                        // 只要加载过一次就把当前dom的first置false
                        $nowScroll.data('first', false);
                        // 如果加载第一页 && 没有数据 -> 移除滚动加载数据事件
                        if (_next_page[_tab_index] === 1 && _data.length === 0) {
                            $nowScroll.off('scroll');
                            return;
                        }
                        // 如果加载非第一页 && 没有数据 -> 移除滚动加载数据事件 && 提示没有数据了
                        if (_next_page[_tab_index] !== 1 && _data.length === 0) {
                            $nowScroll.off('scroll');
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
                                _tp.noteList
                                .replace(/\{\{id\}\}/g, _d.newsId)
                                .replace('{{edit}}', _tab_index ? 'edit' : '')
                                .replace('{{family}}', win.G.family ? ('?family=' + win.G.family) : '')
                                .replace('{{time}}', Project.getTime(_d.createTime))
                                .replace('{{name}}', _d.relationDesc ? _d.relationDesc : '')
                                .replace('{{tit}}', _d.summary)
                                .replace('{{like}}', _d.likes.indexOf(win.G.userName) === -1 ? '' : 'like-live')
                                .replace('{{content}}', _d.content)
                                .replace('{{likeNum}}', _d.likeCount)
                                .replace('{{commentNum}}', _d.commonCount)
                                .replace('{{none}}', _d.attaches.length ? '' : 'none')
                                .replace('{{imgList}}', Project.getImgStr(_d.attaches))
                                .replace('{{commentList}}', Project.getComStr(_d.comments))
                            );
                        });
                        $nowScroll.find('.j-content').append(_html.join(''));
                        // 加载图片(需要优化，滚动加载)
                        Project.imgLazyLoad();
                        // 移除“空数据提示”Dom
                        (_next_page[_tab_index] === 1) && $nowScroll.find('.j-no-data').remove();
                        // 一下页数加一
                        _next_page[_tab_index]++;
                    }
                });
            },
            getImgStr: function(_data) {
                var _html = [];
                _data.forEach(function(_d) {
                    _html.push(
                        _tp.tpImg
                        .replace(/\{\{img\}\}/g, _d.fileid)
                    )
                });
                return _html.join('');
            },
            getComStr: function(_data) {
                var _html = [];
                _data.forEach(function(_d) {
                    _html.push(
                        _tp.tpComment
                        .replace('{{id}}', _d.creator)
                        .replace('{{name}}', _d.userName)
                        .replace('{{toId}}', _d.replyUser || '')
                        .replace('{{toName}}', _d.replyName ? ('@' + _d.replyName + ' ') : '')
                        .replace('{{txt}}', _d.comment)
                    );
                });
                return _html.join('');
            },
            imgView: function() {
                $imgView.css('background', _bg_css.replace('{{img}}', $(this).data('original')));
                $imgMask.removeClass('none');
                var _t = setTimeout(function() {
                    $imgMask.addClass('img-mask-live');
                    clearTimeout(_t);
                }, 50);
            },
            closeImgTrigger: function(ev) {
                ev = ev || win.event;
                var $n = ev.target || ev.srcElement;
                if ($n === $imgMask[0]) { // 直接点击蒙层
                    Project.closeImgView();
                    return;
                }
                while ($n) {
                    if ($n === $closeImg[0]) { // 点击关闭蒙层按钮
                        Project.closeImgView();
                        return;
                    }
                    $n = $n.parentNode;
                }
            },
            closeImgView: function() {
                $imgMask.removeClass('img-mask-live');
                var _t = setTimeout(function() {
                    $imgMask.addClass('none');
                    clearTimeout(_t);
                }, 600);
                return;
            },
            like: function() {
                var $this = $(this);
                F.ajax({
                    type: 'POST',
                    url: win.G.like_url.replace('{{id}}', $this.closest('.j-each-note').data('id')),
                    yes: function(_data) {
                        _data = _data.data;
                        $this.find('span').html('赞（' + _data.likeCount + '）');
                        $this[_data.status ? 'addClass' : 'removeClass']('like-live');
                    }
                });
            },
            scrollLoad: function() {
                var $this = $(this),
                    _tab = $this.data('tab'),
                    _scroll_top = $this.scrollTop();
                if (_scroll_top > _now_top[_tab]) { // 向下滚动
                    // 滚动到底部，加载当前tab下一页数据
                    (Math.abs(this.scrollHeight - _scroll_top - $this.height()) < 10) && Project.loadData(_tab);
                }
                _now_top[_tab] = _scroll_top;
            },
            tabToggle: function(_tab) {
                isNaN(_tab) && (_tab = $(this).data('tab'));
                $main[_tab ? 'addClass' : 'removeClass']('show-my-note');
                win.location.href = win.location.href.replace(/#\w+$/, '') + '#tab' + _tab;
                $scroll.eq(_tab).data('first') && Project.loadData(_tab);
            },
            popComment: function() {
                var $this = $(this),
                    _is_user = $this.is('.j-comment-u'),
                    user_name = _is_user && $this.find('.j-user').html();
                // 显示弹窗
                if ($replay.is('.none')) {
                    $replay.removeClass('none');
                    var _t = setTimeout(function() {
                        $replay.addClass('reply-wrap-live');
                        clearTimeout(_t);
                        _t = setTimeout(function() {
                            $replayIpt.focus();
                            // 全屏点击事件监听，取消评论框
                            $doc.on(win.method, Project.fullEvent);
                            clearTimeout(_t);
                        }, 600);
                    }, 50);
                } else {
                    $replayIpt.focus();
                }
                // 给textare的placeholder添加相应的信息
                if ($replayTrigger !== this) {
                    $replayIpt
                        .attr('placeholder', _is_user ? ('回复给' + user_name + '：') : '回复帮扶记事：')
                        .val('')
                        .trigger('input');
                }
                $replayTrigger = this;
                // 当前被评论的帮扶记事Dom
                $replayCom = $this.closest('.j-each-note');
                // 当前被评论的用户信息
                if (_is_user) {
                    _reply_user = {
                        id: $this.data('id'),
                        name: user_name
                    };
                } else {
                    _reply_user = {};
                }
            },
            closeComment: function() {
                // 隐藏评论框
                $replay.removeClass('reply-wrap-live');
                var _t = setTimeout(function() {
                    clearTimeout(_t);
                    // 置空回复框的值
                    $replay.addClass('none');
                    $replayIpt.val('');
                    // 取消监听全屏事件
                    $doc.off(win.method);
                }, 600);
                // 重置当前被评论状态
                _reply_user = {};
                $replayTrigger = null
            },
            comAreaChange: function() {
                var $this = $(this),
                    $p = $this.parent();
                $p.height(16);
                var _scrroll_h = this.scrollHeight;
                if (_scrroll_h >= 16) {
                    $p.height(_scrroll_h > 48 ? 48 : _scrroll_h);
                }
                $replay.find('.j-re-sure')[$.trim($this.val()) ? 'addClass' : 'removeClass']('jc-re-sure');
            },
            replaySure: function() {
                var _txt = $.trim($replayIpt.val());
                win.F.ajax({
                    url: win.G.re_url
                        .replace('{{id}}', $replayCom.data('id')),
                    type: 'POST',
                    data: {
                        replyUser: _reply_user.id || '',
                        comment: _txt
                    },
                    yes: function(_data) {
                        // 插入评论
                        $replayCom.find('.j-com-wrap').prepend(
                            Project.getComStr([{
                                creator: win.G.creator,
                                userName: win.G.userName,
                                replyUser: _reply_user.id,
                                replyName: _reply_user.name,
                                comment: _txt
                            }])
                        );
                        // 评论数量加一
                        $replayCom.find('.j-comment span').html('评论（' + _data.data.commentCount + '）');
                        // 关闭评论弹窗
                        Project.closeComment();
                    }
                });
            },
            fullEvent: function(ev) {
                ev = ev || win.event;
                var $n = ev.target || ev.srcElement;
                while ($n) {
                    if ($n === $replay[0]) {
                        return;
                    }
                    $n = $n.parentNode;
                }
                Project.closeComment();
            }
        };

    /**
     * 项目初始化
     */
    Project.init();

    /**
     * event binding
     */
    $main
        .on(win.method, '.j-tab-toggle', Project.tabToggle); // tab切换
    $content
        .on(win.method, '.j-note-img', Project.imgView) // 图片放大预览
        .on(win.method, '.j-like', Project.like) // "赞"帮扶记事
        .on(win.method, '.j-comment', Project.popComment) // "评论"帮扶记事
        .on(win.method, '.j-comment-u', Project.popComment); // "回复"评论
    $replay
        .on('input paste', '.j-re-ipt', Project.comAreaChange) // 评论内容动态改变
        .on(win.method, '.jc-re-sure', Project.replaySure); // 提交回复、评论
    $scroll
        .on('scroll', Project.scrollLoad); // 检测滚动，加载更多
    $imgMask
        .on(win.method, Project.closeImgTrigger); // 全局关闭图片放大预览
}(window || this, Zepto);
