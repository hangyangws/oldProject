/**
 * [created by hangyangw in 2016-03-04]
 * @return {[Brand]} [Object]
 */
! function($) {
    "use strict";
    var $main = $('#main'),
        $cityWrap = $('#choiceCity'), // 城市列表父级元素
        Brand = (function() {
            var $brand = $('#brand'), // 品牌
                $figure = $brand.find('.brand-img'), // 轮播图
                $name = $brand.find('.brand-name'), // 品牌名称
                $startTime = $main.find('.start-time-ipt'), // 开始时间input输入框
                $startTimeShow = $main.find('.start-time-show'), // 开始时间
                $endTime = $main.find('.end-time-ipt'), // 结束时间input输入框
                $endTimeShow = $main.find('.end-time-show'), // 结束时间
                $allTime = $main.find('.all-time'), // 显示用户一共选择的天数
                $city = $main.find('.city'),
                $cityList = $cityWrap.find('ul'),
                _user_city, // 用户所在城市名
                _now = new Date(),
                _now_date, // 今天的日期： 0000-12-31
                _date_obj = { // 日历插件需要的参数
                    dateFormat: 'yy-mm-dd',
                    startYear: _now.getFullYear(),
                    endYear: _now.getFullYear() + 2,
                    lang: 'zh',
                    onSelect: function(_date) { // 选择日期的回掉函数（开始时间）
                        if (_date < _now_date) { // 开始时间小于今天
                            layer.open({
                                content: '入住时间不能小于今天'
                            });
                            return;
                        }
                        if (_date >= _post_data.outdate) { // 开始时间大于离店时间
                            layer.open({
                                content: '入住时间不能大于等于离店时间'
                            });
                            return;
                        }
                        _post_data.indate = _date;
                        $startTimeShow.html(_date.replace('-', '年').replace('-', '月') + '日');
                        // 计算中间天数
                        $allTime.html('共' + Brand.dateDiff(_post_data.indate, _post_data.outdate) + '晚');
                    }
                },
                _post_data = {
                    brandid: '',
                    city: '',
                    indate: '',
                    outdate: ''
                },
                _is_geo = true, // 是否可以定位
                _is_get_city = true, // 是否可以获取城市[根据品牌]
                _brand_city_obj = {}; // 品牌id对应的城市数组
            return {
                init: function() {
                    // 品牌默认选择最后一个
                    Brand.choiceBrand($figure.eq($figure.length - 1));
                    // 时间选择初始化
                    Brand.dateInit();
                },
                dateInit: function() {
                    var _today = Brand.getYMD(0),
                        _tomorrow = Brand.getYMD(1),
                        _end_obj = Brand.cloneObj(_date_obj);
                    $startTimeShow.html(Brand.zhcnYMD(_today, 'cn'));
                    $endTimeShow.html(Brand.zhcnYMD(_tomorrow, 'cn'));

                    _post_data.indate = Brand.zhcnYMD(_today, 'zh');
                    _post_data.outdate = Brand.zhcnYMD(_tomorrow, 'zh');

                    _now_date = _post_data.indate;

                    // 设置时间弹窗函数
                    $startTime.mobiscroll().date(_date_obj);
                    _end_obj.onSelect = function(_date) { // 结束时间回掉函数
                        if (_date <= _post_data.indate) { // 开始时间小于今天
                            layer.open({
                                content: '离店时间不能小于等于入住时间'
                            });
                            return;
                        }
                        _post_data.outdate = _date;
                        $endTimeShow.html(_date.replace('-', '年').replace('-', '月') + '日');
                        // 计算中间天数
                        $allTime.html('共' + Brand.dateDiff(_post_data.indate, _post_data.outdate) + '晚');
                    }
                    $endTime.mobiscroll().date(_end_obj);
                },
                search: function($this) {
                    layer.open({
                        content: '搜索中…'
                    });
                    setTimeout(function() {
                        location.href = ['/searchHotel?brandid=',
                            _post_data.brandid,
                            '&city=',
                            _post_data.city,
                            '&indate=',
                            _post_data.indate + ' 00:00:00',
                            '&outdate=',
                            _post_data.outdate + ' 00:00:00'
                        ].join('');
                    }, 0);
                },
                choiceBrand: function($d) {
                    if (!$d.is('.active')) {
                        $figure.removeClass('active');
                        $d.addClass('active');
                        $name.html($d.data('name'));
                        _post_data.brandid = $d.data('id');
                        // 修改品牌后需要重新定位当前城市
                        Brand.getCityName(function() { // 失败回掉函数
                            // 获取城市列表(填写默认城市)
                            Brand.getCity(_post_data.brandid, function(_c) { // _c是城市列表
                                var _c = _c.length ? _c[0] : '宁波市';
                                $city.html(_c);
                                _post_data.city = _c;
                            });
                        });
                    }
                },
                canladerOpen: function(_type) {
                    if (_type === 'start') {
                        $startTime.mobiscroll('show');
                    } else {
                        $endTime.mobiscroll('show');
                    }
                },
                cloneObj: function(o) {
                    var _obj = {},
                        _k;
                    if (o instanceof Array) {
                        _obj = [];
                    };
                    for (_k in o) {
                        var val = o[_k];
                        _obj[_k] = (typeof val === 'object') ? arguments.callee(val) : val;
                    }
                    return _obj;
                },
                dateDiff: function(_d1, _d2) { //_d1：开始日期 _d2：结束日期  格式：2006-12-01
                    _d1 = _d1.split('-');
                    _d1 = new Date(_d1[0], _d1[1] - 1, _d1[2]);
                    _d2 = _d2.split('-');
                    _d2 = new Date(_d2[0], _d2[1] - 1, _d2[2]);
                    return ~~((_d2 - _d1) / 86400000); //把相差的毫秒数转换为天数
                },
                zhcnYMD: function(_v, _t) { // _t = 'zh' or 'cn' [_v 是 getYMD函数返回的格式]
                    if (_t === 'zh') {
                        return _v.y + '-' + _v.m + '-' + _v.d;
                    }
                    return _v.y + '年' + _v.m + '月' + _v.d + '日';
                },
                getYMD: function(_add) { // _add 为（+/-）数字 今天左右浮动天数
                    var _now = new Date();
                    _now.setDate(_now.getDate() + _add);
                    var _m = _now.getMonth() + 1,
                        _d = _now.getDate();
                    return {
                        'y': _now.getFullYear(),
                        'm': _m < 10 ? ('0' + _m) : _m,
                        'd': _d < 10 ? ('0' + _d) : _d
                    };
                },
                getCity: function(_id, _callBack) { // 根据酒店id获取城市列表, 支持回掉函数传入城市list
                    if (_is_get_city) {
                        if (_brand_city_obj[_id]) {
                            _callBack && _callBack(_brand_city_obj[_id]);
                            return _brand_city_obj[_id];
                        } else {
                            _is_get_city = false;
                            $.ajax({
                                url: '/hotelType/getCity/' + _id,
                                dataType: 'json',
                                success: function(_d) {
                                    _is_get_city = true;
                                    if (_d.data) { // 有数据
                                        _brand_city_obj[_id] = _d.data;
                                        _callBack && _callBack(_d.data);
                                        return _d.data;
                                    };
                                    _callBack && _callBack([]);
                                    return [];
                                },
                                error: function() {
                                    layer.open({
                                        content: '获取已有城市失败'
                                    });
                                    _is_get_city = true;
                                }
                            });
                        }
                    }
                },
                choiceCity: function() {
                    layer.open({
                        content: '获取城市…'
                    });
                    Brand.getCity(_post_data.brandid, function(_c) {
                        var _l = _c.length,
                            _temp = [
                                _user_city ? ('<li class="city-list c"><span>' + _user_city + '</span><i class="fr fs12">当前定位</i></li>') : '',
                                '<li class="city-tit">热门城市</li>'
                            ];
                        layer.closeAll();
                        while (_l--) {
                            _temp.push('<li class="city-list"><span>' + _c[_l] + '</span></li>');
                        };
                        (_temp.length < 3) && (_temp.push('<li class="tac mt10"><span>没有相关城市</span></li>'));
                        $cityList.html(_temp.join(''));
                        $cityWrap.removeClass('none');
                    });
                },
                okCity: function($this) {
                    var _c = $this.find('span').html();
                    if (_c !== '没有相关城市') {
                        _post_data.city = _c;
                        $city.html(_c);
                    }
                    $cityWrap.addClass('none');
                },
                getCityName: function(_errCallBack) {
                    if (_is_geo) {
                        _is_geo = false;
                        var _now_city = $city.html(),
                            geolocation = new BMap.Geolocation(),
                            geocoder = new BMap.Geocoder();
                        $city.html('定位中…');
                        geolocation.getCurrentPosition(function(r) {
                            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                                geocoder.getLocation(r.point, function(rs) {
                                    $city.html(_user_city = _post_data.city = rs.addressComponents.city);
                                    _is_geo = true;
                                });
                            } else {
                                layer.open({ content: '定位失败' });
                                _is_geo = true;
                                _errCallBack && _errCallBack();
                            }
                        });
                    }
                }
            };
        })();
    // 项目初始化
    Brand.init();
    // 搜索
    $main.on('tap', '.submit-search', function() {
        Brand.search($(this));
    });
    // 选择品牌
    $main.on('tap', '.brand-img', function() {
        Brand.choiceBrand($(this));
    });
    // 时间选择
    $main.on('click', '.start-time', function() {
        Brand.canladerOpen('start');
    });
    $main.on('click', '.end-time', function() {
        Brand.canladerOpen('end');
    });
    // 点击定位
    $main.on('tap', '.location', function() {
        Brand.getCityName();
    });
    // 选择城市
    $main.on('tap', '.choice-city', function() {
        Brand.choiceCity();
    });
    // 确认选择城市
    $cityWrap.on('tap', '.city-list', function() {
        Brand.okCity($(this));
    });
    // 关闭城市选择
    $cityWrap.on('click', '.close-city', function() {
        $cityWrap.addClass('none');
    });
    $cityWrap.on('tap', function(e) {
        !$.contains(this, e.target) && $cityWrap.addClass('none');
    });
}(Zepto);
