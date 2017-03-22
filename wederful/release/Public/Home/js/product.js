/**
 * [made by fj 2015-09-28]
 * @return {[P]} [project]
 */
;
! function() {
    "use strict";
    var P = (function() {
        var nav = null,
            last = $('#direction').parent(),
            sect = $('#main').find('.sect'),
            length = sect.length,
            remove_bor = function() {
                nav.removeClass('border_999');
                last.removeClass('up');
            },
            add_bor = function() {
                nav.addClass('border_999');
                last.addClass('up');
            },
            ini = ! function() {
                // 去除原来的页脚
                $('.footer-native').remove();
                $('#main').fullpage({
                    anchors: ['1', '2', '3', '4', '5'],
                    afterRender: function() {
                        // (#fp-nav 是 fullpage 自动生成的id)
                        nav = $('#fp-nav');
                    },
                    afterLoad: function(link, index) {
                        // 滚动到某个页面之后
                        $(sect.eq(index - 1)).find('.animate').addClass('fadeIn');
                        index === length ? add_bor() : remove_bor();
                    },
                    onLeave: function(index, direction) {
                        // 离开某个页面之后
                        $(sect.eq(index - 1)).find('.animate').removeClass('fadeIn');
                    }
                });
            }();
        return {
            go: function($this) {
                last.is('.up') ? $.fn.fullpage.moveSectionUp() : $.fn.fullpage.moveSectionDown()
            }
        }
    })();

    // 滚屏事件
    $('#direction').on('click', function() {
        P.go();
    });

    // 页脚微信点击
    $('#weixin').on('click', function() {

        $(this).find('.wdf-wx').toggleClass('active');
    });

    // 全局点击取消微信
    $(document).on('click', function(e) {
        var e = $.getE(e),
            elem = e.srcElement || e.target,
            weixin = true;
        while (elem) {
            if ($(elem).attr('id') === 'weixin') {
                weixin = false;
                break;
            };
            elem = elem.parentNode
        };
        if (weixin) {
            $('#weixin .wdf-wx').removeClass('active');
        };
    });
}();
