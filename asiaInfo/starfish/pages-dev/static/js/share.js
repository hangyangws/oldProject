/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-28.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $main = $('#main'),
        Project = {
            init: function() {
                // 图片异步加载、动画处理
                win.$dom = $('#logoWrap');
                Project.imgLoadCallb(win.$dom.data('bg'), function() {
                    win.$dom.addClass('logo-bg-load').removeAttr('data-bg');
                    win.$dom = win.$dom.find('.j-logo');
                    Project.imgLoadCallb(win.$dom.data('bg'), function() {
                        win.$dom.addClass('logo-load').removeAttr('data-bg');
                        delete win.$dom;
                    });
                });
                // 微信sdk配置
                // http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.951-JS-SDK.E4.BD.BF.E7.94.A8.E6.9D.83.E9.99.90.E7.AD.BE.E5.90.8D.E7.AE.97.E6.B3.95
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: win.G.appId, // 必填，公众号的唯一标识
                    timestamp: win.G.timestamp, // 必填，生成签名的时间戳
                    nonceStr: win.G.nonceStr, // 必填，生成签名的随机串
                    signature: win.G.signature, // 必填，签名，见附录1
                    jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                    ]
                });
                wx.ready(function() {
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                });
                wx.error(function(res) {
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
            },
            shareFris: function() {
                wx.onMenuShareTimeline({
                    title: '分享海星互助', // 分享标题
                    link: win.G.shareUrl, // 分享链接
                    imgUrl: win.G.baseImgUrl + '/icon/logo.png', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                        alert('// 用户确认分享后执行的回调函数 朋友圈');
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                        alert('// 用户取消分享后执行的回调函数 朋友圈');
                    }
                });
            },
            shareFri: function() {
                wx.onMenuShareAppMessage({
                    title: '分享海星互助', // 分享标题
                    desc: '海星互助：你好，加入我们吧！', // 分享描述
                    link: win.G.shareUrl, // 分享链接
                    imgUrl: win.G.baseImgUrl + '/icon/logo.png', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                        alert('// 用户确认分享后执行的回调函数 朋友');
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                        alert('// 用户取消分享后执行的回调函数 朋友');
                    }
                });
            },
            imgLoadCallb: function(_img_url, _callb) {
                var Img = new Image();
                Img.src = _img_url;
                var _time = setInterval(function() {
                    Img.complete && (
                        _callb(),
                        clearInterval(_time)
                    );
                }, 10);
            }
        };
    // 项目初始化
    Project.init();
    /**
     * event binding
     */
    $main
        .on(win.method, '.j-share-fris', Project.shareFris) // 分享朋友圈
        .on(win.method, '.j-share-fri', Project.shareFri) // 分享好友
}(window || this, Zepto);
