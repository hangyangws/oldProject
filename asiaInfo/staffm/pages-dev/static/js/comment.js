/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-02-23.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $main = $('#main'),
        $btn = $('#footer').find('.j-btn'),
        $startBlue = $main.find('.j-start-blue'),
        _data = {
            comment: null,
            commentDesc: ''
        },
        Project = {
            submit: function() {
                if (!/\s+gray\s+/.test(this.className) && _data.comment && _data.commentDesc) {
                    F.ajax({
                        data: _data,
                        type: 'POST',
                        url: win.G.commentUrl,
                        yes: function() {
                            F.jump({
                                msg: '评论成功',
                                url: win.G.goUrl
                            });
                        }
                    });
                }
                if (_data.commentDesc.length < 6) {
                    var $tip = $main.find('.j-tip');
                    $tip.addClass('tip-error');
                    var _t = setTimeout(function() {
                        $tip.removeClass('tip-error');
                        clearTimeout(_t);
                    }, 1500);
                    return;
                }
            },
            checkStart: function(e) {
                var _width = $(this).width(),
                    _offset_left = e.offsetX,
                    _right_percent = (function() {
                        if (_offset_left < _width * 0.2) {
                            _data.comment = 1;
                            return '80%';
                        }
                        if (_offset_left < _width * 0.4) {
                            _data.comment = 2;
                            return '60%';
                        }
                        if (_offset_left < _width * 0.6) {
                            _data.comment = 3;
                            return '40%';
                        }
                        if (_offset_left < _width * 0.8) {
                            _data.comment = 3;
                            return '20%';
                        }
                        _data.comment = 5;
                        return '1%';
                    })();
                $startBlue.css('right', _right_percent);
                Project.checkSubmit();
            },
            checkIpt: function() {
                var _val = this.value.replace(/^\s+|\s+$/g, '');
                if (_val.length > 5) {
                    _data.commentDesc = _val;
                } else {
                    _data.commentDesc = '';
                }
                Project.checkSubmit();
            },
            checkSubmit: function() {
                if (_data.comment && _data.commentDesc) {
                    $btn.removeClass('gray');
                } else {
                    $btn.addClass('gray');
                }
            }
        };

    /**
     * event binding
     */
    $main
        .on('click', '.j-start', Project.checkStart) // 选择星星
        .on('input', '.j-ipt', Project.checkIpt); // 评论内容检测
    $btn
        .on(win.method, Project.submit); // 确定评论
}(window || this, Zepto);
