/**
 * Pj 场地projet
 * fj in 2015-10-30
 */

! function($) {
    "use strict";
    var $nav = $('#nav'), // 固定导航
        $nav2 = $('#navNative'), //默认导航
        $pkg = $('#package');
    var Pj = (function() {
        var $body = $('html, body'),
            $intro = $('#intro'),
            $notice = $('#notice'),
            $prompt = $('#prompt'),
            // $map = $('#map'),
            $recom = $('#recom'),
            scroll_time, // 窗口滚动定时id
            _nav_top, // 默认导航距离窗口顶部距离
            $scrollNav = [
                $nav.find('a[data-role="intro"]'),
                $nav.find('a[data-role="package"]'),
                $nav.find('a[data-role="notice"]'),
                $nav.find('a[data-role="prompt"]'),
                // $nav.find('a[data-role="map"]'), // 119 133 行的数字需要修改
                $nav.find('a[data-role="recom"]')
            ],
            scroll_top,
            f_user_scroll = true, // 是否是用户在滚动 而不是点击导航自动滚动
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
            // 商品日期价格对象
            _goods = {},
            _operation = true,
            // ******************************
            _like_pack = true,
            $recom = $('#recomCon'); // 其他推荐 wrap
        return {
            ini: function() {
                // 场地logo加载完成事件
                var $logo = $('#siteLogo').find('img'), // 场地logo
                    _logo_time = setInterval(function() {
                        if ($logo[0].complete) {
                            clearInterval(_logo_time);
                            // 场地logo自适应
                            if ($logo.width() / $logo.height() > 1.5) {
                                $logo.addClass('w1');
                                $('#siteLogo').addClass('ml20');
                            } else {
                                $logo.addClass('h1');
                                $('#siteLogo').addClass('mb10');
                            };
                        }
                    }, 50);

                // 场地描述高度检测
                var siteIntro = $('#siteIntro');
                siteIntro.height() > 125 && (
                    siteIntro.find('div').height(88),
                    siteIntro.on('click', '.site-intro-btn', function() {
                        $(this).data('i') === 'open' && (
                            $(this).data('i', 'close').html('收起').prev().height('auto')
                        ) || (
                            $(this).data('i', 'open').html('显示全部').prev().height(88)
                        );
                    })
                ) || siteIntro.find('.site-intro-btn').remove();

                // 封面图片加载完成事件
                var $coverImg = $('#detailCover').find('.detail-cover'),
                    _cover_time = setInterval(function() {
                        if ($coverImg[0].complete) {
                            clearInterval(_cover_time);
                            // 记录图片高度
                            Pj.setNavTop();
                        }
                    }, 50);

                // 套餐信息载入
                Pj.loadPkg();

                // 日历实例化对象
                Pj.calendar();

                // 图片描述 roll img 事件
                Pj.rollImgCheck();
            },
            /**
             * [scroll 滚动窗口]
             */
            scroll: function($win) {
                scroll_time && clearTimeout(scroll_time);
                scroll_time = setTimeout(function() {
                    var n = $win.scrollTop();
                    if (n > _nav_top) {
                        $nav.addClass('active');
                        // 检测滚动位置
                        f_user_scroll && Pj.scrollCheck(n);
                    } else {
                        $nav.removeClass('active');
                    };
                }, 10);
            },
            scrollTo: function(_w) { // 导航点击到对应的位置
                f_user_scroll = false;
                $body.animate({
                    scrollTop: $('#' + _w).position().top + 20
                }, 400, function() {
                    f_user_scroll = true;
                });
            },
            scrollCheck: function(n) {
                Pj.setScrollTop();
                var i = 5;
                while (i--) {
                    if (n >= scroll_top[i]) {
                        break;
                    };
                };
                $scrollNav[i].siblings().removeClass('active').end().addClass('active');
            },
            setScrollTop: function() {
                scroll_top = [
                    $intro.position().top,
                    $pkg.position().top,
                    $notice.position().top,
                    $prompt.position().top,
                    // $map.position().top,
                    $recom.position().top - 170
                ];
            },
            /**
             * 套餐
             */
            calendar: function() {
                // 日历实例化对象
                $pkg.find('.calendar-con').each(function() {
                    var $this = $(this),
                        $goods = $this.closest('.package-item');
                    $this.fullCalendar({
                        // events: {
                        //     url: 'http://localhost/wederful/tp_wederful/a.php',
                        //     type: 'POST',
                        //     textColor: '#ff2c55',
                        //     success: function(_r) {
                        //     }
                        // },
                        dayClick: function(_d) {
                            _d = $.fullCalendar.formatDate(_d, "yyyy-MM-dd");
                            $.ajax({
                                type: 'POST',
                                url: global.getGoodDatePrice,
                                dataType: 'json',
                                data: {
                                    pid: $goods.data('id'),
                                    date: _d
                                },
                                success: function(_r) {
                                    if (_r.status === 'success') {
                                        if (_r.data === '0') { // 当天不可提供
                                            // $.remaind(_r.message, true);
                                            console.log(_r.message);
                                        } else {
                                            _goods[$goods.data('id')].basePrice = _r.data;
                                            _goods[$goods.data('id')].date = _d;
                                            // 渲染值
                                            Pj.renderPrice($goods);
                                            // 隐藏日历 且改变节点值
                                            $this.closest('.calendar-wrap').addClass('hide').find('.now-date').html(_d);
                                        };
                                    } else { // 价格设置交叉（联系后台管理员）
                                        // $.remaind(_r.message, true);
                                        console.log(_r.message);
                                    };
                                }
                            });
                        }
                    });
                });
            },
            loadPkg: function() {
                var $goods = $pkg.find('.package-item'),
                    _goods_l = $goods.length,
                    $ext,
                    _ext_l,
                    _temp;
                while (_goods_l--) {
                    _goods[$goods.eq(_goods_l).data('id')] = {
                        name: $goods.eq(_goods_l).data('name'),
                        min: $goods.eq(_goods_l).data('min'),
                        num: $goods.eq(_goods_l).data('min'), // 当前人数 默认为最小人数
                        max: $goods.eq(_goods_l).data('max'),
                        date: '',
                        basePrice: $goods.eq(_goods_l).data('price').replace(/\,/g, ''), // 用户点击日期时候这个价格会改变
                        // ext: [{ // ext 为空数组表示这个商品没有增值服务
                        //     id: ,
                        //     price: ,
                        //     min: ,
                        //     max: ,
                        //     name: '',
                        //     num: , // 选中数量 默认为1
                        //     tag: false // 用户是否选中 默认为false
                        // }],
                        charge: $goods.eq(_goods_l).data('charge') // 每个多余的人多少钱
                    };
                    $ext = $goods.eq(_goods_l).find('.ext-item');
                    _ext_l = $ext.length;
                    _temp = [];
                    while (_ext_l--) {
                        _temp.push({
                            id: $ext.eq(_ext_l).data('id'),
                            price: $ext.eq(_ext_l).attr('data-price').replace(/\,/g, ''),
                            min: $ext.eq(_ext_l).data('min'),
                            max: $ext.eq(_ext_l).data('max'),
                            name: $ext.eq(_ext_l).data('name'),
                            num: 1,
                            tag: false // 时候购买
                        });
                    };
                    _goods[$goods.eq(_goods_l).data('id')].ext = _temp;
                };
            },
            renderPrice: function($goods) { // $goods package-item
                // 日期价（基本价） + 人数多于价位 + 增值服务价位
                var _price = 0,
                    _id = $goods.data('id'),
                    _l;
                // 基本价
                _price += ~~_goods[_id].basePrice;
                // 人数价
                if ((_goods[_id].num - _goods[_id].min) > 0 && _goods[_id].charge > 0) { // 超出人数需要额外价格才加价格
                    _price += (_goods[_id].num - _goods[_id].min) * _goods[_id].charge;
                };
                // 增值服务价
                _l = _goods[_id].ext.length;
                while(_l--) {
                    if (_goods[_id].ext[_l].tag) {
                        _price += _goods[_id].ext[_l].price * _goods[_id].ext[_l].num;
                    };
                };
                // 渲染价格
                $goods.find('.package-money').html('RMB ' + tools.toThousands(_price));
            },
            openPackage: function($this) {
                $this.closest('.package-item').siblings().removeClass('active').end().toggleClass('active');
            },
            numFunc: function($ipt, _d, _t) { // iptDom direction type
                var _v = ~~$ipt.val(),
                    $goods = $ipt.closest('.package-item'),
                    $err = $ipt.next().next(),
                    _ext,
                    _l;
                _d === 'up' && _v++;
                _d === 'down' && _v--;
                if (_t === 'num') { // 人数操作
                    if(_v > _goods[$goods.data('id')].max) {
                        $err.html('超出最大人数: ' + _goods[$goods.data('id')].max);
                        $ipt.val(_goods[$goods.data('id')].max);
                        return;
                    };
                    if(_v < 2) {
                        $err.html('少于最小人数: 2');
                        $ipt.val(2);
                        return;
                    };
                    _goods[$goods.data('id')].num = _v;
                } else {
                    _ext = _goods[$goods.data('id')].ext;
                    _l = _ext.length;
                    while(_l--) {
                        if (_ext[_l].id === $ipt.closest('.ext-item').data('id')) {
                            if(_v > _ext[_l].max) {
                                $err.html('超出最大个数: ' + _ext[_l].max);
                                $ipt.val(_ext[_l].max);
                                return;
                            };
                            if(_v < _ext[_l].min) {
                                $err.html('少于最小个数: ' + _ext[_l].min);
                                $ipt.val(_ext[_l].min);
                                return;
                            };
                            _goods[$goods.data('id')].ext[_l].num = _v;
                            break;
                        };
                    };
                };
                $err.html('&emsp;');
                $ipt.val(_v);
                Pj.renderPrice($goods);
            },
            extFunc: function($this) {
                var $goods = $this.closest('.package-item'),
                    _ext = _goods[$goods.data('id')].ext,
                    _l = _ext.length;
                $this.toggleClass('active');
                while(_l--) {
                    if (_ext[_l].id === $this.closest('.ext-item').data('id')) {
                        _goods[$goods.data('id')].ext[_l].tag = $this.is('.active');
                        Pj.renderPrice($goods);
                        break;
                    };
                };
            },
            pkgOrder: function($this) {
                var $goods,
                    _temp = {},
                    _id,
                    _ext,
                    _l;
                if (_operation) {
                    _operation = false;
                    $goods = $this.closest('.package-item');
                    _id = $goods.data('id');
                    if (_goods[$goods.data('id')].date) {
                        // 获取数据
                        _temp.name = _goods[_id].name;
                        _temp.id = _id;
                        _temp.date = _goods[_id].date;
                        _temp.number = _goods[_id].num;
                        _temp.add = [];

                        _ext = _goods[_id].ext;
                        _l = _ext.length;
                        while(_l--) {
                            if (_ext[_l].tag) {
                                _temp.add.push({
                                    id: _ext[_l].id,
                                    name: _ext[_l].name,
                                    number: _ext[_l].num
                                });
                            };
                        };
                        // 发送数据
                        $this.html('预定中…');
                        $.ajax({
                            type: 'POST',
                            url: global.placeOrder,
                            data: _temp,
                            dataType: 'json',
                            success: function(_r) {
                                if (_r.message === '尚未登录') {
                                    $('#header').find('.login-trigger').trigger('click');
                                } else {
                                    // 提示成功
                                    $mask.html('<img class="middle" src="' + global.imgUrl + 'order-letter.png" alt="提交成功 succes" />').fadeIn(400);
                                    setTimeout(function() {
                                        $.showMask(false);
                                    }, 4000);
                                };
                                $this.html('申请预定');
                                _operation = true;
                            },
                            error: function() {
                                _operation = true;
                            }
                        });
                    } else {
                        $.remaind('请选择日期', true);
                        _operation = true;
                    };
                };
            },
            likePack: function($this) {
                if (_like_pack) {
                    _like_pack = false;
                    $.ajax({
                        type: 'POST',
                        url: global.collectionPackage,
                        dataType: 'json',
                        data: {
                            pid: $this.closest('.package-item').data('id')
                        },
                        success: function(r) {
                            if (r.message === '尚未登录') {
                                $('#header').find('.login-trigger').trigger('click');
                            } else {
                                $this.attr('title', r.data === '0' ? '收藏' : '取消收藏').find('.css-hart').toggleClass('active');
                            };
                            _like_pack = true;
                        }
                    });
                };
            },
            /**
             * [图片描述 roll img 方法]
             */
            // n 表示要移动到的节点下标, t 表示是否要过度, make 表示是有mask蒙层放大
            rollImgMove: function(n, t, mask) {
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
                        l = ~~(500 - d.position().left - d.width() / 2), // 要滚动的距离
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
                        '-webkit-transform': 'translateX(' + l + 'px) translateZ(0)',
                        '-moz-transform': 'translateX(' + l + 'px) translateZ(0)',
                        '-ms-transform': 'translateX(' + l + 'px) translateZ(0)',
                        '-o-transform': 'translateX(' + l + 'px) translateZ(0)',
                        'transform': 'translateX(' + l + 'px) translateZ(0)'
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
                    src = $this.data('video') ? '<embed class="w1 h1" src="' +
                    $this.data('video') +
                    '?VideoIDS=XMjkxMDgzMjk2=&isAutoPlay=true&showAd=0"' +
                    'allowFullScreen="true" quality="high" align="middle" ' +
                    'allowScriptAccess="always" type="application/x-shockwave-flash"></embed>' :
                    '<img draggable="false" class="w1 h1" src="' +
                    $this.find('img').attr('src') + '" alt="img" />';

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
                        '<div style="width:' +
                        wW + 'px;height:' + wH + 'px" class="r-i-mask-item middle ts4 pr">' +
                        src + '</div>').fadeIn(400)
                );
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
                var l = ~~($this.siblings().removeClass('active').end().addClass('active').data('i')) * -1000;
                $recom.css({
                    '-webkit-transform': 'translateX(' + l + 'px)',
                    '-moz-transform': 'translateX(' + l + 'px)',
                    '-ms-transform': 'translateX(' + l + 'px)',
                    '-o-transform': 'translateX(' + l + 'px)',
                    'transform': 'translateX(' + l + 'px)'
                });
            },
            /**
             * others
             */
            setNavTop: function() {
                _nav_top = $nav2.offset().top;
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

    $nav.on('click', 'a', function() {
        Pj.scrollTo($(this).siblings().removeClass('active').end().addClass('active').data('role'));
    });
    $nav2.on('click', 'a', function() {
        $nav.find('a').removeClass('active').filter('a[data-role="' + $(this).data('role') + '"]').addClass('active');
        Pj.scrollTo($(this).data('role'));
    });

    /**
     * 场地图片
     */
    // roll img 放大
    $('#rollImg').on('click', 'div.active', function() {
        Pj.rollImgPlay($(this));
    });

    // roll img 关闭
    $mask.on('click', '.r-i-close', function() {
        $.showMask(false);
    });

    // roll img 下一张
    $mask.on('click', '.r-i-m-next', function() {
        Pj.rollImgNext(true);
    });

    // roll img 上一张
    $mask.on('click', '.r-i-m-prev', function() {
        Pj.rollImgPrev(true);
    });

    $(window).resize(function() {
        // roll img 窗口大小改变
        Pj.rollImgResize();
        // 导航条距离顶部距离
        Pj.setNavTop();
    });

    /**
     * 套餐
     */
    // 打开套餐
    $pkg.on('click', '.open-pack', function() {
        Pj.openPackage($(this));
    });
    // 打开选择日期
    $pkg.on('click', '.calendar-tit', function() {
        $(this).parent().toggleClass('hide');
    });
    // 人数增加（减少）
    $pkg.on('click', '.num-up', function() {
        Pj.numFunc($(this).prev(), 'up', 'num');
    });
    $pkg.on('click', '.num-down', function() {
        Pj.numFunc($(this).next(), 'down', 'num');
    });
    $pkg.on('click', '.ext-up', function() {
        Pj.numFunc($(this).prev(), 'up', 'ext');
    });
    $pkg.on('click', '.ext-down', function() {
        Pj.numFunc($(this).next(), 'down', 'ext');
    });
    // 取消错误提示
    $pkg.on('keyup', '.only-num', function(e) {
        $(this).next().next().html('&emsp;');
        if ([37, 38, 39, 40, 46, 13, 8].indexOf($.getKey(e)) !== -1) { // 四个方向键 delete 回车 backspace
            return;
        };
        Pj.numFunc($(this), 'ipt', $(this).data('type'));
    });
    $pkg.on('focus blur', '.only-num', function(e) {
        $(this).next().next().html('&emsp;');
    });
    // 增值服务选择
    $pkg.on('click', '.p-ext-tit', function() {
        Pj.extFunc($(this));
    });
    // 预定套餐
    $pkg.on('click', '.pkg-order', function() {
        Pj.pkgOrder($(this));
    });
    // 收藏套餐
    $('#package').on('click', '.like-pack', function() {
        Pj.likePack($(this));
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
        });
    });

    /**
     * 其他推荐
     */
    $('#recomNav').on('click', 'a', function() {
        Pj.recomMove($(this));
    });
}(jQuery);
