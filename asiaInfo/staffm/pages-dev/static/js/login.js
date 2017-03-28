/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-02-23.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $login = $('#login'),
        Verify = new F.Verify($login),
        Project = {
            login: function() {
                var _data = Verify.go();
                if (_data) {
                    F.ajax({
                        data: _data,
                        type: 'POST',
                        url: win.G.loginUrl,
                        yes: function() {
                            F.jump({
                                msg: '登录成功',
                                url: win.G.goUrl
                            });
                        }
                    });
                }
            }
        };

    /**
     * event binding
     */
    $login
        .on(win.method, '.j-login', Project.login); // 登录
}(window || this, Zepto);
