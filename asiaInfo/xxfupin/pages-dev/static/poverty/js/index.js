/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-19.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $swiper = $('#swiper'),
        Project = {
            init: function() {
                // 轮播器初始化
                var mySwiper = new Swiper($swiper, {
                    // lazyLoading: true, // 设为true开启图片延迟加载，使preloadImages无效
                    autoplay: 5000,
                    preventLinksPropagation: false,
                    pagination: '.swiper-pagination',
                    loop: true
                });
                // 图片自适应、懒加载
                var _bg = 'url({img}) no-repeat 50% 50%/cover';
                $swiper.find('.j-s-slide').forEach(function($e) {
                    $e = $($e);
                    $e.css('background', _bg.replace('{img}', $e.data('src'))).removeAttr('data-src').html('');
                });
            }
        };

    // 项目初始化
    Project.init();
}(window || this, Zepto);

// 第一次项目中是用vue，如有有人维护此项目，望体谅混杂了Zepto^_^
// 模拟新闻动态数据
var _demo_news = [{
    id: 1,
    title: '成都最近的雾霾有点严重哦',
    time: '2016.12.12',
    from: '阜南新闻网络',
    content: '由于各大工厂没有按照法律规定节能减排，或者说是法律不严谨，让这些工厂有机可乘。在此呼吁各大工厂，你们再不严格遵守法律的规定排行，我可要启动变身模式了，到时候不要怪我没有给你们机会！雾霾太大了，但是口罩有太贵了，希望广大市民注意啊！举报周围违规工厂！',
    figure: [
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3963529768,2277033765&fm=23&gp=0.jpg',
        '/xxfupin/pages-dev/static/poverty/img/temp/indexbg1.jpg',
        '/xxfupin/pages-dev/static/poverty/img/temp/indexbg2.jpg',
        '/xxfupin/pages-dev/static/poverty/img/temp/indexbg3.jpg'
    ],
    comment: {
        num: 12,
        active: false
    },
    like: {
        num: 12,
        active: true
    },
    forward: {
        num: 32,
        active: true
    }
}, {
    id: 12,
    title: '还有几天就要放假了',
    time: '2016.1.1',
    from: '亚信HR部门',
    content: '各位同事，注意啦，注意啦，要放假了，要发工资了！',
    figure: [
        'http://www.tianqi.com/upload/article/14-11-18/LbzF_141118031013_1.png',
        'http://card.gz.gov.cn/gzshbzk/tzgg/201606/fdb209346bbe41be82acc6b7263525c8/images/febfd90196a74fa59ff8c48e486b77cb.jpg'
    ],
    comment: {
        num: 1,
        active: true
    },
    like: {
        num: 23,
        active: false
    },
    forward: {
        num: 3,
        active: true
    }
}, {
    id: 13,
    title: '滥竽充数的新闻',
    time: '2016.1.11',
    from: '冯小杰',
    content: '随便发布的内容',
    comment: {
        num: 0
    },
    like: {
        num: 0
    },
    forward: {
        num: 0
    }
}];

(function() {
    var vm = new Vue({
        el: '#newsInfo',
        data: {
            news: _demo_news
        }
    });
})()
