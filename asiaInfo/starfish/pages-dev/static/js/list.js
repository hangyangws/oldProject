/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-09-30.
 */
;
! function(win, $, undefined) {
    'use strict';
    var $main = $('#main'),
        $swiper = $('#swiper'),
        ListBgCss = 'url(${url}) center bottom/100% no-repeat',
        Project = {
            init: function() {
                // 轮播器初始化
                var mySwiper = new Swiper($swiper, {
                    // preloadImages: false, // 默认为true，Swiper会强制加载所有图片
                    // updateOnImagesReady: true// 当所有的内嵌图像（img标签）加载完成后Swiper会重新初始化。使用此选项需要先开启preloadImages: true
                    lazyLoading: true, // 设为true开启图片延迟加载，使preloadImages无效
                    autoplay: 5000,
                    // setWrapperSize: true,
                    // roundLengths: true,
                    preventLinksPropagation: false,
                    pagination: '.swiper-pagination',
                    // paginationClickable: true,
                    loop: true,
                    // paginationElement: 'a'
                });
                ($main.find('.swiper-pagination-bullet').length < 2) && $main.find('.swiper-pagination').remove();
                // 背景图异步加载
                $main.find('.j-bg-img').each(function() {
                    var $this = $(this);
                    $this
                        .css('background', ListBgCss.replace('${url}', $this.data('src')))
                        .removeAttr('data-src');
                });
            },
            goHref: function() {
                win.location.href = $(this).data('url');
            },
            judgeLogin: function() {
                if (!win.G.isLogin) {
                    layer.open({ content: '请登录' });
                    setTimeout(function() {
                        win.location.href = win.G.loginUrl;
                    }, 1500);
                    return;
                }
                win.location.href = $(this).data('href');
            }
        };
    // 项目初始化
    Project.init();
    /**
     * event binding
     */
    $main
        .on(win.method, '.j-join-btn', Project.judgeLogin);
    $swiper
        .on('click', '.swiper-slide', Project.goHref);
}(window || this, Zepto);
