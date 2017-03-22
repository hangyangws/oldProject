/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-29.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $conWrap = $('#conWrap'),
        Project = {
            deleteMan: function() {
                var $this = $(this).closest('.j-list'),
                    _id = $this.data('id'),
                    _relation = $this.data('relation');
                layer.open({
                    content: '您确定要删除当前家庭成员？',
                    btn: ['确定', '不要'],
                    yes: function(index) {
                        F.ajax({
                            url: win.G.del_url.replace('{{id}}', _id),
                            yes: function() {
                                if (_relation === 1) {
                                    F.jump({
                                        msg: '删除成功',
                                        url: win.G.dir_url
                                    });
                                } else {
                                    $this.remove();
                                }
                            }
                        });
                        layer.close(index);
                    }
                });
            }
        };

    /**
     * event binding
     */
    $conWrap
        .on(win.method, '.j-del-man', Project.deleteMan); // 删除用户
}(window || this, Zepto);
