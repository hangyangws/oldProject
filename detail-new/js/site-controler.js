/**
 * Pj 场地projet
 * fj in 2015-10-30
 */

! function($) {
    "use strict";
    var Pj = (function() {
        var $nav = $('#nav'), // 固定导航
            $body = $('body'),
            scroll_time, // 窗口滚动定时id
            $mask = $('#mask'),
            $scrollNav = [
                $nav.find('a[data-role="intro"]'),
                $nav.find('a[data-role="package"]'),
                $nav.find('a[data-role="notice"]'),
                $nav.find('a[data-role="prompt"]'),
                $nav.find('a[data-role="map"]'),
                $nav.find('a[data-role="recom"]')
            ],
            scroll_top = [
                $('#intro').position().top,
                $('#package').position().top - 200,
                $('#notice').position().top - 200,
                $('#prompt').position().top - 200,
                $('#map').position().top - 200,
                $('#recom').position().top - 200
            ],
            f_user_scroll = true, // 时候是用户在滚动 而不是点击导航自动滚动
            /**
             * [图片描述 roll img 私有变量]
             */
            _rollImg_wrap = $('#rollImg').find('.r-i-wrap').find('figure'),
            _rollImg_div = _rollImg_wrap.find('div'),
            _rollImg_len = _rollImg_div.length, // 原始图片数量
            _rollImg_now = 0,
            _rollImg_left = ~~(_rollImg_len / 2) + 1,
            _rollImg_right = _rollImg_left + _rollImg_len - 1,
            _roll_is = true,
            // ******************************
            $recom = $('#recomCon'); // 其他推荐 wrap
        return {
            ini: function() {
                // 场地logo加载完成事件
                var img = $('#siteLogo').find('img'), // 场地logo
                    t = setInterval(function() {
                        if (img[0].complete) {
                            clearInterval(t);
                            // 场地logo自适应
                            img.width() / img.height() > 1 ? img.addClass('w1') : img.addClass('h1');
                        }
                    }, 50),
                    siteIntro = $('#siteIntro');
                // 场地描述高度检测
                siteIntro.height() > 125 && (
                    siteIntro.find('div').height(88),
                    siteIntro.on('click', 'span', function() {
                        $(this).data('i') === 'open' && (
                            $(this).data('i', 'close').html('收起').prev().height('auto')
                        ) || (
                            $(this).data('i', 'open').html('显示全部').prev().height(88)
                        );
                    })
                ) || siteIntro.find('span').remove();

                /**
                 * 图片描述 roll img 事件
                 */
                Pj.rollImgCheck();
            },
            /**
             * [scroll 滚动窗口]
             */
            scroll: function($win) {
                scroll_time && clearTimeout(scroll_time);
                scroll_time = setTimeout(function() {
                    var n = $win.scrollTop();
                    if (n >= 759) {
                        $nav.addClass('active');
                        // 检测滚动位置
                        if (f_user_scroll) {
                            Pj.scrollCheck(n);
                        }
                    } else {
                        $nav.removeClass('active');
                    };
                }, 10);
            },
            scrollTo: function($this) {
                var t = $('#' + $this.siblings().removeClass('active').end().addClass('active').data('role')).position().top;
                f_user_scroll = false;
                $body.animate({
                    scrollTop: t
                }, 400, function() {
                    f_user_scroll = true;
                });
            },
            scrollCheck: function(n) {
                var i = 6;
                while (i--) {
                    if (n >= scroll_top[i]) {
                        break;
                    };
                };
                $scrollNav[i].siblings().removeClass('active').end().addClass('active');
            },
            setScrollTop: function() {
                setTimeout(function() {
                    scroll_top = [
                        $('#intro').position().top,
                        $('#package').position().top,
                        $('#notice').position().top,
                        $('#prompt').position().top,
                        $('#map').position().top,
                        $('#recom').position().top
                    ];
                }, 10);
            },

            /**
             * 套餐
             */
            openPackage: function($this) {
                $this.closest('.package-item').siblings().removeClass('active').end().toggleClass('active');
                scroll_top = Pj.setScrollTop();
            },
            /**
             * [图片描述 roll img 方法]
             */
            rollImgMove: function(n, t, mask) { // n 表示要移动到的节点下标, t 表示是否要过度, make 表示是有mask蒙层放大
                if (_roll_is) {
                    if (t) {
                        _roll_is = false;
                        setTimeout(function() {
                            _roll_is = true;
                            // 极端检测
                            _rollImg_now === _rollImg_left - 1 && ( // 已经到了左边的极限位置
                                Pj.rollImgMove(_rollImg_right)
                            );
                            _rollImg_now === _rollImg_right + 1 && ( // 已经到了右边的极限位置
                                Pj.rollImgMove(_rollImg_left)
                            );
                        }, 1000);
                    }
                    var d = _rollImg_div.eq(n), // 要滚动到的图片
                        l = 500 - d.position().left - d.width() / 2, // 要滚动的距离
                        ts = _rollImg_wrap.add(d).add(_rollImg_div.eq(_rollImg_now));
                    // 判断是否有 mask 蒙层
                    mask && (
                        Pj.rollImgPlay(d, true)
                    );
                    // 过度动画的是否
                    t && ts.addClass('i-ts1') || ts.removeClass('i-ts1');
                    // 以前的去掉active 现在的加上active
                    _rollImg_div.eq(_rollImg_now).removeClass('active').end().eq(n).addClass('active');
                    // 整体位置移动
                    _rollImg_wrap.css({
                        '-webkit-transform': 'translateX(' + l + 'px)',
                        '-moz-transform': 'translateX(' + l + 'px)',
                        '-ms-transform': 'translateX(' + l + 'px)',
                        '-o-transform': 'translateX(' + l + 'px)',
                        'transform': 'translateX(' + l + 'px)'
                    });
                    // 重新赋值 现在的图片下标
                    _rollImg_now = n;
                };
            },
            rollImgCheck: function() { // 检测图片加载是否完成
                var t,
                    i = _rollImg_len,
                    ok = true;
                t = setInterval(function() {
                    while (i--) { // 检测roll img 的所有图片是否加载完毕
                        if (!_rollImg_div.eq(i).find('img')[0].complete) {
                            ok = false;
                            break
                        };
                    };
                    if (ok) {
                        clearInterval(t);
                        i = _rollImg_len;
                        while (i--) { // 检测哪些图片是需要视频播放的
                            _rollImg_div.eq(i).data('video') && (
                                _rollImg_div.eq(i).append('<i class="r-i-viedo"></i>')
                            )
                        };
                        _rollImg_len < 3 && (
                            _rollImg_wrap.html(_rollImg_wrap.html() + _rollImg_wrap.html()),
                            _rollImg_div = _rollImg_wrap.find('div'),
                            _rollImg_len = _rollImg_len * 2,
                            _rollImg_left = ~~(_rollImg_len / 2) + 1,
                            _rollImg_right = _rollImg_left + _rollImg_len - 1
                        );
                        Pj.rollImgIni();
                    }
                    ok = true;
                    i = _rollImg_len;
                }, 50);
            },
            rollImgIni: function() {
                // 增加节点数（2n+1）
                _rollImg_wrap.html(_rollImg_wrap.html() + _rollImg_wrap.html() + _rollImg_div.get(0).outerHTML);
                // 重置信息
                _rollImg_div = _rollImg_wrap.find('div');
                // 父元素移动至中点 中点元素放大
                Pj.rollImgMove(_rollImg_len);
                // 绑定
                $('#rollImg').on('click', '.r-i-prev', function() {
                    Pj.rollImgPrev();
                });
                $('#rollImg').on('click', '.r-i-next', function() {
                    Pj.rollImgNext();
                })
            },
            rollImgPrev: function(mask) {
                Pj.rollImgMove(_rollImg_now - 1, true, mask);
            },
            rollImgNext: function(mask) {
                Pj.rollImgMove(_rollImg_now + 1, true, mask);
            },
            rollImgPlay: function($this, f) { // f 表示是否只需要渲染mask图片和视频 默认为false
                var wW = $(window).width(),
                    wH = $(window).height(),
                    i_w = $this.width(), // 当前激活图片的 宽
                    i_h = $this.height(), // 当前激活图片的 高
                    src = $this.data('video') ? '<embed class="w1 h1" src="' + $this.data('video') + '?VideoIDS=XMjkxMDgzMjk2=&isAutoPlay=true&showAd=0" allowFullScreen="true" quality="high" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>' : '<img class="w1 h1" src="' + $this.find('img').attr('src') + '" alt="img" />';

                wW / wH > i_w / i_h && ( //宽屏
                    wH = wH * 0.7,
                    wW = i_w / i_h * wH
                ) || ( //竖屏
                    wW = wW * 0.7,
                    wH = wW / (i_w / i_h)
                );

                f && (
                    $mask.find('.r-i-mask-item').css({
                        width: wW + 'px',
                        height: wH + 'px'
                    }).html(src)
                ) || (
                    $mask.html('<span class="r-i-m-prev fl w30 h30 ml100 pr r50 cp ts4 z1"></span>' +
                        '<span class="r-i-m-next fr w30 h30 mr100 pr r50 cp ts4 z1"></span>' +
                        '<span class="r-i-close w30 h30 mr100 pa r0 r50 cp ts4 z1" title="关闭窗口"></span>' +
                        '<div style="width:' + wW + 'px;height:' + wH + 'px" class="r-i-mask-item middle ts4 pr">' + src + '</div>').fadeIn(400)
                )
            },
            rollImgResize: function() {
                // 判断是否放大
                if ($mask.css("display") === 'block') {
                    var re_time;
                    clearTimeout(re_time);
                    re_time = setTimeout(function() {
                        var wW = $(window).width(),
                            wH = $(window).height(),
                            img = _rollImg_wrap.find('.active'), // 当前激活图片
                            i_w = img.width(), // 当前激活图片的 宽
                            i_h = img.height(); // 当前激活图片的 高
                        wW / wH > i_w / i_h && ( //宽屏
                            wH = wH * 0.7,
                            wW = i_w / i_h * wH
                        ) || ( //竖屏
                            wW = wW * 0.7,
                            wH = wW / (i_w / i_h)
                        );

                        $mask.find('.r-i-mask-item').css({
                            'width': wW,
                            'height': wH
                        });
                    }, 500);
                };
            },

            /**
             * 其他推荐
             */

            recomMove: function($this) {
                var l = ~~($this.siblings().removeClass('active').end().addClass('active').data('i')) * -1032;
                $recom.css({
                    '-webkit-transform': 'translateX(' + l + 'px)',
                    '-moz-transform': 'translateX(' + l + 'px)',
                    '-ms-transform': 'translateX(' + l + 'px)',
                    '-o-transform': 'translateX(' + l + 'px)',
                    'transform': 'translateX(' + l + 'px)'
                });
            }
        };
    })();

    /**
     * 页面初始化
     */
    Pj.ini();

    /**
     * 窗口和导航
     */
    $(window).scroll(function() {
        Pj.scroll($(this));
    });

    $('#nav').on('click', 'a', function() {
        Pj.scrollTo($(this));
    });

    /**
     * 场地图片
     */
    // roll img 放大
    $('#rollImg').on('click', 'div.active', function() {
        Pj.rollImgPlay($(this))
    });

    // roll img 关闭
    $('#mask').on('click', '.r-i-close', function() {
        $.showMask(false)
    });

    // roll img 下一张
    $('#mask').on('click', '.r-i-m-next', function() {
        Pj.rollImgNext(true)
    });

    // roll img 上一张
    $('#mask').on('click', '.r-i-m-prev', function() {
        Pj.rollImgPrev(true)
    });

    // roll img 窗口大小改变
    $(window).resize(function() {
        Pj.rollImgResize()
    });

    /**
     * 套餐
     */
    // 打开选择人数
    $('#package').on('click', '.p-i-num', function() {
        $(this).toggleClass('active');
    });

    // 增值服务选择
    $('#package').on('click', '.p-i-ext li', function() {
        $(this).toggleClass('active');
    });

    // 打开套餐
    $('#package').on('click', '.open-pack', function() {
        Pj.openPackage($(this));
    });

    /**
     * 出行提示
     */
    $('#travelTipsNav').on('click', 'a', function() {
        var l = ~~$(this).siblings().removeClass('active').end().addClass('active').data('i') * -510 + 'px';
        $('#travelTipsCon').css({
            '-webkit-transform': 'translateY(' + l + ')',
            '-moz-transform': 'translateY(' + l + ')',
            '-ms-transform': 'translateY(' + l + ')',
            '-o-transform': 'translateY(' + l + ')',
            'transform': 'translateY(' + l + ')'
        })
    });

    /**
     * 其他推荐
     */
    $('#recomNav').on('click', 'a', function() {
        Pj.recomMove($(this));
    });
}(jQuery);
