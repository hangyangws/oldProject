/**
 * [首页控制器]
 * @return {[User - project object]}    [Feng Jie production]
 */
;
! function($) {
    "use strict";
    var $day = $('#day');
    var User = (function() {
        var $tab = $('#tab'),
            $country = $('#country'),
            $province = $('#province'),
            $city = $('#city'),
            $year = $('#year'),
            $mouth = $('#mouth'),
            _day_obj = {
                '01': 31,
                '03': 31,
                '04': 30,
                '05': 31,
                '06': 30,
                '07': 31,
                '08': 31,
                '09': 30,
                '10': 31,
                '11': 30,
                '12': 31
            },
            _city,
            $tel = $('#tel'),
            _operation = true;
        return {
            ini: function() {
                // 电话中间4位加密
                var _v = $tel.val().split('');
                if (!(_v == false)) { // 电话不为空
                    _v.splice(3, 4, '****');
                    $tel.val(_v.join(''));
                };
                // 年月日初始化
                User.loopYear();
                // 循环国家
                $.getJSON(global.jsonUrl + 'country.json', function(_r) {
                    var _h = ['<option value="null">国家</option>'],
                        _now = $country.val(),
                        _i;
                    _now === 'null' && (_now = '001');
                    for (_i in _r) {
                        _h.push('<option ' + ((_now === _i) ? 'selected ' : '') + 'value="' + _i + '">' + _r[_i] + '</option>');
                    };
                    $country.html(_h.join(''));
                });
                // 初始化省
                $.getJSON(global.jsonUrl + 'city.json', function(_r) {
                    _city = _r;
                    User.loopProvince();
                });
            },
            toggleShow: function($this) {
                $tab.find('.' + $this.data('to')).siblings().css('display', 'none').end().css('display', 'block');
                $this.addClass('active').siblings().removeClass('active');
            },
            loopYear: function() { // 当前年
                var _n = $year.val(),
                    _y = new Date().getFullYear(),
                    _i = 10,
                    _h = ['<option value="null">年</option>'];
                (_n < _y) && (_n = _y);
                while (_i--) {
                    _h.push('<option ' + ((_n == _y) ? 'selected ' : '') + 'value="' + _y + '">' + _y++ + '</option>');
                };
                $year.html(_h.join(''));
                User.loopMouth();
            },
            loopMouth: function() {
                var _n = $mouth.val(), // 当前月份
                    _m = 1,
                    _i = $year.val() !== 'null' ? 12 : 0,
                    _h = ['<option value="null">月</option>'];
                while (_i--) {
                    _m = _m < 10 ? ('0' + _m) : _m;
                    _h.push('<option ' + ((_n == _m) ? 'selected ' : '') + 'value="' + _m + '">' + _m + '</option>');
                    _m++;
                };
                $mouth.html(_h.join(''));
                User.loopDay();
            },
            loopDay: function() {
                var _n = $day.val(),
                    _d = 1,
                    _i = User.getDayNum($year.val(), $mouth.val()),
                    _h = ['<option value="null">日</option>'];
                while (_i--) {
                    (_d < 10) && (_d = '0' + _d);
                    _h.push('<option ' + ((_n == _d) ? 'selected ' : '') + 'value="' + _d + '">' + _d + '</option>');
                    _d++;
                };
                $day.html(_h.join(''));
            },
            getDayNum: function(_y, _m) {
                _day_obj['02'] = (_y % 4 === 0) && (_y % 100 !== 0 || _y % 400 === 0) ? 29 : 28;
                return _day_obj[_m];
            },
            loopProvince: function() {
                if ($country.val() === '001') { // 当前为中国
                    var _n = $province.val(),
                        _c = $city.val(),
                        _h = ['<option value="null">省份</option>'],
                        _i = _city.length;
                    while (_i--) {
                        _h.push('<option ' + ((_n === _city[_i].province.num) ? 'selected ' : '') + ' value="' + _city[_i].province.num + '">' + _city[_i].province.name + '</option>');
                    };
                    $province.html(_h.join('')).removeClass('none');
                    User.loopCity();
                } else {
                    $province.addClass('none').html('<option value="null">省份</option>');
                    $city.addClass('none').html('<option value="null">城市</option>');
                };
            },
            loopCity: function() {
                var _h = ['<option value="null">城市</option>'],
                    _i = _city.length,
                    _now = $province.val(),
                    _n = $city.val(),
                    _city_num;
                if (_now !== 'null') {
                    while (_i--) { // 找到当前省份
                        if (_city[_i].province.num === _now) {
                            // 循环城市
                            for (_city_num in _city[_i].city) {
                                _h.push('<option ' + ((_n === _city_num) ? 'selected ' : '') + ' value="' + _city_num + '">' + _city[_i].city[_city_num] + '</option>');
                            };
                            break;
                        };
                    };
                };
                $city.html(_h.join('')).removeClass('none');
            },
            submitForm: function($this) {
                var $form = $('#userInfo');
                if (_operation) {
                    _operation = false;
                    $this.html('保存中...');
                    if ($this.data('role') === 'info') {
                        var _email = $form.find('.ipt-email').val(),
                            _name = $form.find('.nickname').val();
                        if (_name === '') {
                            User.tips($this, '昵称不能为空');
                        } else {
                            $.ajax({
                                type: 'POST',
                                url: global.checkNikeName,
                                data: {
                                    nickname: _name
                                },
                                dataType: 'json',
                                success: function(r) {
                                    if (r.status === 'success') {
                                        if (_email !== '' && !$.cEmail(_email)) {
                                            User.tips($this, '邮箱格式不正确');
                                        } else {
                                            // 年月日格式化
                                            var _time = $year.val();
                                            _time += '-' + ($mouth.val() === 'null' ? '01' : $mouth.val());
                                            _time += '-' + ($day.val() === 'null' ? '01' : $day.val());
                                            $('#YMD').val(_time);
                                            $form.submit();
                                        };
                                    } else {
                                        User.tips($this, r.message);
                                    };
                                }
                            });
                        };
                    } else {
                        var _old_pass = $tab.find('.old-pass').val(),
                            _new_pass = $tab.find('.new-pass').val(),
                            _re_pass = $tab.find('.re-pass').val();
                        if (_old_pass.length > 5 && _old_pass.length < 21) {
                            if (_new_pass.length > 5 && _new_pass.length < 21) {
                                if (_new_pass === _re_pass) {
                                    $.ajax({
                                        type: 'POST',
                                        url: global.reset,
                                        data: {
                                            oldPassword: _old_pass,
                                            password: _new_pass
                                        },
                                        dataType: 'json',
                                        success: function(r) {
                                            if (r.status === 'success') {
                                                $this.html('修改成功');
                                                setTimeout(function() {
                                                    location.reload();
                                                }, 200);
                                            } else {
                                                User.tips($this, r.message);
                                            };
                                        }
                                    });
                                } else {
                                    User.tips($this, '两次密码不相同');
                                };
                            } else {
                                User.tips($this, '新密码格式错误');
                            };
                        } else {
                            User.tips($this, '密码错误');
                        };
                    };
                };
            },
            tips: function($this, _txt) {
                $this.html('保存');
                $this.next().html(_txt);
                _operation = true;
            },
            clearErr: function($this) {
                $this.closest('.sub-wrap').find('.submit-err').html('&emsp;');
            },
            iptKeyup: function($this, e) {
                if ($.getKey(e) === 13) {
                    $this.closest('.sub-wrap').find('.submit-btn').trigger('click');
                } else {
                    User.clearErr($this);
                };
            }
        };
    })();

    User.ini();

    // 面板切换
    $('#tabIndex').on('click', 'li', function() {
        User.toggleShow($(this));
    });
    //年份选择
    $('#year').on('change', function() {
        User.loopMouth();
    });
    //月份选择
    $('#mouth').on('change', function() {
        User.loopDay();
    });
    // 国家选择
    $('#country').on('change', function() {
        User.loopProvince();
    });
    // 省份选择
    $('#province').on('change', function() {
        User.loopCity();
    });
    // 提交form（数据）
    $('#tab').on('click', '.submit-btn', function() {
        User.submitForm($(this));
    });
    // keyup
    $('#tab').on('keyup', '.ipt-trigger', function(e) {
        User.iptKeyup($(this), e);
    });
    // focus
    $('#tab').on('focus', '.ipt-trigger', function(e) {
        User.clearErr($(this));
    });
}(jQuery);
