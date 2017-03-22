/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-26.
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
    var $listWrap = $('#listWrap'),
        $footer = $('#footer'),
        _tp_list, // 奖励明细模板字符串
        _page_size = 10, // 每页加载树数量
        _next_page = 1, // 即将加载的页数
        _is_ajax = true, // 是否可以发送ajax
        _show_type = {
            '-1': 'sub',
            '0': 'gray',
            '1': 'add'
        },
        Project = {
            init: function() {
                // 加载模板字符串
                win.$tpList = $('#tpList');
                _tp_list = win.$tpList.html();
                win.$tpList.remove();
                delete win.$tpList;
                // 图片异步加载、动画处理
                var $dom = $('#header');
                Project.imgLoadCallb($dom.data('bg'), function() {
                    $dom.addClass('h-img-active').removeAttr('data-bg');
                    $dom = $dom.find('.j-b-wrap');
                    Project.imgLoadCallb($dom.data('bg'), function() {
                        $dom.addClass('balance-active').removeAttr('data-bg');
                    });
                });
                // 加载首页
                Project.loadData();
            },
            loadData: function() {
                if (_is_ajax) {
                    _is_ajax = false;
                    layer.open({ type: 2 });
                    $.ajax({
                        url: win.G.loadUrl + '/' + _next_page + '/' + _page_size,
                        dataType: 'json',
                        success: function(_data) {
                            if (_data.code === 0) {
                                // 如果是最后一页，隐藏“加载更多”按钮
                                if ((_next_page - 1) * _page_size + _data.data.data.length >= _data.data.count) {
                                    $footer.remove();
                                }
                                _data = _data.data.data;
                                var _l = _data.length, // 取到数据的长度
                                    _arr_data = [],
                                    _temp;
                                // 渲染数据
                                if (_l) {
                                    while (_l--) {
                                        _temp = _data[_l];
                                        _arr_data.push(
                                            _tp_list
                                            .replace('{{name}}', _temp.actor)
                                            .replace('{{time}}', (new Date(_temp.happenTime)).format('yyyy-MM-dd h:m:s'))
                                            .replace('{{tit}}', _temp.actDesc)
                                            .replace('{{type}}', _show_type[_temp.status])
                                            .replace('{{money}}', (_temp.amount > 0) ? ('+' + _temp.amount) : _temp.amount)
                                        );
                                    }
                                    if (_next_page === 1) {
                                        $listWrap.html(_arr_data.reverse().join(''));
                                    } else {
                                        $listWrap.append(_arr_data.reverse().join(''));
                                    }
                                    _next_page++; // 加载一下页
                                } else if (_next_page === 1) {
                                    $listWrap.html('<tr class="fc9 tac"><td>没有交易记录</td></tr>');
                                }
                                Project.dataEnd();
                            } else {
                                Project.dataEnd(_data.msg || '未知错误');
                            }
                        },
                        error: function() {
                            Project.dataEnd('网络堵塞');
                        }
                    });
                }
            },
            imgLoadCallb: function(_img_url, _callb) {
                var Img = new Image();
                Img.src = _img_url;
                var _time = setInterval(function() {
                    Img.complete && (
                        _callb(),
                        clearInterval(_time)
                    );
                }, 60);
            },
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
    // 加载更多
    $footer.on(win.method, Project.loadData);
}(window || this, Zepto);
