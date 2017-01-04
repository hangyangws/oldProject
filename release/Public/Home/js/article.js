/**
 * @return {[Article - project object]}    [Feng Jie production]
 */

;
! function($) {
    "use strict";
    var Article = (function() {
        var $side = $('#artSide'),
            _scroll_t,
            $footer = $('footer'),
            _art_praise = true,
            $artLikeNum = $('#artLikeNum'),
            $duc = $(document);
        return {
            ini: function() {
                // 给所有文章的图片不可拖动
                $('#article').find('.article-con').find('img').attr('draggable', 'false');
                // 生成页面二维码
                var $qrcode = $('#qrCode');
                if ($qrcode.length > 0) {
                    $qrcode.qrcode(location.href);
                };
            },
            scroll: function($win) {
                var _win_top = $win.scrollTop(),
                    _dom_height = $duc.height(),
                    _aside_top = $side.position().top - 20,
                    _side_footer_hei = $side.height() + $footer.height() + 150,
                    _m;
                _scroll_t && clearTimeout(_scroll_t);
                _scroll_t = setTimeout(function() {
                    if (_win_top > _aside_top) {
                        $side.addClass('active');
                        _m = _dom_height - _win_top - _side_footer_hei;
                        if (_m < 0) {
                            $side.css('margin-top', _m + 'px');
                        } else {
                            $side.css('margin-top', '0');
                        };
                    } else {
                        $side.removeClass('active');
                    };
                }, 10);
            },
            // 文章点赞
            artPraise: function($this) {
                if (_art_praise) {
                    _art_praise = false;
                    $.ajax({
                        url: global.praiseUrl,
                        dataType: 'json',
                        data: {
                            aid: global.articleId
                        },
                        success: function(r) {
                            if (r.status === 'success') {
                                var $b = $this.find('b');
                                $artLikeNum.html(r.data.praise_num);
                                // 提示成功
                                $b.addClass('ts4-live');
                                $this.addClass('success');
                                setTimeout(function() {
                                    $b.removeClass('ts4-live');
                                    $this.removeClass('success');
                                }, 360);
                            };
                            _art_praise = true;
                        }
                    });
                };
            },
            // 分享到新浪微博
            shareWeibo: function($this) {
                var str = '#' + $('#artTit').html() + '#\n' + $('#artSubTit').html() + '\n@Wederful海外婚礼',
                    $img = $('#article').find('img'),
                    _img_l = $img.length,
                    // 图片字符串
                    _img = [],
                    href;

                while (_img_l--) {
                    _img.push($img.eq(_img_l).attr('src'));
                };
                _img = _img.join('||');

                href = ['http://v.t.sina.com.cn/share/share.php?',
                    'url=' + encodeURIComponent(document.location.href),
                    '&title=' + encodeURIComponent(str),
                    '&content=utf-8',
                    '&pic=' + encodeURIComponent(_img)
                ].join('');

                $this.attr('href', href);
            },
            // 文章分页
            pagingIndex: function($this, e) {
                if ($.getKey(e) === 13) {
                    location.href = global.baseUrl + '/p/' + $this.val();
                };
            }
        };
    })();

    Article.ini();

    $(window).on('scroll', function() {
        Article.scroll($(this));
    });

    // 文章点赞
    $('#main').on('click', '.art-praise', function() {
        Article.artPraise($(this));
    });

    // 分享到新浪微博
    $('#artShare').on('click', '.share-weibo', function() {
        Article.shareWeibo($(this));
    });

    // 翻页
    $('#paging').on('keyup', '.paging-go', function(e) {
        Article.pagingIndex($(this), e);
    });
}(jQuery);
