;
/**
 * [created by Tanner in 2016-03-21]
 * [modify by hangyangws in 2016-04-23]
 * [后台管理系统 - 酒店房间 - 管理]
 * @return {[Object - IIFE]}   [RoomOrderOrder - RoomOrder list]
 */

! function($) {
    "use strict";
    var $pagingLog = $mask.find('.paging'), // 订单日志分页 dom
        $dateWrap = $('#dateWrap'), // 日期选择 selectWrap dom
        RoomOrder = (function() {
            var $paging = $allWrap.find('.paging'), // 分页的父元素
                _page_size = 10,
                _html_log_list = $('#tpLog').html,
                _is_ajax = true,
                $logTbody = $mask.find('tbody'),
                $indate = $dateWrap.find('.indate'),
                $outdate = $dateWrap.find('.outdate'),
                $roomordersn = $mask.find('.roomordersn'), // 订单序列号
                _log_template = $('#orderLogsTP').html(), // orderLogs 模板字符串
                _log_id = null, // 当前查看日志的id
                _log_roomordersn = null, // 当前查看日志的roomordersn
                orderStatusEx = {
                    '10': ['已确认', '支付', 30],
                    '30': ['已支付', '入住', 50],
                    '50': ['已入住', '离店', 60],
                    '60': ['已离店', '已完成', 90]
                };
            return {
                init: function() {
                    // 获取酒店
                    RoomOrder.getHotel();
                    // 检测订单状态 支付状态
                    RenderData.orderstatus && $allWrap.find('.order-status-list').find('option[value="' + RenderData.orderstatus + '"]').attr('selected', 'selected');
                    RenderData.paymentstatus && $allWrap.find('.payment-status-list').find('option[value="' + RenderData.paymentstatus + '"]').attr('selected', 'selected');
                    // 页面分页
                    RoomOrder.renderPage();
                    // 日期初始化
                    Pj.inputDate($dateWrap);
                },
                search: function(_v) {
                    layer.msg('搜索中…');
                    var _base_url = ['/roomOrder',
                        _v ? ('/search/' + _v + '?') : '?',
                        RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                        RenderData.roomid ? ('roomid=' + RenderData.roomid + '&') : '',
                        RenderData.indate ? ('indate=' + RenderData.indate + '&') : '',
                        RenderData.outdate ? ('outdate=' + RenderData.outdate + '&') : '',
                        RenderData.orderstatus ? ('orderstatus=' + RenderData.orderstatus + '&') : '',
                        RenderData.paymentstatus ? ('paymentstatus=' + RenderData.paymentstatus) : ''
                    ].join('');
                    location.href = _base_url;
                },
                searchHotel: function(_id) {
                    layer.msg('搜索中…');
                    var _base_url = ['/roomOrder',
                        RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                        _id !== 'null' ? ('hotelid=' + _id + '&') : '',
                        RenderData.roomid ? ('roomid=' + RenderData.roomid + '&') : '',
                        RenderData.indate ? ('indate=' + RenderData.indate + '&') : '',
                        RenderData.outdate ? ('outdate=' + RenderData.outdate + '&') : '',
                        RenderData.orderstatus ? ('orderstatus=' + RenderData.orderstatus + '&') : '',
                        RenderData.paymentstatus ? ('paymentstatus=' + RenderData.paymentstatus) : ''
                    ].join('');
                    location.href = _base_url;
                },
                searchRoom: function(_vl) {
                    layer.msg('搜索中…');
                    var _base_url = ['/roomOrder',
                        RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                        RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                        _vl !== 'null' ? ('roomid=' + _vl + '&') : '',
                        RenderData.indate ? ('indate=' + RenderData.indate + '&') : '',
                        RenderData.outdate ? ('outdate=' + RenderData.outdate + '&') : '',
                        RenderData.orderstatus ? ('orderstatus=' + RenderData.orderstatus + '&') : '',
                        RenderData.paymentstatus ? ('paymentstatus=' + RenderData.paymentstatus) : ''
                    ].join('');
                    location.href = _base_url;
                },
                searchIndate: function(_vl) {
                    layer.msg('搜索中…');
                    var _base_url = ['/roomOrder',
                        RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                        RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                        RenderData.roomid ? ('roomid=' + RenderData.roomid + '&') : '',
                        _vl ? ('indate=' + _vl + '&') : '',
                        RenderData.outdate ? ('outdate=' + RenderData.outdate + '&') : '',
                        RenderData.orderstatus ? ('orderstatus=' + RenderData.orderstatus + '&') : '',
                        RenderData.paymentstatus ? ('paymentstatus=' + RenderData.paymentstatus) : ''
                    ].join('');

                    // 比较时间大小
                    if (_vl && $outdate.val() && _vl > $outdate.val()) {
                        layer.alert('入住时间不能大于离店时间');
                        return;
                    }
                    location.href = _base_url;
                },
                searchOutdate: function(_vl) {
                    layer.msg('搜索中…');
                    var _base_url = ['/roomOrder',
                        RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                        RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                        RenderData.roomid ? ('roomid=' + RenderData.roomid + '&') : '',
                        RenderData.indate ? ('indate=' + RenderData.indate + '&') : '',
                        _vl ? ('outdate=' + _vl + '&') : '',
                        RenderData.orderstatus ? ('orderstatus=' + RenderData.orderstatus + '&') : '',
                        RenderData.paymentstatus ? ('paymentstatus=' + RenderData.paymentstatus) : ''
                    ].join('');

                    // 比较时间大小
                    if (_vl && $indate.val() && _vl < $indate.val()) {
                        layer.alert('离店时间不能小于于龙入住时间');
                        return;
                    }
                    location.href = _base_url;
                },
                searchOrderstatus: function(_vl) {
                    layer.msg('搜索中…');
                    var _base_url = ['/roomOrder',
                        RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                        RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                        RenderData.roomid ? ('roomid=' + RenderData.roomid + '&') : '',
                        RenderData.indate ? ('indate=' + RenderData.indate + '&') : '',
                        RenderData.outdate ? ('outdate=' + RenderData.outdate + '&') : '',
                        _vl !== 'null' ? ('orderstatus=' + _vl + '&') : '',
                        RenderData.paymentstatus ? ('paymentstatus=' + RenderData.paymentstatus) : ''
                    ].join('');
                    location.href = _base_url;
                },
                searchPaymentstatus: function(_vl) {
                    layer.msg('搜索中…');
                    var _base_url = ['/roomOrder',
                        RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                        RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                        RenderData.roomid ? ('roomid=' + RenderData.roomid + '&') : '',
                        RenderData.indate ? ('indate=' + RenderData.indate + '&') : '',
                        RenderData.outdate ? ('outdate=' + RenderData.outdate + '&') : '',
                        RenderData.orderstatus ? ('orderstatus=' + RenderData.orderstatus + '&') : '',
                        _vl !== 'null' ? ('paymentstatus=' + _vl) : ''
                    ].join('');
                    location.href = _base_url;
                },
                renderPage: function() {
                    var _p = {
                            now: ~~RenderData.pageNum, // 现在的页数
                            total: ~~RenderData.total // 总共的数量
                        },
                        _base_url = ['/roomOrder',
                            (RenderData.search ? ('/search/' + RenderData.search + '?') : '?'),
                            (RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : ''),
                            (RenderData.roomid ? ('roomid=' + RenderData.roomid + '&') : ''),
                            (RenderData.indate ? ('indate=' + RenderData.indate + '&') : ''),
                            (RenderData.outdate ? ('outdate=' + RenderData.outdate + '&') : ''),
                            (RenderData.orderstatus ? ('orderstatus=' + RenderData.orderstatus + '&') : ''),
                            (RenderData.paymentstatus ? ('paymentstatus=' + RenderData.paymentstatus + '&') : '')
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
                getHotel: function() {
                    $.ajax({
                            url: '/hotel?isPage=false',
                            dataType: 'json',
                            type: 'GET'
                        })
                        .done(function(_data) {
                            if (_data.msg === '获取数据正常') {
                                var _hotel_list = _data.data.data.list,
                                    _list_l = _hotel_list.length,
                                    _list_dom = ['<option value="null">选择酒店</option>'];
                                while (_list_l--) {
                                    _list_dom.push(['<option value="',
                                        _hotel_list[_list_l].id,
                                        '"',
                                        RenderData.hotelid === _hotel_list[_list_l].id ? ' selected="selected"' : '',
                                        '>',
                                        _hotel_list[_list_l].name,
                                        '</option>'
                                    ].join(''));
                                };
                                $allWrap.find('.hotel-list').html(_list_dom.join(''));

                                // 判断当前是否选择酒店
                                RenderData.hotelid && RoomOrder.getRoom(RenderData.hotelid);
                            };
                        });
                },
                getRoom: function(_id) {
                    $.ajax({
                            url: '/hotelRoom?isPage=false&hotelid=' + _id,
                            dataType: 'json'
                        })
                        .done(function(_data) {
                            if (_data.msg === '获取数据正常') {
                                var _hotel_list = _data.data.data.list,
                                    _list_l = _hotel_list.length,
                                    _list_dom = ['<option value="null">选择房间</option>'];
                                while (_list_l--) {
                                    _list_dom.push(['<option value="',
                                        _hotel_list[_list_l].id,
                                        '"',
                                        RenderData.roomid === _hotel_list[_list_l].id ? ' selected="selected"' : '',
                                        '>',
                                        _hotel_list[_list_l].name,
                                        '</option>'
                                    ].join(''));
                                };
                                $allWrap.find('.room-list').html(_list_dom.join(''));
                            }
                        });
                },
                modifyOrder: function($this) {
                    var $tr = $this.closest('tr'),
                        _status = $this.attr('data-status'),
                        _name = $this.html();
                    if (_is_ajax && _status !== 90) {
                        layer.confirm('订单：<b class="fs16">' + $tr.data('roomordersn') + ' </b>' + _name, { icon: 0 }, function() {
                            _is_ajax = false;
                            layer.msg('处理中…');
                            $.ajax({
                                    url: '/roomOrder/modifyOrder',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        id: $tr.data('id'),
                                        roomid: $tr.data('roomid'),
                                        indate: $tr.data('indate'),
                                        outdate: $tr.data('outdate'),
                                        paymentamount: $tr.data('paymentamount'),
                                        roomordersn: $tr.data('roomordersn'),
                                        status: _status
                                    }
                                })
                                .done(function(_data) {
                                    if (_data.status) {
                                        $tr.find('.order-status').html(orderStatusEx[_status][0]);
                                        $this.html(orderStatusEx[_status][1]).attr('data-status', orderStatusEx[_status][2]);
                                        layer.msg(_name + '操作成功');
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
                },
                orderLog: function($this) {
                    var $tr = $this.closest('tr');
                    _log_id = $tr.data('id');
                    _log_roomordersn = $tr.data('roomordersn');
                    RoomOrder.renderOrderLog(1);
                },
                renderOrderLog: function(_page) {
                    var _logs = null,
                        _temp_log_html = [];
                    if (_is_ajax) {
                        _is_ajax = false;
                        layer.msg('处理中…');
                        $.ajax({
                                url: '/roomOrder/getLog',
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    id: _log_id,
                                    count: _page_size,
                                    pageNum: _page
                                }
                            })
                            .done(function(_d) {
                                if (_d.status) {
                                    _logs = _d.data;
                                    // 拼接数据
                                    while (_logs.count--) {
                                        _temp_log_html.push(
                                            _log_template
                                            .replace('${createdate}', _logs.list[_logs.count].createdate)
                                            .replace('${info}', _logs.list[_logs.count].info)
                                        );
                                    }
                                    // 推入数据
                                    $logTbody.html(_temp_log_html.join(''));
                                    // 修改订单序列号
                                    $roomordersn.html(_log_roomordersn);
                                    // 设置分页
                                    RoomOrder.renderLogPage(_logs.pageNum, _logs.total);
                                    // 关闭提示窗口
                                    layer.closeAll();
                                    // 显示弹出
                                    $mask.fadeIn(400);
                                } else {
                                    layer.alert(_d.msg)
                                }
                                _is_ajax = true;
                            })
                            .fail(function() {
                                layer.alert('网络堵塞');
                                _is_ajax = true;
                            });
                    }
                },
                renderLogPage: function(_pageNum, _total) {
                    // _total: 数据总数， _pageNum: 当前页数
                    var _temp = [],
                        _pages = Math.ceil(_total / _page_size); // 总页数
                    // 总数还不够一页显示的情况
                    if (_total <= _page_size) {
                        $pagingLog.addClass('none');
                        return;
                    };
                    // _total > _page_size
                    if (_pages < 4) {
                        // totals 为 1 || 2 || 3
                        while (_pages) {
                            _temp.push(['<span ',
                                _pageNum === _pages ? 'class="current"' : ('data-p="' + _pages + '"'),
                                '>',
                                _pages,
                                '</span>'
                            ].join(''));
                            _pages--;
                        };
                    } else {
                        // totals >= 4
                        // 下一页
                        if (_pageNum !== _pages) {
                            _temp.push('<span class="next" data-p="' + (_pageNum + 1) + '">&gt;</span>');
                        };
                        // 最后一页
                        _temp.push(['<span ',
                            _pageNum === _pages ? 'class="current"' : ('data-p="' + _pages + '"'),
                            '>',
                            _pages,
                            '</span>'
                        ].join(''));
                        // ************************************************************
                        if (_pageNum === _pages) {
                            _temp.push('<span>…</span>');
                            _temp.push('<span data-p="2">2</span>');
                        } else if (_pageNum === 1) {
                            _temp.push('<span data-p="' + (_pages - 1) + '">' + (_pages - 1) + '</span>');
                            _temp.push('<span>…</span>');
                        } else {
                            if (_pageNum === 2) {
                                _temp.push('<span>…</span>');
                                _temp.push('<span class="current">2</span>');
                            } else if (_pageNum === _pages - 1) {
                                _temp.push('<span class="current">' + (_pages - 1) + '</span>');
                                _temp.push('<span>…</span>');
                            } else {
                                _temp.push('<span>…</span>');
                                _temp.push('<span class="current">' + _pageNum + '</span>');
                                _temp.push('<span>…</span>');
                            };
                        };
                        // ************************************************************
                        // 第一页
                        _temp.push(['<span ',
                            _pageNum === 1 ? 'class="current"' : 'data-p="1"',
                            '>',
                            1,
                            '</span>'
                        ].join(''));
                        // 上一页
                        if (_pageNum !== 1) {
                            _temp.push('<span class="prev" data-p="' + (_pageNum - 1) + '">&lt;</span>');
                        };
                    };
                    $pagingLog.html(_temp.reverse().join(''));
                },
                closeLog: function() {
                    $mask.fadeOut(400, function() {
                        $logTbody.html('');
                    });
                }
            };
        })();
    // 页面初始化
    RoomOrder.init();
    // 酒店 搜索
    $allWrap.on('change', '.hotel-list', function() {
        RoomOrder.searchHotel($(this).val());
    });
    // 支付状态 搜索
    $allWrap.on('change', '.payment-status-list', function() {
        RoomOrder.searchPaymentstatus($(this).val());
    });
    // 订单状态 搜索
    $allWrap.on('change', '.order-status-list', function() {
        RoomOrder.searchOrderstatus($(this).val());
    });
    // 入店时间 搜索
    $dateWrap.on('change', '.indate', function() {
        RoomOrder.searchIndate($(this).val());
    });
    // 离店时间 搜索
    $dateWrap.on('change', '.outdate', function() {
        RoomOrder.searchOutdate($(this).val());
    });
    // 关键字 搜索
    $allWrap.on('click', '.roomorder-search-btn', function() {
        RoomOrder.search($.trim($(this).prev().val()));
    });
    // 房间 搜索
    $allWrap.on('change', '.room-list', function() {
        RoomOrder.searchRoom($(this).val());
    });
    // 订单 入住 or 离店 操作
    $allWrap.on('click', '.room-rule', function() {
        RoomOrder.modifyOrder($(this));
    });
    // 查看订单日志
    $allWrap.on('click', '.room-order-sn', function() {
        RoomOrder.orderLog($(this));
    });
    // 关闭订单日志列表
    $mask.on('click', '.close-rule', function() {
        RoomOrder.closeLog();
    });
    // 订单日志分页点击
    $pagingLog.on('click', 'span', function() {
        var _p = $(this).data('p');
        _p && RoomOrder.renderOrderLog(_p);
    });
}(jQuery);
