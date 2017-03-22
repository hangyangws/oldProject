/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-09-30.
 */
;
! function(win, $, undefined) {
    var $share = $('#share'),
        Project = {
            share: function() {
                var data = $(this).data('type');
                alert(wx)
                if (data === 'fri') {
                    wx.onMenuShareAppMessage({
                        title: '我是分享到朋友的标题', // 分享标题
                        desc: '你好，加入我们把', // 分享描述
                        link: 'http://hangyangws.win/css-shadow/', // 分享链接
                        imgUrl: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2030830537,4232619171&amp;fm=58', // 分享图标
                        // type: 'link', // 分享类型,music、video或link，不填默认为link
                        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {
                            // 用户确认分享后执行的回调函数
                            alert('// 用户确认分享后执行的回调函数 朋友');
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                            alert('// 用户取消分享后执行的回调函数 朋友');
                        }
                    });
                } else {
                    wx.onMenuShareTimeline({
                        title: '我是分享到朋友圈的标题', // 分享标题
                        link: 'http://hangyangws.win/', // 分享链接
                        imgUrl: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2030830537,4232619171&amp;fm=58', // 分享图标
                        success: function() {
                            // 用户确认分享后执行的回调函数
                            alert('// 用户确认分享后执行的回调函数 朋友圈');
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                            alert('// 用户取消分享后执行的回调函数 朋友圈');
                        }
                    });
                }
            }
        };
    /**
     * event binding
     */
    $share.on(win.method, '.j-share', Project.share);
}(window || this, Zepto);
