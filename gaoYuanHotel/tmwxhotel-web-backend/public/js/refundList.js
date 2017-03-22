;
/**
 * created by hangyangws in 2016-05-03]
 * [退款列表查询]
 * @return {[Object - IIFE]}   [Refund - refund list]
 */

! function($) {
    "use strict";
    var $paging = $allWrap.find('.paging'), // 分页 dom
        $refundStatus = $('#refundStatus'), // 退款状态 select dom
        _page_size = 10,
        $dateWrap = $('#dateWrap'),
        $refundSearchBtn = $('#refundSearchBtn'),
        $endDate = $dateWrap.find('.end-date'),
        $startDate = $dateWrap.find('.start-date'),
        _baseUrl = '/refundOrder/list?',
        _is_ajax = true,
        Refund = {
            init: function() {
                // 页面分页
                Refund.renderPage();
                // 日期初始化
                Pj.inputDate($dateWrap);
                // 检测退款状态状态
                $refundStatus.find('option[value="' + RenderData.refundstatus + '"]').attr('selected', 'selected');
            },
            renderPage: function() {
                var _p = {
                        now: ~~RenderData.pageNum, // 现在的页数
                        total: ~~RenderData.total // 总共的数量
                    },
                    _base_url = [
                        _baseUrl,
                        RenderData.search ? ('search=' + RenderData.search + '&') : '',
                        RenderData.startdate ? ('startdate=' + RenderData.startdate + '&') : '',
                        RenderData.enddate ? ('enddate=' + RenderData.enddate + '&') : '',
                        RenderData.refundstatus ? ('refundstatus=' + RenderData.refundstatus + '&') : ''
                    ].join(''),
                    _temp = [],
                    _pages; // 总共的页数
                // 总数还不够一页显示的情况
                if (_p.total <= _page_size) {
                    $paging.addClass('none');
                    return;
                };
                // total > _page_size
                _pages = Math.ceil(_p.total / _page_size);
                if (_pages < 4) {
                    // totals 为 1 || 2 || 3
                    while (_pages) {
                        _temp.push(['<a ',
                            _p.now === _pages ? 'class="current"' : ('href=' + _base_url + 'pageIndex=' + _pages),
                            '>',
                            _pages,
                            '</a>'
                        ].join(''));
                        _pages--;
                    };
                } else {
                    // totals >= 4
                    // 下一页
                    if (_p.now !== _pages) {
                        _temp.push('<a class="next" href="' + _base_url + 'pageIndex=' + (_p.now + 1) + '">&gt;</a>');
                    };
                    // 最后一页
                    _temp.push(['<a ',
                        _p.now === _pages ? 'class="current"' : ('href=' + _base_url + 'pageIndex=' + _pages),
                        '>',
                        _pages,
                        '</a>'
                    ].join(''));
                    // ************************************************************
                    if (_p.now === _pages) {
                        _temp.push('<a>…</a>');
                        _temp.push('<a href="' + _base_url + 'pageIndex=2">2</a>');
                    } else if (_p.now === 1) {
                        _temp.push('<a href="' + _base_url + 'pageIndex=' + (_pages - 1) + '">' + (_pages - 1) + '</a>');
                        _temp.push('<a>…</a>');
                    } else {
                        if (_p.now === 2) {
                            _temp.push('<a>…</a>');
                            _temp.push('<a class="current">2</a>');
                        } else if (_p.now === _pages - 1) {
                            _temp.push('<a class="current">' + (_pages - 1) + '</a>');
                            _temp.push('<a>…</a>');
                        } else {
                            _temp.push('<a>…</a>');
                            _temp.push('<a class="current">' + _p.now + '</a>');
                            _temp.push('<a>…</a>');
                        };
                    };
                    // ************************************************************
                    // 第一页
                    _temp.push(['<a ',
                        _p.now === 1 ? 'class="current"' : ('href=' + _base_url + 'pageIndex=1'),
                        '>',
                        1,
                        '</a>'
                    ].join(''));
                    // 上一页
                    if (_p.now !== 1) {
                        _temp.push('<a class="prev" href="' + _base_url + 'pageIndex=' + (_p.now - 1) + '">&lt;</a>');
                    };
                };
                $paging.html(_temp.reverse().join(''));
            },
            pageSelect: function($this, _type) {
                var _val = $this.val(),
                    _page_obj = {
                        search: [
                            _val ? ('search=' + _val + '&') : '',
                            RenderData.startdate ? ('startdate=' + RenderData.startdate + '&') : '',
                            RenderData.enddate ? ('enddate=' + RenderData.enddate + '&') : '',
                            RenderData.refundstatus ? ('refundstatus=' + RenderData.refundstatus) : ''
                        ].join(''),
                        startdate: [
                            RenderData.search ? ('search=' + RenderData.search + '&') : '',
                            'startdate=' + _val + '&',
                            RenderData.enddate ? ('enddate=' + RenderData.enddate + '&') : '',
                            RenderData.refundstatus ? ('refundstatus=' + RenderData.refundstatus) : ''
                        ].join(''),
                        enddate: [
                            RenderData.search ? ('search=' + RenderData.search + '&') : '',
                            RenderData.startdate ? ('startdate=' + RenderData.startdate + '&') : '',
                            'enddate=' + _val + '&',
                            RenderData.refundstatus ? ('refundstatus=' + RenderData.refundstatus) : ''
                        ].join(''),
                        refundstatus: [
                            RenderData.search ? ('search=' + RenderData.search + '&') : '',
                            RenderData.startdate ? ('startdate=' + RenderData.startdate + '&') : '',
                            RenderData.enddate ? ('enddate=' + RenderData.enddate + '&') : '',
                            _val !== 'null' ? ('refundstatus=' + _val) : ''
                        ].join('')
                    };

                // 判断开始时间是否是小于结束时间
                if (_type === 'startdate' && $endDate.val() && _val > $endDate.val()) {
                    layer.alert('申请时间不能大于结束时间');
                    return;
                }
                if (_type === 'enddate' && $startDate.val() && _val < $startDate.val()) {
                    layer.alert('结束时间不能小于申请时间');
                    return;
                }

                layer.msg('搜索中…');
                location.href = _baseUrl + _page_obj[_type];
            },
            applyPass: function($this, _type) {
                var $tr = $this.closest('tr');
                if (_is_ajax) {
                    layer.confirm(_type + '退款单序列号：<b>' + $tr.data('refundsn') + '</b>', { icon: 3 }, function() {
                        _is_ajax = false;
                        layer.msg('处理中…');
                        $.ajax({
                                url: '/refundOrder/applyDeal',
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    id: $tr.data('id'),
                                    fee: $tr.data('fee'),
                                    transactionid: $tr.data('transactionid'),
                                    type: _type === '拒绝' ? 'refuse' : 'apply'
                                }
                            })
                            .done(function(_data) {
                                if (_data.status) {
                                    layer.msg('退款' + _type + '成功');
                                    // 成功 修改一些调整
                                    $this.parent().html(_type === '拒绝' ? '已拒绝' : '退款中');
                                    $tr.find('.refund-status').html(_type);
                                } else {
                                    layer.alert(_data.msg);
                                }
                                _is_ajax = true;
                            })
                            .fail(function() {
                                layer.alert('网络堵塞');
                                _is_ajax = true;
                            });
                    });
                }
            }
        };
    // 页面初始化
    Refund.init();
    // 日期改变
    $dateWrap.on('change', '.input-date', function() {
        var $this = $(this);
        Refund.pageSelect($this, $this.data('type'));
    });
    // 退款状态改变
    $refundStatus.on('change', function() {
        Refund.pageSelect($(this), 'refundstatus');
    });
    // 搜索
    $refundSearchBtn.on('click', function() {
        Refund.pageSelect($(this).prev(), 'search');
    });
    // 审批退款
    $allWrap.on('click', '.apply-pass', function() {
        Refund.applyPass($(this), '审批');
    });
    // 拒绝退款
    $allWrap.on('click', '.apply-refuse', function() {
        Refund.applyPass($(this), '拒绝');
    });
}(jQuery);
