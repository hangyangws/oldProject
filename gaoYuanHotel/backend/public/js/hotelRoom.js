;
/**
 * [created by hangyangws in 2016-02-26]
 * [后台管理系统 - 酒店房间 - 管理]
 * @return {[Object - IIFE]}   [Room - Room list]
 */
! function($) {
    "use strict";
    var Room = (function() {
        var $paging = $allWrap.find('.paging'), // 分页的父元素
            _is_del = true, // 现在是否可以执行删除房间操作
            _is_del_rule = true, // 现在是否可以执行删除库存操作
            _is_rule = true, // 现在是否可以执行查看房间库存规则操作
            _is_save_rule = true, // 现在是否可以执行 保存 新增规则 操作
            _page_size = 10,
            _room_id, // 库存规则 房间id
            _html_rule_tr = $('#tpTr').html(),
            _html_rule_tr_ipt = $('#tpTrIpt').html(),
            _html_rule_tr_edit = $('#tpTrEdit').html(),
            _html_rule_list = $('#tpRule').html(),
            // 会员等级
            _html_member_price = $('#tpMemberPrice').html(),
            _html_each_type_price = $('#eachTypePrice').html(),
            _is_ajax = true;
        return {
            init: function() {
                // 获取酒店
                Room.getHotel();
                //是否含早
                Room.getBreakFast();
                //是否上架
                Room.getMarkeTable();
                // 页面分页
                Room.renderPage();
            },
            delRoom: function($this) {
                var $tr = $this.closest('tr');
                if (_is_del) {
                    layer.confirm('删除房间：<b class="fs16">' + $tr.data('name') + '</b>', { icon: 3 }, function() {
                        _is_del = false;
                        layer.msg('删除中…');
                        $.ajax({
                                url: '/hotelRoom/' + $tr.data('id'),
                                type: 'DELETE',
                                dataType: 'json'
                            })
                            .done(function(_d) {
                                if (_d.status) {
                                    layer.msg('删除成功');
                                    setTimeout(function() {
                                        location.reload();
                                    }, 100);
                                } else {
                                    layer.msg(_d.msg);
                                };
                                _is_del = true;
                            })
                            .fail(function() {
                                layer.alert('网络堵塞');
                                _is_del = true;
                            });
                    });
                };
            },
            search: function(_v) {
                layer.msg('搜索中…');
                var _base_url = ['/hotelRoom',
                    _v ? ('/search/' + _v + '?') : '?',
                    RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                    RenderData.ismarketable ? ('ismarketable=' + RenderData.ismarketable + '&') : '',
                    RenderData.isbreakfast ? ('isbreakfast=' + RenderData.isbreakfast) : ''
                ].join('');
                location.href = _base_url;
            },
            searchHotel: function(_id) {
                layer.msg('搜索中…');
                var _base_url = ['/hotelRoom',
                    RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                    _id !== 'null' ? ('hotelid=' + _id + '&') : '',
                    RenderData.ismarketable ? ('ismarketable=' + RenderData.ismarketable + '&') : '',
                    RenderData.isbreakfast ? ('isbreakfast=' + RenderData.isbreakfast) : ''
                ].join('');
                location.href = _base_url;
            },
            searchBF: function(_vl) {
                layer.msg('搜索中…');
                var _base_url = ['/hotelRoom',
                    RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                    RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                    RenderData.ismarketable ? ('ismarketable=' + RenderData.ismarketable + '&') : '',
                    _vl !== 'null' ? ('isbreakfast=' + _vl) : ''
                ].join('');
                location.href = _base_url;
            },
            searchMT: function(_vl) {
                layer.msg('搜索中…');
                var _base_url = ['/hotelRoom',
                    RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                    RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                    _vl !== 'null' ? ('ismarketable=' + _vl + '&') : '',
                    RenderData.ismarketable ? ('isbreakfast=' + RenderData.ismarketable) : ''
                ].join('');
                location.href = _base_url;
            },
            renderPage: function() {
                var _p = {
                        now: ~~RenderData.pageNum, // 现在的页数
                        total: ~~RenderData.total // 总共的数量
                    },
                    _base_url = ['/hotelRoom',
                        RenderData.search ? ('/search/' + RenderData.search + '?') : '?',
                        RenderData.hotelid ? ('hotelid=' + RenderData.hotelid + '&') : '',
                        RenderData.ismarketable ? ('ismarketable=' + RenderData.ismarketable + '&') : '',
                        RenderData.isbreakfast ? ('isbreakfast=' + RenderData.isbreakfast + '&') : ''
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
                        dataType: 'json'
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
                        } else {
                            // layer.alert(_data.msg);
                        };
                    })
                    .fail(function() {
                        layer.alert('网络堵塞，获取品牌失败');
                    });
            },
            getBreakFast: function() {
                $allWrap.find('.break-fast')
                    .find('option[value="' + RenderData.isbreakfast + '"]')
                    .attr('selected', 'selected');
            },
            getMarkeTable: function() {
                $allWrap.find('.marke-table')
                    .find('option[value="' + RenderData.ismarketable + '"]')
                    .attr('selected', 'selected');
            },
            initRoomRule: function($this) {
                var $tr = $this.closest('tr');
                _room_id = $tr.data('id');
                Room.getRoomRule(_room_id, 1, function(_list, _page) {
                    $mask.html(_html_rule_list
                            .replace('${RuleRoomName}', $tr.data('name'))
                            .replace('${store}', $tr.data('store'))
                            .replace('<tr tp="${RuleList}"></tr>', _list)
                            .replace('${RulePaging}', _page))
                        .fadeIn(400);
                });
            },
            getRoomRule: function(_roomId, _pageIndex, _callBack) {
                var _rule_list, // 获取数据库存规则列表
                    _list_l, // 库存列表长度
                    _temp_list = ['<tr class="no-data"><td colspan="4">没有取到任何数据</td></tr>'], // 列表数据转换为 html 字符串
                    _list_now, // 当前遍历到的列表
                    _total = 0;
                if (_is_rule) {
                    _is_rule = false;
                    layer.msg('操作中…');
                    $.ajax({
                            url: '/roomRule?roomid=' + _roomId + '&pageIndex=' + _pageIndex + '&pageSize=' + _page_size,
                            type: 'GET',
                            dataType: 'json'
                        })
                        .done(function(_d) {
                            if (_d.status) {
                                // 判断是否有数据
                                if (_d.msg !== '没有取到任何数据') {
                                    // 渲染列表
                                    _rule_list = _d.data.data.list;
                                    _list_l = _rule_list.length;
                                    _temp_list = [];
                                    _list_now;
                                    while (_list_l--) {
                                        _list_now = _rule_list[_list_l];
                                        _temp_list.push(['<tr data-id="' + _list_now.id + '">',
                                            '<td class="start-date">' + _list_now.startdate.slice(0, 10) + '</td>',
                                            '<td class="end-date">' + _list_now.enddate.slice(0, 10) + '</td>',
                                            '<td class="store">' + _list_now.store + '</td>',
                                            '<td>',
                                            '<span class="rule-edit dlb cp mr15">编辑</span>',
                                            '<span class="rule-del dlb cp">删除</span>',
                                            '</td>',
                                            '</tr>'
                                        ].join(''));
                                    }
                                    _total = _d.data.data.total;
                                }

                                layer.closeAll();
                                _callBack(_temp_list.join(''), Room.renderPageRule(_total, _pageIndex));
                                _is_rule = true;
                            } else {
                                layer.alert(_d.msg);
                                _is_rule = true;
                            };
                        })
                        .fail(function() {
                            layer.alert('网络堵塞');
                            _is_rule = true;
                        });
                }
            },
            renderPageRule: function(_total, _now_page_rule) {
                var _p = {
                        now: _now_page_rule, // 现在的页数
                        total: _total // 总共的数量
                    },
                    _temp = [],
                    _pages; // 总共的页数
                // 总数还不够一页显示的情况
                if (_p.total <= _page_size) {
                    return '';
                };
                // total > _page_size
                _pages = Math.ceil(_p.total / _page_size);
                if (_pages < 4) {
                    // totals 为 1 || 2 || 3
                    while (_pages) {
                        _temp.push(['<a ',
                            _p.now === _pages ? 'class="current"' : ('data-p=' + _pages),
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
                        _temp.push('<a class="next" data-p="' + (_p.now + 1) + '">&gt;</a>');
                    };
                    // 最后一页
                    _temp.push(['<a ',
                        _p.now === _pages ? 'class="current"' : ('data-p=' + _pages),
                        '>',
                        '</a>'
                    ].join(''));
                    // ************************************************************
                    if (_p.now === _pages) {
                        _temp.push('<a>…</a>');
                        _temp.push('<a data-p="2">2</li>');
                    } else if (_p.now === 1) {
                        _temp.push('<a data-p="' + (_pages - 1) + '">' + (_pages - 1) + '</a>');
                        _temp.push('<a>…</a>');
                    } else {
                        if (_p.now === 2) {
                            _temp.push('<a>…</a>');
                            _temp.push('<a class="current">2</a>');
                        } else if (_p.now === _pages - 1) {
                            _temp.push('<li class="current">' + (_pages - 1) + '</li>');
                            _temp.push('<li>…</li>');
                        } else {
                            _temp.push('<li>…</li>');
                            _temp.push('<li class="current">' + _p.now + '</li>');
                            _temp.push('<li>…</li>');
                        };
                    };
                    // ************************************************************
                    // 第一页
                    _temp.push(['<a ',
                        _p.now === 1 ? 'class="current"' : ('data-p=1'),
                        '>',
                        '</a>'
                    ].join(''));
                    // 上一页
                    if (_p.now !== 1) {
                        _temp.push('<a class="prev" data-p="' + (_p.now - 1) + '">&lt;</a>');
                    };
                };
                return _temp.reverse().join('');
            },
            closeRule: function() {
                $mask.fadeOut(400, function() { $mask.html(''); });
            },
            addRule: function($this) {
                if ($this.is('.disabled')) {
                    $this.removeClass('disabled');
                    $mask.find('.add-rule-tr').addClass('none');
                } else {
                    $this.addClass('disabled');
                    $mask.find('.add-rule-tr').removeClass('none');
                };
            },
            saveRule: function(_type, $this) {
                // _type = update OR add
                var _data = { roomid: _room_id },
                    $tr = $this.closest('tr'),
                    $tbody = $tr.parent(),
                    $ipt = $tr.find('input'),
                    _ipt_l = $ipt.length,
                    _val,
                    _url = '/roomRule/save',
                    _ajax_type = 'POST',
                    _dateReg = /\d{4}-\d{2}-\d{2}/;
                if (_is_save_rule) {
                    _is_save_rule = false;
                    // get 数据 (检测是否为空)
                    while (_ipt_l--) {
                        _val = $.trim($ipt.eq(_ipt_l).val());
                        if (_val) {
                            _data[$ipt.eq(_ipt_l).data('name')] = _val;
                        } else {
                            layer.alert($ipt.eq(_ipt_l).data('tit') + '不能为空');
                            _is_save_rule = true;
                            return;
                        }
                    }
                    // 验证时间个格式
                    if (!_dateReg.test(_data.startdate) || !_dateReg.test(_data.enddate)) {
                        layer.alert('日期格式错误，请填写：xxxx-xx-xx 的日期格式');
                        _is_save_rule = true;
                        return;
                    }
                    // 验证日期正确性
                    if (_data.startdate > _data.enddate) {
                        layer.alert('开始时间不能大于结束时间');
                        _is_save_rule = true;
                        return;
                    }
                    // 验证开始时间是否小于今天
                    if (_data.startdate < Pj.getDate()) {
                        layer.alert('开始时间不能小于今天');
                        _is_save_rule = true;
                        return;
                    }

                    // 数据调整
                    _data.startdate = _data.startdate + ' 00:00:00';
                    _data.enddate = _data.enddate + ' 00:00:00';
                    if (_type === 'update') {
                        _data.id = $tr.data('id');
                        _url = '/roomRule/update';
                        _ajax_type = 'PUT';
                    };

                    layer.msg('保存中…');
                    $.ajax({
                            url: _url,
                            type: _ajax_type,
                            dataType: 'json',
                            data: _data,
                        })
                        .done(function(_d) {
                            if (_d.status) {
                                layer.msg('保存成功');
                                if (_type === 'update') {
                                    // 给原始tr修改值
                                    $tbody
                                        .find('tr[data-id="' + $tr.data('id') + '"]')
                                        .eq(0) // 被隐藏的 tr 节点
                                        .find('.start-date').html(_data.startdate.slice(0, 10)).end()
                                        .find('.end-date').html(_data.enddate.slice(0, 10)).end()
                                        .find('.store').html(_data.store).end()
                                        .removeClass('none');
                                    $tr.remove();
                                } else {
                                    // 删除<tr>没有取到任何数据</tr>
                                    $tbody.find('.no-data').remove();

                                    // 复位带有input的 tr
                                    $mask.find('.add-rule-tr')
                                        .addClass('none')
                                        .html(_html_rule_tr_ipt) // 置空 input val 值
                                        // 回写页面
                                        .after(_html_rule_tr
                                            .replace('${trId}', _data.roomid)
                                            .replace('${trStartDate}', _data.startdate.slice(0, 10))
                                            .replace('${trEtartDate}', _data.enddate.slice(0, 10))
                                            .replace('${trStore}', _data.store));
                                    // 复位按钮
                                    $mask.find('.add-rule').removeClass('disabled');
                                }
                            } else {
                                layer.alert(_d.msg);
                            }
                            _is_save_rule = true;
                        })
                        .fail(function() {
                            layer.alert('网络堵塞');
                            _is_save_rule = true;
                        });
                }
            },
            delRule: function($this) {
                var $tr = $this.closest('tr');
                if (_is_del_rule) {
                    layer.confirm('删除库存规则', { icon: 3 }, function(index) {
                        layer.close(index);
                        _is_del_rule = false;
                        layer.msg('删除中…');
                        // 因为没有做房间所以还没有做删除****************
                        layer.alert('此功能暂时未开通');
                        _is_del_rule = true;
                        return;
                        // **********************************************
                        $.ajax({
                                url: '/hotelRoomDelete/' + $tr.data('id'),
                                type: 'DELETE',
                                dataType: 'json'
                            })
                            .done(function(_d) {
                                if (_d.status) {
                                    layer.msg('删除成功');
                                    $tr.remove()
                                } else {
                                    layer.msg(_d.msg);
                                };
                                _is_del_rule = true;
                            })
                            .fail(function() {
                                layer.alert('网络堵塞');
                                _is_del_rule = true;
                            });
                    });
                };
            },
            editRule: function($this) {
                var $tr = $this.closest('tr');
                $tr.after(
                    _html_rule_tr_edit
                    .replace('${trId}', $tr.data('id'))
                    .replace('${trStartDate}', $tr.find('.start-date').html())
                    .replace('${trEndDate}', $tr.find('.end-date').html())
                    .replace('${trStore}', $tr.find('.store').html())
                ).addClass('none');
            },
            rulePage: function($this) {
                var _p = $this.data('p');
                if (_p) {
                    Room.getRoomRule(_room_id, _p, function(_list, _page) {
                        $mask.find('.add-rule-tr')
                            .siblings().remove().end()
                            .after(_list);
                        $mask.find('.paging').html(_page);
                    });
                }
            },
            renderMemberRank: function($this) {
                var $tr = $this.closest('tr'),
                    _list = [],
                    _temp = null,
                    _l = 0;
                if (_is_ajax) {
                    _is_ajax = false;
                    _room_id = $tr.data('id');
                    layer.msg('获取会员价格…');
                    $.ajax({
                            url: '/hotelRoom/getMemberRank',
                            type: 'POST',
                            dataType: 'json',
                            data: { roomid: _room_id },
                        })
                        .done(function(_data) {
                            if (_data.status) {
                                layer.closeAll();
                                // 拼接会员价格列表
                                if (_data.msg !== '没有取到任何数据') {
                                    _l = _data.data.length;
                                    while (_l--) {
                                        _temp = _data.data[_l];
                                        _list.push(_html_each_type_price
                                            .replace('${memberrankid}', _temp.memberrankid)
                                            .replace(/\${price}/g, _temp.price)
                                            .replace('${id}', _temp.id)
                                            .replace('${rankname}', _temp.rankname));
                                    }
                                }
                                $mask.html(_html_member_price
                                        .replace('${roomName}', $tr.data('name'))
                                        .replace('${ordinaryPrice}', $tr.data('price'))
                                        .replace('<tr tp="${eachTypePrice}"></tr>', _list.length ? _list.join('') : ''))
                                    .fadeIn(400);
                            } else {
                                layer.alert(_data.msg);
                            }
                            _is_ajax = true;
                        })
                        .fail(function() {
                            layer.alert('网络堵塞');
                            _is_ajax = true;
                        });
                }
            },
            // 获取会员等级列表
            getMemberRankList: function($this) {
                var $tr = $this.closest('tr'),
                    _list = [],
                    _temp = null,
                    _l = 0;
                if (_is_ajax) {
                    _is_ajax = false;
                    _room_id = $tr.data('id');
                    layer.msg('获取会员等级列表…');
                    // 获取会员等级列表
                    $.ajax({
                            url: '/hotelMemberrank?isPage=false',
                            dataType: 'json'
                        })
                        .done(function(_data) {
                            if (_data.status) {
                                // 拼接会员价格列表（还没有显示价格）
                                if (_data.msg !== '没有取到任何数据') {
                                    _l = _data.data.data.list.length;
                                    while (_l--) {
                                        _temp = _data.data.data.list[_l];
                                        _list.push(_html_each_type_price
                                            .replace(/\${memberrankid}/g, _temp.id)
                                            .replace('${rankname}', _temp.name));
                                    }
                                }

                                $mask.html(_html_member_price
                                    .replace('${roomName}', $tr.data('name'))
                                    .replace('${ordinaryPrice}', $tr.data('price'))
                                    .replace('<tr tp="${eachTypePrice}"></tr>', _list.length ? _list.reverse().join('') : ''));

                                if (_data.msg !== '没有取到任何数据') {
                                    // 获取当前房间会员等级价格列表
                                    $.ajax({
                                            url: '/hotelRoom/getMemberRank',
                                            type: 'POST',
                                            dataType: 'json',
                                            data: { roomid: _room_id },
                                        })
                                        .done(function(_data) {
                                            if (_data.status) {
                                                layer.closeAll();
                                                // 拼接会员价格列表
                                                if (_data.msg !== '没有取到任何数据') {
                                                    _l = _data.data.length;
                                                    while (_l--) {
                                                        _temp = _data.data[_l];
                                                        $mask.find('.' + _temp.memberrankid).attr({
                                                            'data-price': _temp.price,
                                                            'data-id': _temp.id
                                                        }).find('.price-ipt').val(_temp.price);
                                                    }
                                                }
                                                $mask.fadeIn(400);
                                            } else {
                                                layer.alert(_data.msg);
                                            }
                                            _is_ajax = true;
                                        })
                                        .fail(function() {
                                            layer.alert('网络堵塞');
                                            _is_ajax = true;
                                        });
                                }
                            } else {
                                layer.alert(_data.msg);
                                _is_ajax = true;
                            }
                        })
                        .fail(function() {
                            layer.alert('网络堵塞');
                            _is_ajax = true;
                        });
                }
            },
            priceUpdate: function($this) {
                var $tr = $this.closest('tr'),
                    _to_price = +$tr.find('.price-ipt').val();
                // 检测价格是否小于0
                if (_to_price <= 0) {
                    layer.alert('价格不能小于0或为空');
                    return;
                }

                // 还需要判断和上下的价格比较
                // --------------------------

                if (_is_ajax) {
                    _is_ajax = false;
                    layer.msg('操作中…');
                    $.ajax({
                            url: '/hotelRoom/priceUpdate',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                id: $tr.data('id'),
                                roomid: _room_id,
                                price: _to_price,
                                memberrankid: $tr.data('memberrankid'),
                                type: $tr.data('price') ? 'update' : 'add'
                            }
                        })
                        .done(function(_data) {
                            if (_data.status) {
                                layer.alert('操作成功');
                                // 如果是新增 则 增加id
                                !$tr.data('price') && $tr.attr('data-id', _data.id);

                                $tr.attr('data-price', _to_price);
                            } else {
                                layer.alert(_data.msg);
                            }
                            _is_ajax = true;
                        })
                        .fail(function() {
                            layer.alert('网络堵塞');
                            _is_ajax = true;
                        });
                }
            },
            priceDelete: function($this) {
                var $tr = $this.closest('tr');
                if (_is_ajax) {
                    layer.confirm('如果删除该会员等级价格，则此会员等级价格为默认价格，请问是否确认删除？', { icon: 3 }, function() {
                        _is_ajax = false;
                        layer.msg('操作中…');
                        $.ajax({
                                url: '/hotelRoom/priceDelete',
                                type: 'POST',
                                dataType: 'json',
                                data: { id: $tr.data('id') }
                            })
                            .done(function(_data) {
                                if (_data.status) {
                                    $tr.removeAttr('data-price data-id').find('.price-ipt').val('');
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
    })();
    // 页面初始化
    Room.init();
    // 删除房间
    $allWrap.on('click', '.room-del', function() {
        Room.delRoom($(this));
    });
    // 酒店 搜索
    $allWrap.on('change', '.hotel-list', function() {
        Room.searchHotel($(this).val());
    });
    // 是否含早 搜索
    $allWrap.on('change', '.break-fast', function() {
        Room.searchBF($(this).val());
    });
    // 是否上架 搜索
    $allWrap.on('change', '.marke-table', function() {
        Room.searchMT($(this).val());
    });
    // 关键字 搜索
    $allWrap.on('click', '.room-search-btn', function() {
        Room.search($.trim($(this).prev().val()));
    });
    /**
     * 房间定制规则
     */
    // 查看库存规则
    $allWrap.on('click', '.room-rule', function() {
        Room.initRoomRule($(this));
    });
    // 关闭库存规则
    $mask.on('click', '.close-rule', function() {
        Room.closeRule();
    });
    // 新增库存规则
    $mask.on('click', '.add-rule', function() {
        Room.addRule($(this));
    });
    // 保存新增库存规则
    $mask.on('click', '.rule-save', function() {
        Room.saveRule('add', $(this));
    });
    // 删除库存
    $mask.on('click', '.rule-del', function() {
        Room.delRule($(this));
    });
    // 编辑库存
    $mask.on('click', '.rule-edit', function() {
        Room.editRule($(this));
    });
    // 保存 - 编辑库存
    $mask.on('click', '.rule-save-update', function() {
        Room.saveRule('update', $(this));
    });
    // 库存分页
    $mask.on('click', '.paging a', function() {
        Room.rulePage($(this));
    });
    // 查看会员价格
    $allWrap.on('click', '.member-price', function() {
        // Room.renderMemberRank($(this));
        Room.getMemberRankList($(this));
    });
    // 修改会员类型价格
    $mask.on('click', '.price-update', function() {
        Room.priceUpdate($(this));
    });
    // 删除会员类型价格
    $mask.on('click', '.price-delete', function() {
        Room.priceDelete($(this));
    });
}(jQuery);
