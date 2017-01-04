/**
 * [首页控制器]
 * @return {[Pj - project object]}    [Feng Jie production]
 */

;! function($) {
    "use strict";
    var Pj = (function() {
        /**
         * [首页轮播]
         */
        var _roll = $('#hyRoll'),
            _roll_li = _roll.find('.hy-roll-wrap').find('li'),
            _roll_item = _roll.find('.hy-roll-nav').find('a'),
            _roll_len = _roll_item.length,
            _roll_now = 0,
            _roll_time,
            _roll_only = (function() { // 检测滚动条数目
                _roll_len < 2 && (
                    _roll.addClass('hy-roll-one')
                );
            })();
        return {
            ini: function() {
                // 首页轮播开始滚动
                Pj.autoRoll();
            },
            /**
             * 文字上涨特效
             */
            textRoll: function() {
            },
            /**
             * [首页轮播]
             */
            autoRoll: function() {
                _roll_time = setInterval(function() {
                    Pj.newtRoll();
                }, 8000);
            },
            newtRoll: function() {
                _roll_now = ++_roll_now >= _roll_len ? 0 : _roll_now;
                Pj.goRoll(_roll_item.eq(_roll_now));
            },
            goRoll: function($this) {
                _roll_now = $this.data('i');
                _roll_li.eq(_roll_now)
                    .siblings()
                    .add($this.siblings())
                    .removeClass('active')
                    .end().end()
                    .add($this)
                    .addClass('active');
            },
            stopRoll: function() {
                clearInterval(_roll_time);
            },
            prevRoll: function() {
                _roll_now = --_roll_now < 0 ? _roll_len - 1 : _roll_now;
                Pj.goRoll(_roll_item.eq(_roll_now));
            },
            /**
             * 导航轮播
             */
            rollNav: function($this) {
                var _i = $this.data('i');
                var $move_d = $this.closest('.each-item').find('.roll-nav-wrap');
                var l = ~~_i * -1000 + 'px';
                $move_d.css({
                    '-webkit-transform': 'translateX(' + l + ')',
                    '-moz-transform': 'translateX(' + l + ')',
                    '-ms-transform': 'translateX(' + l + ')',
                    '-o-transform': 'translateX(' + l + ')',
                    'transform': 'translateX(' + l + ')'
                });
                $this.siblings().removeClass('active').end().addClass('active');
            }
        };
    })();

    /**
     * [页面初始化]
     */
    Pj.ini();

    /**
     * [首页轮播]
     */
    $('#hyRoll').on({
        mouseenter: function() {
            Pj.stopRoll();
        },
        mouseleave: function() {
            Pj.autoRoll();
        }
    });

    // 鼠标交互轮播图
    $('#hyRoll').on('mouseenter', '.hy-roll-nav a', function() {
        Pj.goRoll($(this));
    });

    $('#hyRoll').on('click', '.roll-nav-prev', function() {
        Pj.prevRoll();
    });

    $('#hyRoll').on('click', '.roll-nav-next', function() {
        Pj.newtRoll();
    });

    /**
     * 导航轮播
     */
    $('#main').on('click', '.roll-nav a', function() {
        Pj.rollNav($(this));
    });
}(jQuery);