/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-19.
 */

;
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

! function(win, $, undefined) {
    'use strict';
    var $header = $('#header'),
        $mainNav = $('#mainNav'),
        $joinNum = $mainNav.find('.j-join-num'),
        $joinWrap = $('#joinWrap'),
        $joined = $joinWrap.find('.j-joined'),
        $joinNotice = $joinWrap.find('.j-notice'),
        _page_size = 10, // 每页加载树数量
        _join_next_page = 1, // ”已加入计划“即将加载的页数
        _tp_plan_list, // 模板字符串'已加入的计划'
        _is_ajax = true, // 是否可以发送ajax
        Project = {
            init: function() {
                // 模板字符串处理
                win.$tpDom = $('#tpJoinList');
                _tp_plan_list = win.$tpDom.html();
                win.$tpDom.remove();
                delete win.$tpDom;
                // 加载“已加入的计划”数据
                Project.loadJoin();
                // 加载”互助保障公示“数据
                Project.loadNote();
                // 已加入计划、互助保障公示地址检测
                var _url = win.location.href.replace(/#[\s\S]*$/, '') + '#';
                $mainNav.find('a').eq(0).attr('href', _url).next().attr('href', _url + 'helpToggle');
                // 加密手机号码中间四位
                var $tel = $header.find('.j-name'),
                    _tel = $tel.html();
                if (!win.G.hasNickName && /^\d{11}$/.test(_tel)) {
                    $tel.html(_tel.slice(0, 3) + "****" + _tel.slice(7, 11));
                }
                // 背景图加载
                var $head = $('#header'),
                    $img = $head.find('.j-head'),
                    _head_bg = $head.data('bg'),
                    _head_bg_css = 'url(${img}) no-repeat 50% 50%/cover #fff',
                    _bg_css = 'url(${img}) no-repeat 50% 180%/100% auto'; // 头部波纹背景CSS （动画开始位置，再toggleClass 利用transition过渡到原始CSS）
                $img.css('background', _head_bg_css.replace('${img}', $img.data('bg'))).removeAttr('data-bg');
                // 头部背景动画、用户名添加动画
                $head.css('background', _bg_css.replace('${img}', _head_bg)).removeAttr('data-bg');
                var Img = new Image();
                Img.src = _head_bg;
                var _time = setInterval(function() {
                    Img.complete && (
                        $head.addClass('header-animate'),
                        $tel.addClass('user-name-active'),
                        clearInterval(_time)
                    );
                }, 20);
            },
            loadJoin: function() {
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: win.G.baseUrl + '/plan/' + _join_next_page + '/' + _page_size,
                        dataType: 'json',
                        success: function(_data) {
                            if (_data.code === 0) {
                                Project.dataEnd();
                                // 如果是最后一页，隐藏“加载更多”按钮
                                if ((_join_next_page - 1) * _page_size + _data.data.data.length >= _data.data.count) {
                                    $joinWrap.find('.j-add-more').remove();
                                }
                                // 数据渲染
                                $joinNum.html('（' + _data.data.count + '）');
                                _data = _data.data.data;
                                var _l = _data.length,
                                    _temp_arr = [],
                                    _temp;
                                if (_l) {
                                    while (_l--) {
                                        _temp = _data[_l];
                                        // 获取已保障天数
                                        var _day,
                                            _curTime = new Date().getTime(),
                                            _joinTime = new Date(_temp.joinTime).getTime(),
                                            _activeTime = new Date(_temp.activeTime).getTime();
                                        switch (_temp.status) {
                                            case 1:
                                                _day = 180 - Math.round((_curTime - _joinTime) / 86400000);
                                                _day = '还有' + _day + '天生效';
                                                break;
                                            case 2:
                                                _day = Math.round((_curTime - _activeTime) / 86400000);
                                                _day = '已保障您' + _day + '天';
                                        }
                                        _temp_arr.push(
                                            _tp_plan_list
                                            .replace(/{{id}}/g, _temp.joinid)
                                            .replace(/{{planid}}/g, _temp.planid)
                                            .replace('{{tit}}', _temp.plan.title)
                                            .replace('{{name}}', _temp.insurerName)
                                            .replace('{{idnum}}', _temp.insurerIdcard)
                                            .replace('{{jointime}}', _temp.joinTime)
                                            .replace('{{activetime}}', (new Date(_temp.activeTime)).format('yyyy-MM-dd'))
                                            .replace('{{upmoney}}', _temp.plan.insuranceAmount)
                                            .replace('{{each-amount-poor}}', _temp.plan.securityBalance > _temp.balance ? 'each-amount-poor' : '')
                                            .replace('{{balance}}', _temp.balance)
                                            .replace('{{day}}', _day)
                                            .replace('{{status}}', _temp.statusLabel)
                                        );
                                    }
                                    if (_join_next_page === 1) {
                                        $joined.html(_temp_arr.reverse().join(''));
                                    } else {
                                        $joined.append(_temp_arr.reverse().join(''));
                                    }
                                    _join_next_page++; // 加载一下页
                                } else if (_join_next_page === 1) {
                                    $joinNotice.html('您还没有加入保障计划');
                                }
                            } else {
                                Project.dataEnd(_data.msg);
                            }
                        },
                        error: function() {
                            Project.dataEnd('网络堵塞');
                        }
                    });
                }
            },
            loginOut: function() {
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: win.G.baseUrl + '/logout',
                        dataType: 'json',
                        success: function(_data) {
                            if (_data.code === 0) {
                                Project.dataEnd();
                                win.location.href = win.G.baseUrl + '/login';
                            } else {
                                Project.dataEnd(_data.msg);
                            }
                        },
                        error: function() {
                            Project.dataEnd('网络堵塞');
                        }
                    });
                }
            },
            loadNote: function() {},
            dataEnd: function(s) {
                layer.closeAll();
                s && layer.open({ content: s });
                _is_ajax = true;
            }
        };
    // 项目初始化
    Project.init();
    /**
     * event binding
     */
    $header
        .on(win.method, '.j-out', Project.loginOut); // 注销
    $joinWrap
        .on(win.method, '.j-add-more', Project.loadJoin) // 加载更多
}(window || this, Zepto);
