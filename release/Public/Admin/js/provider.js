/**
 * 2015-12-08 by hangyangws
 * [Provider 内容管理]
 */

! function($) {
    "use strict";
    var Provider = (function() {
        var $addDom = $('#addDom').html(),
            _operation = true;
        return {
            ini: function() {
                global.categoryid && ( // 页面如果有当前文章类型 处触改变
                    $allWrap.find('.category-type').find('option[value="' + global.categoryid + '"]').attr('selected', 'selected')
                );
                global.keywords && ( // 页面如果有搜索关键字 处触改变
                    $allWrap.find('.search-list').val(global.keywords)
                );
                Pj.qiNiu();
                Pj.inputText();
                Pj.inputDate($allWrap.find('.package-form'));
            },
            addDom: function($this) {
                $this.prev().append($addDom);
            },
            copy: function($this) {
                if (confirm('确认复制服务商: ' + $this.data('name'))) {
                    var $d,
                        $t;
                    if (_operation) {
                        _operation = false;
                        $.remaind('操作中，请稍后...', false);
                        $.ajax({
                            type: 'POST',
                            url: global.copyAreaUrl,
                            dataType: 'json',
                            data: {
                                id: $this.data('id')
                            },
                            success: function(r) {
                                if (r.status === 'success') {
                                    $.showMask(false);
                                    $d = $this.clone();
                                    $t = $d.find('.edit-this');
                                    $t.attr('href', $t.attr('href').replace(/\/\d+$/, '/' + r.data.id));
                                    $d.find('.upname').html(r.data.upname).end()
                                        .attr('data-id', r.data.id);
                                    $this.parent().append($d);
                                } else {
                                    $.remaind(r.message, true);
                                };
                                _operation = true;
                            },
                            error: function() {
                                $.remaind('网络堵塞', true);
                                _operation = true;
                            }
                        });
                    };
                };
            },
            pagingIndex: function($this, e) {
                if ($.getKey(e) === 13) {
                    Provider.pagingGo(
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
                Provider.pagingGo('', global.categoryid, _s);
            }
        };
    })();
    Provider.ini();
    // 节点添加
    $allWrap.on('click', '.provider-add-dom', function() {
        Provider.addDom($(this));
    });
    // 复制
    $allWrap.on('click', '.copy-provider', function() {
        Provider.copy($(this).closest('tr'));
    });
    // 板块选择
    $allWrap.on('change', '.category-type', function() {
        Provider.pagingGo('', $(this).val(), '');
    });
    // 关键字搜索
    $allWrap.on('click', '.provider-search-btn', function() {
        Provider.search($.trim($(this).prev().val()));
    });
    // 翻页
    $allWrap.on('keyup', '.paging-go', function(e) {
        Provider.pagingIndex($(this), e);
    });
}(jQuery);
