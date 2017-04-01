/**
 * Created by hangyangws(github.com/hangyangws) in 2017-03-23.
 */

;
! function(g, $, undefined) {
    'use strict';
    var $mainContent = $('#mainContent'),
        $slider = $mainContent.find('.j-slider'), // 滑动元素
        $sliderCon = $slider.find('.j-slider-con'), // 所有主区域NodeList
        $nowSliderCon = $sliderCon.eq(0), // 目前展示的主区域元素
        $footer = $('#footer'),
        _method = 'click',
        _main_height = $mainContent.height(), // 大类型占用高度
        Project = {
            init: function() {
                // 模拟点击第一个大分类的第一个小分类
            },
            toggleInner: function() {

            },
            toggleOuter: function() {
                var $this = $(this),
                    $p = $this.closest('.j-tab'),
                    _outer_index = $p.index();

                $nowSliderCon = $sliderCon.eq(_outer_index);

                Project.slideTo($nowSliderCon.position().top);

                if ($this.is('.j-toggle-outer-s')) {
                    $p.find('.j-toggle-outer').data('index', $this.data('index'));
                }
                // 模拟触发侧边栏的分类
                var _inner_index = $this.data('index') || 0;
                
            },
            slideTo: function(_top) { // 滚动到指定的大分区
                $slider.css(Project.getTranslateYObj(_top || 0));
            },
            getTranslateYObj: function(_y) {
                _y = 'translate3d(0, ' + -_y + 'px, 0)';
                return {
                    '-webkit-transform': _y,
                    '-ms-transform': _y,
                    '-o-transform': _y,
                    'transform': _y
                };
            }
        };

    /**
     * 项目初始化
     */
    Project.init();

    /**
     * 事件绑定
     */
    $mainContent
        .on(_method, '.j-toggle-inner', Project.toggleInner); // 侧边栏类型切换
    $footer
        .on(_method, '.j-toggle-outer', Project.toggleOuter) // 大类型切换
        .on(_method, '.j-toggle-outer-s', Project.toggleOuter); // 大类型中的小类切换
}(window || this, jQuery);
