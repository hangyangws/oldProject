;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-02.
 * [公共js方法(组建)]
 */
! function(win, $, undefined) {
    'use strict';
    win.$body = $('body');
    // 加载 弹窗 和 loading Dom 节点
    $body.append([
        // 添加类：confrim-btn-one，变为为单独按钮模式
        '<div class="confrim-mask pf w1 h1 t0 l0 z3 none" id="confrimMask">',
        '<div class="confrim-wrap top-middle bc r4 pr tac">',
        '<i class="confrim-i top-middle bc"></i>',
        '<p class="js-mask-msg fc-impor-one bc">${msg}</p>',
        '<div class="mask-btn">',
        '<button class="js-mask-cancel mask-cancel fc-main bct r4 dlb w90">取消</button>',
        '<button class="js-mask-ok mask-ok bc-main fcf bct r4 dlb w90">确认</button>',
        '</div>',
        '</div>',
        '</div>',
        // 加载动画框
        '<div id="cssLoad" class="css-load pf t0 l0 w1 h1 z3 none">',
        '<div class="load-wrap w40 h40 tac middle">',
        '<div class="sk-dot1"></div>',
        '<div class="sk-dot2"></div>',
        '</div>',
        '</div>'
    ].join(''));

    // 弹窗 和 loading 所需变量
    var $confrimMask = $('#confrimMask'),
        $confrimMsg = $confrimMask.find('.js-mask-msg'),
        // 加载动画变量
        $cssLoad = $('#cssLoad');

    /**
     * 自定义弹窗
     */
    // 加载弹窗
    win.oConfrim = function(_msg, _type, callbackOk, callbackCancel) {
        // _type 为 true 表示单按钮模式
        $confrimMsg.html(_msg);
        if (_type) {
            $confrimMask.addClass('confrim-btn-one');
            if (!callbackOk) {
                $confrimMask.one('tap', '.js-mask-ok', function() {
                    win.cConfrim();
                });
            }
        } else {
            $confrimMask.removeClass('confrim-btn-one');
            $confrimMask.one('tap', '.js-mask-cancel', function() {
                win.cConfrim();
                callbackCancel && callbackCancel();
            });
        }

        $confrimMask.removeClass('none');
        var _time = setTimeout(function() {
            $confrimMask.addClass('active');
            clearTimeout(_time);
        }, 100);

        // 注册回调事件
        callbackOk && $confrimMask.one('tap', '.js-mask-ok', function() {
            callbackOk();
        });
    };
    // 更新确认框提示内容
    win.reConfrim = function(_msg) {
        $confrimMsg.html(_msg);
    };
    // 关闭弹窗
    win.cConfrim = function() {
        $confrimMask.removeClass('active');
        var _time = setTimeout(function() {
            $confrimMask.addClass('none');
            clearTimeout(_time);
        }, 600);
        // 解绑弹窗事件
        $confrimMask.off();
    };
    /**
     * 自定义动画
     */
    // 打开动画
    win.oLoad = function() {
        $cssLoad.removeClass('none');
        var _time = setTimeout(function() {
            $cssLoad.addClass('active');
            clearTimeout(_time);
        }, 100);
    };
    // 关闭动画
    win.cLoad = function() {
        $cssLoad.addClass('none').removeClass('active');
    };
    /**
     * 登录检测
     */
    win.login = function() {
        win.oConfrim('请登陆', false, function() {
            if (G.device == 1) {
                // android
                win.android.login();
            } else {
                // ios
                location.href = 'objc://login';
            }
        });
    };
    // 就餐方式中英对照
    win.dinType = {
        TAKE: '上门取餐',
        COME: '上门就餐',
        DELIVER: '送货上门'
    };
    // 其他公用方法
    win.NUM = {
        getDeimalLength: function(_n) {
            var _len;
            try {
                _len = _n.toString().split('.')[1].length;
            } catch (e) {
                _len = 0;
            }
            return _len;
        },
        getTwoPow: function(n1, n2) {
            var _len1 = this.getDeimalLength(n1),
                _len2 = this.getDeimalLength(n2);
            return Math.pow(10, Math.max(_len1, _len2));
        },
        add: function(n1, n2) {
            var _pow_len = this.getTwoPow(n1, n2);
            return (n1 * _pow_len + n2 * _pow_len) / _pow_len;
        },
        sub: function(n1, n2) {
            var _pow_len = this.getTwoPow(n1, n2);
            return ((n1 * _pow_len - n2 * _pow_len) / _pow_len).toFixed(2);
        }
    };
}(window || this, Zepto);
