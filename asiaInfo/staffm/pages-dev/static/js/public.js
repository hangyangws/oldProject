/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-28.
 * public.js
 */

// 往返缓存问题
window.onunload = function() {};

// 移动端tap双点击修复
window.FastClick && FastClick.attach(document.body);

/**
 * 全局变量
 */

// 事件
method = /AppleWebKit.*Mobile.*/.test(navigator.userAgent) ? 'tap' : 'click';

// 字符串模板
_tp = {};

/**
 * 方法(F === Friday)
 */

F = (function(win, $, undefined) {
    'use strict';
    // input最大输入限制，在不支持maxlength的元素或者浏览器上使用“j-maxlength”属性
    var $iptMaxlen = $('input[j-maxlength]');
    if ($iptMaxlen.length) {
        $iptMaxlen.on('keyup paste', function() {
            var $this = $(this),
                _v = $this.val(),
                _max_l = $this.attr('j-maxlength');
            (_v.length > _max_l) && $this.val(_v.slice(0, _max_l));
        });
    }
    // 背景图初始化延迟加载，在元素上添加“j-delay-bg”类、“data-bg”属性
    var _bg_css = 'url({img}) no-repeat 50% 50% / cover;';
    $('.j-delay-bg').forEach(function($e) {
        $e = $($e);
        $e.css({ background: _bg_css.replace('{img}', $e.data('bg')) }).removeAttr('data-bg').removeClass('j-delay-bg');
    });
    // 字符串模板获取
    $('template').forEach(function($e) {
        var _name = $e.dataset.name;
        if (_name) {
            win._tp[_name] = $e.innerHTML;
            $e.remove();
        }
    });

    var _is_ajax = true, // 是否可以发送ajax(不推荐使用并发)
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
        jump: function(_obj) { // 页面跳转方法
            // _obj ==> {
            //     msg: '消息内容',
            //     url: '跳转链接', // 必填项
            //     time '跳转事件' // 默认1.5s
            // }
            _obj.msg && layer.open({ content: _obj.msg });
            var _t = setTimeout(function() {
                clearTimeout(_t);
                win.location.href = _obj.url;
            }, _obj.time || 1500);
        },
        getLongDate: function(_stamp) {
            var _date = new Date(_stamp);
            var arr = [
                _date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours(),
                _date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes(),
                _date.getSeconds() < 10 ? '0' + _date.getSeconds() : _date.getSeconds()
            ].join(':');
            return F.getShortDate(_stamp) + ' ' + arr;
        },
        getShortDate: function(_stamp) {
            return new Date(_stamp).toISOString().split('T')[0].replace(/-/g, '/');
        }
    };
})(window || this, Zepto);
