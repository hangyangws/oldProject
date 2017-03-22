/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-13.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $question = $('#question'),
        $mask = $('#mask'),
        $footer = $('#footer'),
        headerBgCss = 'url(${url}) no-repeat right bottom/auto 98% #ffb320',
        _share_able = true, // 是否可以点击分享按钮
        Project = {
            init: function() {
                // 背景图异步加载
                var $header = $('#header');
                $header
                    .css('background', headerBgCss.replace('${url}', $header.data('bg')))
                    .removeAttr('data-src');
                // 分享图片异步加载
                var $share = $mask.find('.share-img');
                $share.css('background', 'url(${url}) no-repeat 50% /contain'.replace('${url}', $share.data('bg')));
            },
            questionClick: function() {
                var $this = $(this);
                if ($this.is('.p-ques-active')) {
                    $this.removeClass('p-ques-active p-ques-show');
                } else {
                    $this.addClass('p-ques-show');
                    setTimeout(function() {
                        $this.addClass('p-ques-active');
                    }, 10);
                }
            },
            judgeLogin: function() {
                if (!win.G.isLogin) {
                    layer.open({ content: '请登录' });
                    setTimeout(function() {
                        win.location.href = win.G.loginUrl;
                    }, 1500);
                    return;
                }
                win.location.href = $(this).data('href');
            },
            share: function() {
                if (_share_able) {
                    _share_able = false;
                    $mask.removeClass('none');
                    var _t = setTimeout(function() {
                        $mask.addClass('mask-active');
                        clearTimeout(_t);
                    }, 10);
                }
            },
            closeShare: function() {
                $mask.removeClass('mask-active');
                var _t = setTimeout(function() {
                    $mask.addClass('none');
                    clearTimeout(_t);
                    _share_able = true;
                }, 1050);
            }
        };
    // 项目初始化
    Project.init();
    /**
     * event binding
     */
    $question
        .on(win.method, '.j-plan-question', Project.questionClick); // 问题点击
    $footer
        .on(win.method, '.j-join-btn', Project.judgeLogin) // 登录判断
        .on(win.method, '.j-share-btn', Project.share); // 分享
    $mask
        .on(win.method, Project.closeShare)
}(window || this, Zepto);
