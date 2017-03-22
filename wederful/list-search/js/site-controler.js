// 列表页控制器 make by hangyangws
! function(g, f) {
    f(g);
}(typeof window !== "undefined" ? window : this, function(w) {
    w.project = (function() {
        var d = $('#listSel').find('.sel-con'),
            s = $('#listSel').find('section'),
            l = d.length;
        return {
            ini: function() {
                // 判断是否需要更多按钮
                var t_l = l;
                while (t_l--) {
                    if ($(d[t_l]).find('label').length > 8) {
                        $(d[t_l]).height(29);
                        // 更多条件选项
                        $('#listSel').on('click', '.opt-more', function() {
                            if ($(this).attr('data-role') === 'open') {
                                $(this).attr('data-role', 'close').prev().addClass('active').end()
                                    .find('span').text('收起').end().find('i').css('background-position', '-18px -54px');
                            } else {
                                $(this).attr('data-role', 'open').prev().removeClass('active').end()
                                    .find('span').text('更多').end().find('i').css('background-position', '-18px -36px');
                            }
                        })
                    } else {
                        $(d[t_l]).next().remove()
                    }
                }
                // 判断是否需要"更多条件"按钮
                t_l = l;
                if (t_l > 3) {
                    // 3以后的section都none
                    while(t_l--) {
                        t_l > 2 && $(s[t_l]).css('display', 'none');
                        t_l === 2 && $(s[t_l]).css('border', 'none')
                    }
                    // "更多条件" 点击事件
                    $('#toggleList').on('click', function() {
                        t_l = l;
                        if ($(this).attr('data-role') === 'open') {
                            while(t_l--) {
                                t_l > 2 && $(s[t_l]).css('display', 'block');
                                t_l === 2 && $(s[t_l]).css('border-bottom', '1px solid #e0e0e0')
                            }
                            $(this).attr('data-role', 'close').find('span').text('收起选项').next()
                                .css('background-position', '-18px -54px');
                        } else {
                            while(t_l--) {
                                t_l > 2 && $(s[t_l]).css('display', 'none');
                                t_l === 2 && $(s[t_l]).css('border', 'none')
                            }
                            $(this).attr('data-role', 'open').find('span').text('更多条件').next()
                                .css('background-position', '-18px -36px');
                        }
                    });
                } else {
                    $('#toggleList').remove()
                }
            },

            typeChg: function(this$) {

                this$.addClass('active').siblings().removeClass('active')
            },

            filter: function(this$) {
                if (this$.is('.sel-no')) {
                    !this$.is('.active') && this$.addClass('active').next().find('label').removeClass('active')
                } else {
                    if (this$.is('.active')) {
                        this$.removeClass('active')
                    } else {
                        this$.addClass('active')
                    }
                    if (!this$.parent().find('label.active').length) {
                        this$.parents('section').find('.sel-no').addClass('active');
                    } else {
                        this$.parents('section').find('.sel-no').removeClass('active');
                    }
                }
            },

            clearOne: function(this$) {
                this$.parent().remove()
            },

            clear: function() {
                $('#filter').removeClass('active').find('ul').html('')
            }
        };
    })();
});
