/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-19.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $doc = $(document),
        $content = $('#content'),
        $header = $('#header'),
        $relation = $content.find('.j-relation'),
        $imgWrap = $content.find('.j-img-wrap'), // 图片父容器
        $addImg = $imgWrap.find('.j-add-img'), // 添加图片触发器
        $nowViewImg = undefined,
        $userList = $content.find('.j-user-list'),
        $searchMan = $('#searchMan'),
        $searchCon = $searchMan.find('.j-search-con'),
        $footer = $('#footer'),
        $replay = $('#replay'),
        $replayIpt = $replay.find('.j-re-ipt'),
        $replayTrigger = null, // 出发评论的Dom
        $replayCom = $content.find('.j-com-wrap'), // 评论列表父节点
        $imgMask = $('#imgMask'),
        $closeImg = $imgMask.find('.j-close-img'),
        $imgView = $imgMask.find('.j-img-view'),
        _bg_css = 'url({{img}}) no-repeat 50% 50% / contain #000;',
        _reply_user = {}, // 当前被评论的用户信息
        _tp = {}, // 模板字符串
        _bg = 'url({img}) no-repeat 50% 50% / cover', // 背景自适应
        _img_num = $content.find('.j-note-img').length, // 图片上传数量
        _page = 1,
        _page_size = 10,
        _now_user = '', // 当前选择用户id
        Project = {
            init: function() {
                // 图片懒加载
                Project.lazyLoad();
                // 时间转换
                var $time = $content.find('.j-time');
                $time.html(Project.getTime($time.data('time')));
                // 字符串模板获取
                $('#body').find('.tp').forEach(function($e) {
                    _tp[$e.dataset.name] = $e.innerHTML;
                    $e.remove();
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
            lazyLoad: function() {
                var $this;
                $content.find('.j-lazy-img').forEach(function($e) {
                    $this = $($e);
                    $this.find('span').css('background', _bg.replace('{img}', $this.data('thumbnail')));
                    $this.removeAttr('data-thumbnail').removeClass('j-lazy-img');
                });
            },
            submit: function() {
                // 校验用户输入数据
                var _reg_data = new F.Verify($content).go();
                if (_reg_data) {
                    F.ajax({
                        data: _reg_data,
                        type: 'POST',
                        url: win.G.sub_url,
                        yes: function(_data) {
                            F.jump({
                                msg: (win.G.type === 'modify' ? '修改' : '新建') + '帮扶记事成功',
                                url: win.G.user_url
                            });
                        }
                    });
                }
            },
            closeSearch: function(e) {
                if (e && e.target !== $searchMan[0]) {
                    return;
                }
                $searchMan.removeClass('se-man-active');
                var _t = setTimeout(function() {
                    clearTimeout(_t);
                    $searchMan.addClass('none');
                    // 重置搜索内容
                    $searchMan.find('.j-search-ipt').val('');
                    $searchCon.html('');
                }, 600);
            },
            selectMan: function() {
                var $this = $(this);
                if ($(this).is('.item-checked')) {
                    $this.removeClass('item-checked');
                } else {
                    $searchMan.find('.item-checked').removeClass('item-checked');
                    $(this).addClass('item-checked');
                }
            },
            popSearch: function() {
                var _t;
                $searchMan.removeClass('none');
                _t = setTimeout(function() {
                    $searchMan.addClass('se-man-active');
                    clearTimeout(_t);
                }, 50);
            },
            searchUser: function() {
                var _data = {
                    keyword: $.trim($(this).parent().find('.j-search-ipt').val()),
                    excludes: _now_user
                };
                // 获取用户数据
                if (!_data.keyword) {
                    layer.open({ content: '请输入搜索关键字' });
                    return;
                }
                // 校验用户输入数据
                F.ajax({
                    data: _data,
                    type: 'POST',
                    url: win.G.search_url.replace('{{page}}', _page).replace('{{size}}', _page_size),
                    yes: function(_data) {
                        _data = _data.data;
                        var _html = [];
                        if (_data.data && _data.data.length) {
                            // 拼接数据
                            _data.data.forEach(function(_list) {
                                _html.push(
                                    _tp
                                    .searchuser
                                    .replace('{{id}}', _list.familyId)
                                    .replace('{{name}}', _list.householder.name)
                                );
                            });
                        }
                        $searchCon.html(_html.join('') || _tp.searchnodata);
                    }
                });
            },
            searchSure: function() {
                var $dom = $searchCon.find('.item-checked');
                if ($dom.length) {
                    _now_user = $dom.data('id');
                    $userList.html(
                        _tp
                        .selecteduser
                        .replace('{{name}}', $dom.find('.j-se-name').html())
                    );
                    $relation.val(_now_user);
                    Project.closeSearch();
                } else {
                    layer.open({ content: '您没有选择贫困户' });
                }
            },
            uploadImg: function() {
                var _file = this,
                    _suf = _file.value.toLowerCase().match(/\.[^\.]+$/);
                // 文件后缀名检测
                if (_suf && win._img_suf.indexOf(_suf[0]) !== -1) {
                    var fr = new FileReader();
                    fr.readAsDataURL(_file.files[0]);
                    fr.onload = function(e) {
                        // 本地图片读取成功
                        var src = e.target.result,
                            _file_data = new FormData(),
                            _layer = layer.open({ type: 2 });
                        _file_data.append('file', _file.files[0]);
                        _file_data.append('tmpRelation', win.G.relationId);
                        _file_data.append('biztype', win.G.biztype);
                        // 向服务端发送ajax数据
                        var req = new XMLHttpRequest();
                        req.open('POST', win.G.file_url, true);
                        req.onload = function(ev) {
                            layer.close(_layer);
                            var _return = JSON.parse((ev.currentTarget || ev.srcElement).response);
                            if (req.status === 200 && _return.code === 0) {
                                // ajax success
                                $addImg.before(
                                    _tp.image
                                    .replace(/{{id}}/g, _return.data)
                                    .replace('{{img}}', src)
                                );
                                // 如果是第九张图片就
                                (++_img_num === 9) && $addImg.addClass('img-hidden');
                            } else {
                                layer.open({ content: _return.msg || '上传失败' });
                            }
                        };
                        req.send(_file_data);
                    };
                } else {
                    layer.open({ content: '请选择正确的图片' });
                }
            },
            delUser: function() {
                $(this).parent().remove();
                $relation.val('');
            },
            delCom: function() {
                var $comment = $(this).closest('.j-each-com');
                layer.open({
                    content: '您确定要删除当前评论？',
                    btn: ['确定', '不要'],
                    yes: function(index) {
                        F.ajax({
                            type: 'POST',
                            url: win.G.com_del_url.replace('{{commentId}}', $comment.data('id')),
                            yes: function(_data) {
                                $comment.remove();
                            }
                        });
                        layer.close(index);
                    }
                });
            },
            delNote: function() {
                layer.open({
                    content: '您确定要删除当前帮扶记事？',
                    btn: ['确定', '不要'],
                    yes: function(index) {
                        F.ajax({
                            type: 'POST',
                            url: win.G.note_del_url,
                            yes: function(_data) {
                                F.jump({
                                    msg: '删除成功',
                                    url: win.G.user_url
                                });
                            }
                        });
                        layer.close(index);
                    }
                });
            },
            textAreaChange: function() {
                var $this = $(this);
                $this.height(54);
                if (this.scrollHeight > 54) {
                    $this.height(this.scrollHeight);
                }
            },
            popComment: function() {
                var $this = $(this.parentNode),
                    _is_user = $this.is('.j-each-com'),
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
                // 当前被评论的用户信息
                if (_is_user) {
                    _reply_user = {
                        id: $this.data('userid'),
                        name: user_name
                    };
                } else {
                    _reply_user = {};
                }
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
            },
            getComStr: function(_data) {
                var _html = [];
                _html.push(
                    _tp.comment
                    .replace('{{comId}}', _data.comId)
                    .replace('{{time}}', _data.time)
                    .replace('{{userId}}', _data.userId)
                    .replace('{{userName}}', _data.userName || '')
                    .replace('{{toId}}', _data.toId)
                    .replace('{{toName}}', _data.toName)
                    .replace('{{txt}}', _data.txt)
                );
                return _html.join('');
            },
            replaySure: function() {
                var _txt = $.trim($replayIpt.val());
                win.F.ajax({
                    url: win.G.re_url,
                    type: 'POST',
                    data: {
                        replyUser: _reply_user.id || '',
                        comment: _txt
                    },
                    yes: function(_data) {
                        _data = _data.data;
                        // 插入评论
                        $replayCom.prepend(
                            Project.getComStr({
                                comId: _data.id,
                                userId: win.G.creator,
                                userName: win.G.userName,
                                time: _data.time,
                                toId: _reply_user.id,
                                toName: _reply_user.name,
                                txt: _txt
                            })
                        );
                        // 关闭评论弹窗
                        Project.closeComment();
                    }
                });
            },
            imgView: function() {
                var $this = $(this);
                $nowViewImg = $this;
                $imgView.css('background', _bg_css.replace('{{img}}', $this.data('original')));
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
            delImg: function() {
                F.ajax({
                    url: win.G.del_img_url.replace('{{id}}', $nowViewImg.data('id')),
                    type: 'POST',
                    yes: function(_data) {
                        // 关闭图片弹窗
                        Project.closeImgView();
                        // 删除当前图片节点
                        $nowViewImg.remove();
                        // 如果小于九张图片则显示“添加图片按钮”
                        --_img_num;
                        $addImg.removeClass('img-hidden');
                    }
                });
            }
        };

    /**
     * 项目初始化
     */
    Project.init();

    /**
     * event binding
     */
    $content
        .on(win.method, '.j-note-img', Project.imgView) // 图片放大预览
        .on(win.method, '.j-del-com', Project.delCom) // 删除评论
        .on(win.method, '.j-coment', Project.popComment); // 展开评论
    $replay
        .on('input paste', '.j-re-ipt', Project.comAreaChange) // 评论内容动态改变
        .on(win.method, '.jc-re-sure', Project.replaySure); // 提交回复、评论
    $imgMask
        .on(win.method, Project.closeImgTrigger); // 全局关闭图片放大预览

    if (win.G.type !== 'view') { // 只有在非view模式下触发
        $header
            .on(win.method, '.j-del-note', Project.delNote); // 删除当前帮扶记事
        $content
            .on('input', '.j-msg', Project.textAreaChange) // 输入内容动态改变
            .on('change', '.j-img-file', Project.uploadImg) // 上传图片
            .on(win.method, '.j-del-user', Project.delUser) // 删除联系人
            .on(win.method, '.j-pop-search', Project.popSearch); // 弹出搜索联系人弹框
        $searchMan
            .on(win.method, '.j-se-btn', Project.searchUser) // 搜索联系人
            .on(win.method, '.j-se-item', Project.selectMan) // 选择联系人
            .on(win.method, '.j-se-sure', Project.searchSure) // 确认选择联系人
            .on(win.method, Project.closeSearch); // 关闭搜索框
        $footer
            .on(win.method, '.j-sub', Project.submit); // 提交数据（更新 || 新建）
        $imgMask
            .on(win.method, '.j-del-img', Project.delImg); // 删除图片
    }
}(window || this, Zepto);
