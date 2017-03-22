/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-09-18.
 */
;
! function(win, $, undefined) {
    'use strict';
    var $headCon = $('#headCon'), // 头部列表Dom
        $headList = $headCon.find('.js-head-list'),
        $detailWrap = $('#detailWrap'), // 详情信息Dom
        $detailList = $detailWrap.find('.js-detail-each'),
        $articleMsg = $detailWrap.find('.js-msg-wrap'), // 留言父级Dom
        method = /AppleWebKit.*Mobile.*/.test(navigator.userAgent) ? 'tap' : 'click', // 确认是点击事件还是触摸事件
        _tp_msg = $('#tpMsg').html(), // 留言模板字符串
        _page = 0, // 即将加载的页数
        _page_num = 10, // 每页显示的条数
        _add_msg_url = 'http://wx.cboxy.com/fortunate/comment/commentListData/${start}/${offset}', // 加载留言数据url
        _sub_msg_url = 'http://wx.cboxy.com/fortunate/comment/saveComment', // 提交留言数据url
        _is_ajax = true, // ajax数据是否可以发送
        _textarea_len = 0, // 文本输入框的
        Project = {
            init: function() {
                // 加载异步图片
                this.asyncImg();
                // 加载第一条留言数据
                this.addMsg();
            },
            headChoice: function() {
                var $this = $(this);
                // 头像选中状态改变
                $headCon.find('.head-active').removeClass('head-active');
                $this.addClass('head-active');
                // 显示对应的详情内容
                $detailWrap.find('.detail-each-active').removeClass('detail-each-active');
                $detailList.eq($this.index()).addClass('detail-each-active');
            },
            addMsg: function() {
                if (_is_ajax) {
                    _is_ajax = false;
                    (_page !== 0) && layer.open({ type: 2 }); // 非第一页留言需要加载动画
                    $.ajax({
                        url: _add_msg_url
                            .replace('${start}', _page * _page_num)
                            .replace('${offset}', _page_num),
                        dataType: 'json',
                        success: function(data) {
                            if (data.iTotalRecords < _page_num) {
                                // 当加载到最后一页隐藏加载按钮
                                $detailWrap.find('.js-load-more').remove();
                            } else {
                                _page++;
                            }
                            // 渲染Dom
                            var _msg_l = data.iTotalRecords,
                                _arr_temp_dom = [],
                                _dom_temp;
                            while (_msg_l--) {
                                _dom_temp = data.aaData[_msg_l];
                                _arr_temp_dom.push(
                                    _tp_msg
                                    .replace('${head}', _dom_temp.avatar)
                                    .replace('${name}', _dom_temp.commentName)
                                    .replace('${time}', _dom_temp.createTime.slice(0, 10).replace(/-/g, '.'))
                                    .replace('${msg}', _dom_temp.commentBody)
                                );
                            }
                            // 如果是第一页则需要加载默认留言
                            (_page === 1 || _page === 0) && Project.loadFirstMsg();
                            $articleMsg.append(_arr_temp_dom.reverse().join(''));
                            Project.ajaxEnd();
                        },
                        error: function() {
                            // 加载第一页留言
                            if (_page === 1 || _page === 0) {
                                Project.ajaxEnd();
                                Project.loadFirstMsg();
                                return;
                            }
                            Project.ajaxEnd('网络堵塞');
                        }
                    });
                }
            },
            loadFirstMsg: function() {
                $articleMsg.html(
                    _tp_msg
                    .replace('${head}', '19.jpg')
                    .replace('${name}', '信心扶贫')
                    .replace('${time}', '2016.09.22')
                    .replace('${msg}', '成都同事请前往成办前台捐献爱心物品。')
                );
            },
            getRandomHead: function() {
                return Math.floor(Math.random() * 18 + 1) + '.jpg';
            },
            subMsg: function() {
                if (_is_ajax) {
                    var $msg = $(this).closest('.js-article-msg'),
                        $name = $msg.find('.js-name'),
                        $msg = $msg.find('.js-msg'),
                        name = $.trim($name.val()),
                        msg = $.trim($msg.val());
                    // 判断是否为空和昵称和留言长度
                    if (!name || !msg) {
                        Project.showMsg('请填写昵称和留言');
                        return;
                    }
                    if (name.length > 10) {
                        Project.showMsg('昵称不能超过10个字符');
                        return;
                    }
                    if (msg.length > 150) {
                        Project.showMsg('留言不能超过150个字符');
                        return;
                    }
                    // 提交留言
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: _sub_msg_url,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            commentName: name,
                            commentBody: msg,
                            avatar: Project.getRandomHead()
                        },
                        success: function(data) {
                            if (data.result) {
                                Project.ajaxEnd('留言成功');
                                $msg.val('');
                                _page = 0;
                                Project.addMsg();
                            } else {
                                Project.ajaxEnd('留言失败');
                            }
                        },
                        error: function() {
                            Project.ajaxEnd('网络堵塞');
                        }
                    });
                }
            },
            ajaxEnd: function(_msg) {
                layer.closeAll(); // 关闭以前的弹窗
                _msg && Project.showMsg(_msg); // 提示信息
                _is_ajax = true;
            },
            showMsg: function(_msg) { // 只是对于提示消息
                layer.open({
                    content: _msg,
                    skin: 'msg',
                    time: 2
                });
            },
            asyncImg: function() {
                var $imgDom = $('#body').find('.js-async-img'),
                    _img_l = $imgDom.length,
                    $temp;
                while (_img_l--) {
                    $temp = $imgDom.eq(_img_l);
                    $temp.attr('src', $temp.data('src'));
                }
                $imgDom.removeAttr('data-src');
            },
            textAreaChange: function() {
                $(this).height(60);
                if (this.scrollHeight > 60) {
                    $(this).height(this.scrollHeight);
                }
            }
        };
    /**
     * 事件绑定
     */
    // 项目初始化
    Project.init();
    // 孩子头像点击
    $headCon.on(method, '.js-head-list', Project.headChoice);

    $detailWrap
        .on(method, '.js-load-more', Project.addMsg) // 加载更多留言
        .on(method, '.js-sub-msg', Project.subMsg) // 提交留言
        .on('input', '.js-msg', Project.textAreaChange); // 留言框文字改变
}(window || this, Zepto);
