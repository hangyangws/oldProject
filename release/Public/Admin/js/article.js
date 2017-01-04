/**
 * 2015-12-08 - hangyangws
 * [Article 内容管理]
 */

! function($) {
    "use strict";
    var Article = (function() {
        var _art_operation = true;
        return {
            ini: function() {
                global.categoryid && ( // 页面如果有当前文章类型 处触改变
                    $allWrap.find('.art-type').find('option[value="' + global.categoryid + '"]').attr('selected', 'selected')
                );
                global.keywords && ( // 页面如果有搜索关键字 处触改变
                    $allWrap.find('.search-list').val(global.keywords)
                );
                // 富文本编辑器
                Pj.inputText(true);
                // 七牛
                Pj.qiNiu();
            },
            // 文章删除
            artDel: function($this) {
                var $tr = $this.closest('tr');
                if (_art_operation && confirm('确认删除文章？\n' + $tr.data('name'))) {
                    _art_operation = false;
                    $.ajax({
                        url: global.delArticleUrl,
                        dataType: 'json',
                        data: {
                            id: $tr.data('id')
                        },
                        success: function(r) {
                            if (r.status === 'success') {
                                $tr.remove();
                            } else {
                                $.remaind(r.message, true);
                            };
                            _art_operation = true;
                        },
                        error: function() {
                            $.remaind('网络堵塞', true);
                            _art_operation = true;
                        }
                    });
                };
            },
            // 文章操作（发布和置顶）
            artOperation: function($this, _type) {
                var $tr = $this.closest('tr'),
                    _t;
                if (_art_operation) {
                    _art_operation = false;
                    $.remaind('操作中，请稍后...', false);
                    $.ajax({
                        url: _type === 'show' ? global.articleIsShowUrl : global.articleIsTopUrl,
                        dataType: 'json',
                        data: {
                            id: $tr.data('id')
                        },
                        success: function(r) {
                            if (r.status === 'success') {
                                $.showMask(false);
                                _t = _type === 'show' ? '发布' : '置顶';
                                $this.html(r.data === '1' ? '取消' + _t : _t);
                            } else {
                                $.remaind(r.message, true);
                            };
                            _art_operation = true;
                        },
                        error: function() {
                            $.remaind('网络堵塞', true);
                            _art_operation = true;
                        }
                    });
                };
            },
            // 文章分页
            pagingIndex: function($this, e) {
                if ($.getKey(e) === 13) {
                    Article.pagingGo(
                        $this.val(),
                        global.categoryid,
                        global.keywords
                    );
                };
            },
            pagingGo: function(page, type, search) {
                var _u = '';
                type = type === 'null' ? '' : type;
                _u += (page ? '/p/' + page : '') +
                    (type ? '/categoryid/' + type : '') +
                    (search ? '/search/' + search : '');
                // 跳转
                location.href = global.localUrl + _u;
            },
            search: function(_s) {
                Article.pagingGo('', global.categoryid, _s);
            }
        };
    })();
    // 初始化
    Article.ini();
    // 删除
    $allWrap.on('click', '.art-del', function() {
        Article.artDel($(this));
    });
    // 发布
    $allWrap.on('click', '.art-publish', function() {
        Article.artOperation($(this), 'show');
    });
    // 顶置
    $allWrap.on('click', '.art-top', function() {
        Article.artOperation($(this), 'top');
    });
    // 板块选择
    $allWrap.on('change', '.art-type', function() {
        Article.pagingGo('', $(this).val(), '');
    });
    // 关键字搜索
    $allWrap.on('click', '.art-search-btn', function() {
        Article.search($.trim($(this).prev().val()));
    });
    // 翻页
    $allWrap.on('keyup', '.paging-go', function(e) {
        Article.pagingIndex($(this), e);
    });
}(jQuery);
