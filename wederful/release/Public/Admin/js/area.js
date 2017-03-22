/**
 * 2015-12-08 by hangyangws
 * [Area 内容管理]
 */

! function($) {
    "use strict";
    var Area = (function() {
        var _operation = true,
            $addDom = $('#addDom').html();
        return {
            ini: function() {
                // 七牛
                Pj.qiNiu();
                // 富文本编辑
                Pj.inputText();
            },
            operation: function($this, _type) {
                var $d,
                    $t;
                if (_operation) {
                    _operation = false;
                    $.remaind('操作中，请稍后...', false);
                    $.ajax({
                        url: _type === 'del' ? global.delAreaUrl : global.copyAreaUrl,
                        dataType: 'json',
                        data: {
                            id: $this.data('id')
                        },
                        success: function(r) {
                            if (r.status === 'success') {
                                $.showMask(false);
                                if (_type === 'del') {
                                    $this.remove();
                                } else {
                                    $d = $this.clone();
                                    $t = $d.find('.edit-this');
                                    $t.attr('href', $t.attr('href').replace(/\/\d+$/, '/' + r.data.id));
                                    $d.find('.createtime').html(r.data.createtime).end()
                                        .find('.upname').html(r.data.upname).end()
                                        .attr('data-id', r.data.id).end();
                                    $this.parent().append($d);
                                };
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
            },
            del: function($this) {
                var $tr = $this.closest('tr');
                confirm('确认删除地区: ' + $tr.data('name')) && (
                    Area.operation($tr, 'del')
                );
            },
            copy: function($this) {
                var $tr = $this.closest('tr');
                confirm('确认复制地区: ' + $tr.data('name')) && (
                    Area.operation($tr, 'copy')
                );
            },
            addDom: function($this) {
                $this.prev().append(
                    $addDom.replace('{{content}}', $this.data('con'))
                    .replace('{{icon}}', $this.data('icon'))
                    .replace('{{edit-dom}}', 'edit-dom')
                );
                // 富文本编辑
                Pj.inputText();
            },
            selectIcon: function($this) {
                $this.parent().prev().attr('src', $this.find('img').attr('src')).prev().val($this.data('id'));
            },
            pagingIndex: function($this, e) {
                var _p;
                if ($.getKey(e) === 13) {
                    _p = '/p/' + $this.val();
                    location.href = global.localUrl + _p;
                };
            }
        };
    })();
    Area.ini();
    // 删除
    $allWrap.on('click', '.area-del', function() {
        Area.del($(this));
    });
    // 复制
    $allWrap.on('click', '.area-copy', function() {
        Area.copy($(this));
    });
    // 添加节点
    $allWrap.on('click', '.area-add-dom', function() {
        Area.addDom($(this));
    });
    // 图标选择
    $allWrap.on('click', '.aera-icon-wrap li', function() {
        Area.selectIcon($(this));
    });
    // 翻页
    $allWrap.on('keyup', '.paging-go', function(e) {
        Area.pagingIndex($(this), e);
    });
}(jQuery);
