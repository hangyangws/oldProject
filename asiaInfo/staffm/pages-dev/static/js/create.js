/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-02-28.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $listCon = $('#listCon'),
        $perviewWrap = $('#perviewWrap'),
        $submitBtn = $('#footer').find('.j-submit-btn'), // 提交按钮
        Verify = new F.Verify($listCon), // 数据验证对象
        $supporter = $listCon.find('.j-supporter'),
        $workway = $listCon.find('.j-workway'),
        $time = { // 时间相关DOM
            start: $listCon.find('.j-start-time'),
            end: $listCon.find('.j-end-time')
        },
        _catch_data = JSON.parse(localStorage._catch_data || '{}'),
        // _catch_data:
        // {
        //     starttime: xxxx-xx-xx, // 开始时间
        //     endtime: xxxx-xx-xx, // 结束时间
        //     workWay: 0, // 工作方式
        //     supporter: 1001, // 支持者id
        //     supportDesc: xxxx // 申请备注
        // }
        _catch_supporter = JSON.parse(localStorage.supporter || '{}'),
        _local_date = null, // 保存用户相关的数据
        // _local_date:
        // {
        //     nowYear: xxxx, // 今年
        //     today: xxxx-xx-xx, // 今天
        //     tomorrow: xxxx-xx-xx, // 明天
        //     dataAlready: false // 数据是否准备好预览
        // }
        _date_start_param, // 开始时间，日历插件的数
        Project = {
            init: function() {
                var _today = Project.getYMDObj(),
                    _tomorrow = Project.getYMDObj(1);
                _tomorrow = [_tomorrow.y, _tomorrow.m, _tomorrow.d].join('-');

                // 读取缓存，初始化_catch_data参数
                (typeof _catch_data.starttime === 'undefined') && (_catch_data.starttime = _tomorrow);
                (typeof _catch_data.endtime === 'undefined') && (_catch_data.endtime = _tomorrow);
                (typeof _catch_data.workWay === 'undefined') && (_catch_data.workWay = '0');
                (typeof _catch_supporter.id !== 'undefined') && (_catch_data.supporter = _catch_supporter.id);

                // 初始化_local_date参数
                _local_date = {
                    nowYear: _today.y,
                    today: [_today.y, _today.m, _today.d].join('-'),
                    tomorrow: _tomorrow
                };

                Project.dataToCatch();

                _date_start_param = {
                    endYear: _today.y + 1,
                    startYear: _today.y,
                    theme: 'android-holo light', //皮肤样式
                    dateFormat: 'yy-mm-dd',
                    mode: 'scroller', //日期选择模式
                    display: 'modal', //显示方式
                    nowText: '今天',
                    preset: 'date',
                    showNow: true,
                    lang: 'zh',
                    onSelect: function(_date) { // 选择日期的回掉函数，_date：xxxx-xx-xx
                        if (_date < _local_date.today) { // 开始时间小于今天
                            layer.open({
                                content: '开始时间不能小于今天'
                            });
                            return;
                        }
                        if (_date > _catch_data.endtime) { // 开始时间大于结束时间，设置结束时间为后一天
                            var _next_day = new Date(_date);
                            _next_day.setDate(_next_day.getDate() + 1);
                            _next_day = _next_day.toISOString().split('T')[0]; // 得到xxx-xx-xx字符串

                            _catch_data.endtime = _next_day;
                            Project.setDate($time.end, _next_day);
                        }
                        _catch_data.starttime = _date;
                        Project.setDate($time.start, _date);

                        Project.dataToCatch();
                    }
                };

                // DOM初始化赋值
                Project.dataToDom();

                // 时间插件初始化
                Project.dateInit();
            },
            dataToDom: function() {
                // 时间
                Project.setDate($time.start, _catch_data.starttime);
                Project.setDate($time.end, _catch_data.endtime);
                // 支持人员
                $supporter.find('.j-supporter-ipt').val(_catch_supporter.id || '');
                $supporter.find('.j-supporter-name').html(_catch_supporter.name || '');
                if (_catch_supporter.desc) {
                    $supporter.find('.j-supporter-desc').removeClass('m-color').html(_catch_supporter.desc);
                } else {
                    $supporter.find('.j-supporter-desc').addClass('m-color').html('请选择需要的支持人员');
                }
                // 工作方式
                $workway.find('.j-workway-ipt:checked').removeAttr('checked');
                $workway.find('.j-workway-ipt[value="' + _catch_data.workWay + '"]').attr('checked', true);
                // 申请说明
                $listCon.find('.j-desc-ipt').val(_catch_data.supportDesc || '');
            },
            dateInit: function() {
                // 开始时间插件初始化
                $time.start.find('.j-time-ipt').scroller(_date_start_param);

                var _date_end_param = Project.cloneObj(_date_start_param);
                _date_end_param.onSelect = function(_date) {
                    if (_date < _catch_data.starttime) { // 结束时间小于今天
                        layer.open({
                            content: '结束时间不能小于开始时间'
                        });
                        return;
                    }
                    _catch_data.endtime = _date;
                    Project.setDate($time.end, _date);
                    Project.dataToCatch();
                };

                // 结束时间插件初始化
                $time.end.find('.j-time-ipt').scroller(_date_end_param);
            },
            getYMDObj: function(_day_add) {
                var _now = new Date();
                _now.setDate(_now.getDate() + (_day_add || 0));
                var _m = _now.getMonth() + 1,
                    _d = _now.getDate();
                return {
                    'y': _now.getFullYear(),
                    'm': _m < 10 ? ('0' + _m) : _m,
                    'd': _d < 10 ? ('0' + _d) : _d
                };
            },
            setDate: function($dom, _date) {
                $dom.find('.j-time-ipt').val(_date).trigger('change');
                $dom.find('.j-time-fast').html((function(_d) {
                    if (_d === _local_date.today) {
                        return '今天';
                    }
                    if (_d === _local_date.tomorrow) {
                        return '明天';
                    }
                    return ({
                        0: '周日',
                        1: '周一',
                        2: '周二',
                        3: '周三',
                        4: '周四',
                        5: '周五',
                        6: '周六'
                    })[new Date(_d).getDay()];
                })(_date));
                // 显示在Dom节点上(如果是今年就不显示年)
                _date = _date.split('-');
                _date = ((_date[0] == _local_date.nowYear) ? '' : (_date[0] + '年')) + _date[1] + '月' + _date[2] + '日';
                $dom.find('.j-time-show').html(_date);
            },
            cloneObj: function(o) {
                var _obj = {},
                    _k,
                    _val;
                (o instanceof Array) && (_obj = []);
                for (_k in o) {
                    _val = o[_k];
                    _obj[_k] = (typeof _val === 'object') ? arguments.callee(_val) : _val;
                }
                return _obj;
            },
            descListener: function() {
                _catch_data.supportDesc = $.trim(this.value);
                Project.dataToCatch();
            },
            workWayListener: function() {
                _catch_data.workWay = $workway.find('.j-workway-ipt:checked').val();
                Project.dataToCatch();
            },
            supporterPicker: function() {
                location.href = this.dataset.url + '?start=' + _catch_data.starttime + '&end=' + _catch_data.endtime;
            },
            dataToCatch: function() {
                localStorage._catch_data = JSON.stringify(_catch_data);
                Project.checkDataAlready();
            },
            checkDataAlready: function() {
                if (Project.notEmpty(_catch_data.supportDesc) && Project.notEmpty(_catch_data.supporter) && _catch_data.supportDesc.length > 5) {
                    $submitBtn.removeClass('gray');
                    _local_date.dataAlready = true;
                    return;
                }
                $submitBtn.addClass('gray');
                _local_date.dataAlready = false;
            },
            notEmpty: function(_val) {
                // 拦截null、undefine、空字符串。数字都可通过。
                if (typeof _val === 'number' || _val) {
                    return true;
                }
                return false;
            },
            preview: function() {
                if (_local_date.dataAlready) {
                    // 填充数据
                    var getWork = {
                        '0': '现场支持',
                        '1': '远程支持'
                    };
                    $perviewWrap.find('.j-perview-supporter').html(_catch_supporter.name);
                    $perviewWrap.find('.j-perview-work').html(getWork[_catch_data.workWay]);
                    $perviewWrap.find('.j-perview-supporter-desc').html(_catch_supporter.desc);
                    $perviewWrap.find('.j-perview-time').html(_catch_data.starttime.replace(/-/g, '/') + ' - ' + _catch_data.endtime.replace(/-/g, '/'));
                    $perviewWrap.find('.j-perview-desc').html(_catch_data.supportDesc);
                    $perviewWrap.parent().removeClass('none');
                }
            },
            perviewClose: function() {
                $perviewWrap.parent().addClass('none');
            },
            perviewSure: function() {
                var _data = Verify.go();
                if (_data && _local_date.dataAlready) {
                    F.ajax({
                        data: _data,
                        type: 'POST',
                        url: win.G.createUrl,
                        yes: function() {
                            // 销毁缓存数据
                            localStorage.supporter = localStorage._catch_data = '{}';
                            F.jump({
                                msg: '创建成功',
                                url: win.G.goUrl
                            });
                        }
                    });
                }
            }
        };

    Project.init();
    /**
     * event binding
     */
    $listCon
        .on('input', '.j-desc-ipt', Project.descListener) // 申请说明修改
        .on('change', '.j-workway-ipt', Project.workWayListener) // 工作方式修改
        .on(win.method, '.j-supporter', Project.supporterPicker); // 选择支持人员
    $submitBtn
        .on(win.method, Project.preview); // 预览数据
    $perviewWrap
        .on(win.method, '.j-perview-close', Project.perviewClose) // 关闭预览
        .on(win.method, '.j-perview-sure', Project.perviewSure); // 确认预览
}(window || this, jQuery);
