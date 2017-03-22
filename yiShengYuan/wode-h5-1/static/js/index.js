/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-27.
 */
;
! function(win, $, undefined) {
    'use strict';
    var $main = $('.main'),
        $wode = $('#wode'),
        $mask = $('#mask'),
        $body = $('#body'),
        $cai = $('#cai'),
        $hua = $('#hua'),
        _url_obj = {}, // http GET 参数
        _ua = win.navigator.userAgent.toLowerCase(),
        isWeixinQQ = (function() { // true 表示在微信或者QQ打开[不能下载]
            var noArr = [
                    /micromessenger/, // 微信内置浏览器
                    /mqqbrowser/, // 安卓内置QQ
                    /.+iphone.+mobile.+qq.+/ // ios内置QQ
                ],
                _l = noArr.length;
            while (_l--) {
                if (noArr[_l].test(_ua)) {
                    return true;
                }
            }
            return false;
        })(),
        isWeixin = /micromessenger/.test(_ua),
        _weixin_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7612f63079f53ff4&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect',
        isIos = /iphone/.test(_ua),
        method = /AppleWebKit.*Mobile.*/.test(navigator.userAgent) ? 'tap' : 'click', // 确认是点击事件还是触摸事件
        dom = {
            wode: {
                topImg: $wode.find('.wode-top-img'),
                downImg: $wode.find('.line-bottom'),
                btnTwo: $wode.find('.index-btn'),
                txt: $wode.find('.wode-txt'),
                btn: $wode.find('.btn-wrap')
            },
            cai: $cai,
            hua: $hua,
            caiAnimate: {
                tit: $cai.find('.cai-tit'),
                txt: $cai.find('.cai-txt'),
                btn: $cai.find('.cai-buttom')
            },
            huaAnimate: {
                tit: $hua.find('.hua-tit'),
                txt: $hua.find('.hua-txt'),
                btn: $hua.find('.hua-buttom')
            }
        },
        Wode = {
            init: function() {
                // 解析浏览器GET参数[解析成功后回调]
                Wode.getParse(function() {
                    // 花的src加上后缀（二维码宣传的时候可能会在url后面加上’?merchantID=***‘]）
                    Wode.urlChange();

                    if (_url_obj.device) { // 在移动端webView打开页面[隐藏下载按钮]
                        $body.addClass('js-no-download');
                    } else { // 在浏览器打开
                        if (isWeixinQQ) { // 在QQ or 微信内置浏览器打开[不能下载，点击按钮提示]
                            $main.find('.js-download').addClass('js-notice').removeAttr('href');
                            $main.on(method, '.js-notice', function() { Wode.maskShow(); });
                        } else if (isIos) { // 在Ios浏览器中打开
                            // 把下载地址改成 appStoreUrl , 取消download属性
                            $main.find('.js-download').attr('href', G.appStoreUrl).removeAttr('download');
                        } else { // 在除了Ios其他系统浏览器打开
                            // 把下载地址改成 apkUrl
                            $main.find('.js-download').attr('href', G.apkUrl);
                        }
                    }
                });

                // 动画
                Wode.animate.wode();
            },
            animate: {
                wode: function() {
                    dom.wode.topImg.addClass('fadeInDown');
                    dom.wode.downImg.addClass('fadeInUp');
                    setTimeout(function() {
                        dom.wode.btn.addClass('rotateInUpLeft');
                        setTimeout(function() {
                            dom.wode.txt.addClass('rotateInUpLeft');
                            setTimeout(function() {
                                dom.wode.btnTwo.addClass('pulse');
                            }, 400);
                        }, 600);
                    }, 800);
                },
                cai: function() {
                    dom.caiAnimate.txt.addClass('fadeInDown');
                    setTimeout(function() {
                        dom.caiAnimate.tit.addClass('lightSpeedIn');
                        setTimeout(function() {
                            dom.caiAnimate.btn.addClass('fadeInRight');
                        }, 800);
                    }, 800);
                },
                hua: function() {
                    dom.huaAnimate.txt.addClass('fadeInDown');
                    setTimeout(function() {
                        dom.huaAnimate.tit.addClass('lightSpeedIn');
                        setTimeout(function() {
                            dom.huaAnimate.btn.addClass('fadeInRight');
                        }, 800);
                    }, 800);
                }
            },
            getParse: function(_callb) {
                var _href = location.href,
                    _i = _href.indexOf('?') + 1;
                if (_i > 0) {
                    var paraArr = _href.slice(_i).split('&'),
                        _l = paraArr.length,
                        _temp;
                    while (_l--) {
                        _temp = paraArr[_l].split('=');
                        _url_obj[_temp[0]] = _temp[1];
                    }
                }
                // 执行回调函数
                _callb && _callb();
            },
            urlChange: function() {
                // 如果是微信
                var $url = $body.find('.js-url-change'),
                    _l = $url.length,
                    $i;
                if (isWeixin) {
                    while (_l--) {
                        $i = $url.eq(_l);
                        $i.attr('href', _weixin_url.replace('${url}', $i.data('href') + (_url_obj.merchantID ? '?merchantID=' + _url_obj.merchantID : '')));
                    }
                } else {
                    // if (_url_obj.merchantID) {
                    while (_l--) {
                        $i = $url.eq(_l);
                        $i.attr('href', $i.data('href') + (_url_obj.merchantID ? ('?merchantID=' + _url_obj.merchantID) : ''))
                    }
                    // }
                }
            },
            intoSecon: function(_type) {
                $wode.removeClass('fadeInLeft').addClass('fadeOutLeft');
                dom[_type].removeClass('fadeOutRight active').addClass('fadeInRight active');
                Wode.animate[_type]();
            },
            goHome: function(_type) {
                dom[_type].removeClass('fadeInRight').addClass('fadeOutRight');
                $wode.removeClass('fadeOutLeft').addClass('fadeInLeft');
            },
            maskClose: function() {
                $mask.removeClass('active');
                var _t = setTimeout(function() {
                    $mask.addClass('none');
                    clearTimeout(_t);
                }, 600);
            },
            maskShow: function() {
                $mask.removeClass('none');
                var _t = setTimeout(function() {
                    $mask.addClass('active');
                    clearTimeout(_t);
                }, 100);
            }
        };
    // 项目初始化
    Wode.init();
    /**
     * 事件绑定
     */
    // 进入我的菜
    $wode.on(method, '.cai-btn-wrap', function() {
        Wode.intoSecon('cai');
    });

    // 进入我的花
    $wode.on(method, '.hua-btn-wrap', function() {
        Wode.intoSecon('hua');
    });

    // 返回首页
    $main.on(method, '.back-index', function() {
        Wode.goHome($(this).data('type'));
    });

    $main.on('swipeRight', '.js-swipe', function() {
        Wode.goHome($(this).data('type'));
    });
    // 关闭弹窗
    $mask.on(method, '.mask-close', function() {
        Wode.maskClose();
    });
}(window || this, Zepto);
