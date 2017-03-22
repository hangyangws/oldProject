/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-01-05.
 * 此文件在多个html中应用，修改时注意
 */

;
! function(win, $, undefined) {
    'use strict';
    var $footer = $('#footer'),
        $listWrap = $('#listWrap'),
        _verify = new F.Verify($listWrap),
        Project = {
            subTest: function() {
                var _data = _verify.go();
                // 如果是用户，在提交时候，提示信息
                if (win.G.type === 'user') {
                    layer.open({
                        content: '<b>温馨提示</b><br /><span class="fs12">修改资料将需要重新审核，确认修改吗？</span>',
                        btn: ['确定', '取消'],
                        yes: function(index) {
                            layer.close(index);
                            Project.submit(_data);
                        }
                    });
                } else {
                    Project.submit(_data);
                }
            },
            submit: function(_data) {
                if (_data) {
                    F.ajax({
                        data: _data,
                        type: 'POST',
                        url: win.G.sub_url,
                        yes: function() {
                            F.jump({
                                msg: '提交成功',
                                url: win.G.user_url
                            });
                        }
                    });
                }
            },
            textRange: function() {
                var _l = this.value.length;
                if (this.setSelectionRange) {
                    this.focus();
                    this.setSelectionRange(_l, _l);
                } else if (this.createTextRange) {
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', _l);
                    range.moveStart('character', _l);
                    range.select();
                }
            }
        };

    /**
     * event binding
     */
    $footer
        .on(win.method, '.j-sub-btn', Project.subTest); // 提交数据
    $listWrap
        .on('focus', 'input', Project.textRange); // 文本框聚焦
}(window || this, Zepto);
