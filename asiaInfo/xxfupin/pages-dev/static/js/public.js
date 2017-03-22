/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-28.
 * public.js
 */

// 元素matches兼容(类似jQuery的is)
// ;
// ! function(ePrototype) {
//     ePrototype.matches =
//         ePrototype.matches ||
//         ePrototype.matchesSelector ||
//         ePrototype.webkitMatchesSelector ||
//         ePrototype.msMatchesSelector ||
//         function(s) {
//             var node = this,
//                 nodes = (node.parentNode || doc).querySelectorAll(s),
//                 i = -1;
//             while (nodes[++i] && nodes[i] != node);
//             return !!nodes[i];
//         }
// }(Element.prototype);

// ! function(win) {
//     'use strict';
//     // DOM operation
//     var doc = document,
//         friday = {
//             // DOM获取
//             DOM: function(s, dom) {
//                 dom = dom || doc;
//                 return /^#\w+$/.test(s) ? dom.querySelector(s) : dom.querySelectorAll(s);
//             },
//             closest: function(e, s) {
//                 while (e) {
//                     if (e.matches(s)) {
//                         return e;
//                     } else {
//                         e = e.parentElement;
//                     }
//                 }
//                 return null;
//             }
//         };
//     win.F = friday;
// }(window || this);

// 往返缓存问题
window.onunload = function() {};

// 移动端tap双点击修复
window.FastClick && FastClick.attach(document.body);

/**
 * 全局变量
 */

// 事件
method = /AppleWebKit.*Mobile.*/.test(navigator.userAgent) ? 'tap' : 'click';

// 正则
_reg = {
    tel: /^1[34578]\d{9}$/, // 手机号
    phone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, // 电话
    code: /^\d{6}$/, // 验证码
    pass: /^\d{6}$/, // 密码
    bank: /^\d{16}|\d{19}$/, // 银行
    idcard: /(^\d{15}$)|(^\d{17}([0-9]|(X|x))$)/, // 身份证
    email: /^[A-Za-z\d]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/, // 邮箱
    name: /^[\u4e00-\u9fa5·]{2,20}$/ // 姓名
};

// 图片后缀
_img_suf = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

/**
 * 方法(F === Friday)
 */

F = (function(win, $, undefined) {
    'use strict';
    // input最大输入限制
    var $iptMaxlen = $('input[j-maxlength]');
    if ($iptMaxlen.length) {
        $iptMaxlen.on('keyup paste', function() {
            var $this = $(this),
                _v = $this.val(),
                _max_l = $this.attr('j-maxlength');
            (_v.length > _max_l) && $this.val(_v.slice(0, _max_l));
        });
    }
    // 背景图初始化延迟加载
    var _bg_css = 'url({img}) no-repeat 50% 50% / cover;';
    $('.j-delay-bg').forEach(function($e) {
        $e = $($e);
        $e.css({ background: _bg_css.replace('{img}', $e.data('bg')) }).removeAttr('data-bg').removeClass('j-delay-bg');
    });
    // 输入内容按照数字分开
    // $('input[j-slice]').on('keyup paste', function() {
    //     var $this = $(this);
    //     if (_v.length > 7) {
    //         _v = Project.insertFlg(Project.insertFlg(_v, ' ', 7), ' ', 3);
    //     } else if (_v.length > 3) {
    //         _v = Project.insertFlg(_v, ' ', 3);
    //     }
    //     $this.val(_v);
    // });
    var _is_ajax = true, // 是否可以发送ajax(ajax最好不使用并发)
        _layer, // layer弹窗id
        dataEnd = function(_obj) { // ajax发送结束回调函数
            /*_obj ==>
            {
                layer: true, // 默认false
                s: 'xxx',
                sync: true // 默认false
            }*/
            !_obj.layer && layer.close(_layer);
            _obj.s && layer.open({ content: _obj.s });
            !_obj.sync && (_is_ajax = true);
        },
        ajax = function(_obj) {
            if (!_obj._no_animate) {
                _layer = layer.open({ type: 2 });
            }
            $.ajax({
                url: _obj.url,
                type: _obj.type || 'GET',
                dataType: 'json', // 统一使用json
                data: _obj.data || {},
                success: function(_data) {
                    if (_data.code === 0) {
                        dataEnd({
                            layer: _obj._long_load,
                            sync: _obj._sync
                        });
                        _obj.yes && _obj.yes(_data);
                    } else {
                        dataEnd({
                            s: _data.msg || '未知错误',
                            sync: _obj._sync
                        });
                        _obj.no && _obj.no();
                    }
                },
                error: function() {
                    dataEnd({
                        s: '网络开小差了，请稍候再试。',
                        sync: _obj._sync
                    });
                    _obj.no && _obj.no();
                }
            });
        };
    return {
        ajax: function(_obj) {
            /*_obj ==>
            {
                data: {}
                url: 'xxx',
                type: 'POST', // 默认GET,
                yes: function(_data) {//xxx}, // success,
                no: function() {//xxx}, // error,
                _sync: true, // 是否支持同步ajax，默认false
                _long_load: true, // 加载成功不关闭动画，默认false（关闭）
                _no_animate: true // 加载不需要动画，默认false
            }*/
            if (_obj._sync) {
                ajax(_obj);
            } else if (_is_ajax) {
                _is_ajax = false;
                ajax(_obj);
            }
        },
        jump: function(_obj) {
            // _obj ==> {
            //     msg: '消息内容',
            //     url: '跳转链接', // 必填项
            //     time '跳转事件'
            // }
            _obj.msg && layer.open({ content: _obj.msg });
            var _t = setTimeout(function() {
                clearTimeout(_t);
                win.location.href = _obj.url;
            }, _obj.time || 1500);
        }
    };
})(window || this, Zepto);
