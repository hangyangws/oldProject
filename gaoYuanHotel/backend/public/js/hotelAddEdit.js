;
/**
 * [created by hangyangws in 2016-03-01]
 * [后台管理系统 - 酒店 - 新增和编辑]
 * @return {[Object - IIFE]}   [Hotel - hotel type]
 */
! function($) {
    "use strict";
    var $main = $('#main'),
        Hotel = (function() {
            var $thumbnailBtn = $('#thumbnailWrap').find('.add-img'), // 上传酒店图片的按钮
                $standardWrap = $('#standardWrap'), // 轮播图的父级元素
                $standardBtn = $standardWrap.find('.add-img'), // 上传轮播图片的按钮
                $form = $allWrap.find('.form'), // 整个form表单
                $starIpt = $form.find('.star-ipt'), // 星级 input 输入框
                $editId = $form.find('.edit-id'), // 编辑数据的id (新增数据没有 [本页面公用新增和编辑])
                _is_submit = true,
                // 图片上传的数据 standard-轮播图 thumbnail-头图
                _img_data = {
                    standard: {},
                    thumbnail: {}
                },
                // 省市区 变量
                _province,
                _city = {},
                _area = {},
                $moveImg = null; // 正在移动的图片figure
            return {
                init: function() {
                    // 获取品牌列表
                    Hotel.getBrand();
                    // 获取地区json存入变量 (经过遍历)
                    Hotel.getGeography();
                    // 酒店品牌图片上传 和 轮播图上传
                    Hotel.imgLoad();
                    // 更新_img_data
                    if ($editId.length) {
                        _img_data = JSON.parse(RenderData.imgData);
                    };
                },
                imgLoad: function() {
                    var $thumbnailImg = $form.find('.img-file-thumbnail'), // thumbnail[酒店图片]图片上传input:file
                        $standardImg = $form.find('.img-file-standard'), // standard[轮播图片]图片上传input:file
                        _thumbnail_check = {
                            allowedExtensions: ['jpg', 'jpeg', 'png'],
                            maxSize: 2048,
                            success: function() {
                                $thumbnailImg.fileupload({
                                    "url": '/upload?tp=' + new Date().getTime(),
                                    done: function(e, result) {
                                        var _r = result.result;
                                        if (_r.status) {
                                            layer.open({
                                                title: '酒店图片上传',
                                                type: 2,
                                                area: [
                                                    '820px',
                                                    '480px'
                                                ],
                                                content: '/imgCrop?src=' + _r.info.path + '&width=100&height=100&type=thumbnail'
                                            });
                                        } else {
                                            layer.alert(_r.msg);
                                        };
                                    }
                                });
                            },
                            extensionerror: function() {
                                layer.alert('允许的格式为：jpg， jpeg，png');
                                return false;
                            },
                            sizeerror: function() {
                                layer.alert('文件大小不超过2m');
                                return false;
                            }
                        },
                        _standard_check = $.cloneObj(_thumbnail_check);
                    // 调整 _standard_check 参数
                    _standard_check.success = function() {
                        $standardImg.fileupload({
                            "url": '/upload?tp=' + new Date().getTime(),
                            done: function(e, result) {
                                var _r = result.result;
                                if (_r.status) {
                                    layer.open({
                                        title: '轮播图上传',
                                        type: 2,
                                        area: [
                                            '820px',
                                            '480px'
                                        ],
                                        content: '/imgCrop?src=' + _r.info.path + '&width=226&height=100&type=standard'
                                    });
                                } else {
                                    layer.alert(_r.msg);
                                };
                            }
                        });
                    };
                    // 酒店图片上传
                    $thumbnailImg.checkFileTypeAndSize(_thumbnail_check);
                    $thumbnailImg.fileupload(); // 初始化触发文件异步上传
                    // 轮播图上传
                    $standardImg.checkFileTypeAndSize(_standard_check);
                    $standardImg.fileupload(); // 初始化触发文件异步上传
                    // 图片裁剪成功回掉
                    window.imgPublic = {
                        thumbnail: function(_info) {
                            Hotel.setThumbnailImg(_info);
                        },
                        standard: function(_info) {
                            Hotel.setStandardImg(_info);
                        }
                    };
                },
                setThumbnailImg: function(_info) { // 酒店图片
                    $thumbnailBtn.before(['<figure>',
                        '<img src="',
                        _info.thumbnail.path,
                        '" />',
                        '<span class="img-del thumbnail-img-del">×</span>',
                        '</figure>'
                    ].join(''));
                    ($thumbnailBtn.data('num') !== 'infinity') && $thumbnailBtn.hide(400);
                    // 设置 _img_data
                    _img_data.thumbnail = {};
                    _img_data.thumbnail[_info.thumbnail.name] = {
                        "isDefault": 1,
                        "orderList": 1
                    };
                },
                setStandardImg: function(_info) { // 酒店轮播图片
                    $standardBtn.before(['<figure class="move-img" title="交换图片位置" draggable="true">',
                        '<img src="',
                        _info.standard.path,
                        '" draggable="false" />',
                        '<span class="img-del standard-img-del">×</span>',
                        '</figure>'
                    ].join(''));
                    ($standardBtn.data('num') !== 'infinity') && $standardBtn.hide(400);
                    // 设置 _img_data
                    _img_data.standard[_info.standard.name] = { isDefault: 0 };
                },
                submit: function() {
                    if (_is_submit) {
                        _is_submit = false;
                        var _data = {}, // ajax发送的数据
                            $ipt = $form.find('.ipt-item'), // 需要提交的字段
                            _ipt_l = $ipt.length, // 字段长度
                            _url = '/hotel/add', // ajax url
                            _ajax_type = 'POST', // ajax 发送方式
                            $now, // 当前循环到的$ipt节点
                            _val; // 当前结点的值
                        // 保存类型(新增还是编辑)
                        if ($editId.length) {
                            _data.id = $editId.val();
                            _url = '/hotel/update';
                            _ajax_type = "PUT";
                        };
                        // 检测电话是否合格
                        if (!$.cTel($ipt.filter('[data-name="phone"]').val())) {
                            layer.msg('酒店电话格式错误');
                            _is_submit = true;
                            return;
                        };
                        while (_ipt_l--) {
                            $now = $ipt.eq(_ipt_l);
                            _val = $.trim($now.val());
                            // 检测为空
                            if ($now.data('need') && (_val === '' || _val === 'null' || _val === null)) {
                                layer.msg($now.data('tit') + '不能为空');
                                _is_submit = true;
                                return;
                            };
                            _data[$now.data('name')] = _val;
                        };
                        // 检测图片时候已经上传
                        if (tools.isEmptyObject(_img_data.thumbnail) || tools.isEmptyObject(_img_data.standard)) {
                            layer.msg('请上传酒店图片和轮播图');
                            _is_submit = true;
                            return;
                        } else {
                            // 给standard的orderList编号
                            $standardWrap.find('img').each(function(_i, _e) {
                                var _src = $(_e).attr('src'),
                                    _img_name = _src.slice(_src.lastIndexOf('/') + 1);
                                _img_data.standard[_img_name].orderList = _i;
                            });
                            // -----------------------------------------------
                            _data.imagepath = JSON.stringify(_img_data); // 赋值图片数据给 _data
                            layer.msg('操纵中…');
                            $.ajax({
                                    url: _url,
                                    type: _ajax_type,
                                    dataType: 'json',
                                    data: _data,
                                })
                                .done(function(_d) {
                                    if (_d.status) {
                                        layer.msg('操作成功');
                                        if ($editId.length) {
                                            location.href = document.referrer;
                                        } else {
                                            setTimeout(function() {
                                                location.href = '/hotel';
                                            }, 200);
                                        };
                                    } else {
                                        layer.msg(_d.msg);
                                        _is_submit = true;
                                    };
                                })
                                .fail(function() {
                                    layer.alert('网络堵塞');
                                    _is_submit = true;
                                });
                        };
                    };
                },
                thumbnailImgDel: function() {
                    _img_data.thumbnail = {};
                },
                standardImgDel: function($this) {
                    var _src = $this.parent().find('img').attr('src'),
                        _img_name = _src.slice(_src.lastIndexOf('/') + 1);
                    delete _img_data.standard[_img_name];
                },
                getGeography: function() {
                    var _temp_l,
                        _temp_local;
                    $.getJSON('/json/province.json', function(json) {
                        _province = json;
                        $.getJSON('/json/city.json', function(json) {
                            _temp_l = json.length;
                            while (_temp_l--) {
                                _temp_local = json[_temp_l];
                                if (_city[_temp_local.ProID]) {
                                    _city[_temp_local.ProID].push({
                                        name: _temp_local.name,
                                        CityID: _temp_local.CityID
                                    });
                                } else {
                                    // 新城市
                                    _city[_temp_local.ProID] = [{
                                        name: _temp_local.name,
                                        CityID: _temp_local.CityID
                                    }];
                                };
                            };
                            $.getJSON('/json/area.json', function(json) {
                                _temp_l = json.length;
                                while (_temp_l--) {
                                    _temp_local = json[_temp_l];
                                    if (_area[_temp_local.CityID]) {
                                        _area[_temp_local.CityID].push({
                                            name: _temp_local.name
                                        });
                                    } else {
                                        // 新城市
                                        _area[_temp_local.CityID] = [{
                                            name: _temp_local.name
                                        }];
                                    };
                                };
                                // 渲染 省 DOM
                                Hotel.renderProvince();
                            });
                        });
                    });
                },
                getBrand: function() {
                    $.ajax({
                            url: '/hotelType?isPage=false',
                            dataType: 'json'
                        })
                        .done(function(_data) {
                            if (_data.msg === '获取数据正常') {
                                var _brand_list = _data.data.data.list,
                                    _list_l = _brand_list.length,
                                    _list_dom = [],
                                    _now_brand = RenderData.hotelId;
                                while (_list_l--) {
                                    _list_dom.push(['<option value="',
                                        _brand_list[_list_l].id,
                                        '"',
                                        (_now_brand === _brand_list[_list_l].id ? 'selected="selected"' : ''),
                                        '>',
                                        _brand_list[_list_l].name,
                                        '</option>'
                                    ].join(''));
                                };
                                $allWrap.find('.brand-list').html(_list_dom.join(''));
                            } else {
                                // layer.alert(_data.msg);
                            };
                        })
                        .fail(function() {
                            layer.alert('网络堵塞，获取品牌失败');
                        });
                },
                renderProvince: function() {
                    // render 省份
                    var $province = $allWrap.find('.province'),
                        _pro_val = $province.val(),
                        _pro_dom = ['<option data-id="null" value="null">选择省份</option>'],
                        _p_l = _province.length;
                    while (_p_l--) {
                        _pro_dom.push([
                            '<option data-id="',
                            _province[_p_l].ProID,
                            '" value="',
                            _province[_p_l].name,
                            '"',
                            (_pro_val === _province[_p_l].name) ? ' selected="selected"' : '',
                            '>',
                            _province[_p_l].name,
                            '</option>'
                        ].join(''));
                    };
                    $province.html(_pro_dom.join(''));
                    // 渲染 市 DOM
                    Hotel.renderCity($province.find('option[value="' + _pro_val + '"]').data('id'));
                },
                renderCity: function(_pid) {
                    // render 城市
                    // _pid 是当前省份的id
                    var $city = $allWrap.find('.city');
                    var _city_dom = ['<option data-id="null" value="null">选择市</option>'];
                    if (_pid) {
                        var _city_val = $city.val();
                        var _c_l = _city[_pid].length;
                        while (_c_l--) {
                            _city_dom.push([
                                '<option data-id="',
                                _city[_pid][_c_l].CityID,
                                '" value="',
                                _city[_pid][_c_l].name,
                                '"',
                                (_city_val === _city[_pid][_c_l].name) ? ' selected="selected"' : '',
                                '>',
                                _city[_pid][_c_l].name,
                                '</option>'
                            ].join(''));
                        };
                    };
                    $city.html(_city_dom.join(''));
                    // 渲染 区 DOM
                    Hotel.renderArea($city.find('option[value="' + _city_val + '"]').data('id'));
                },
                renderArea: function(_cid) {
                    // render 区
                    // _cid 是当前城市的id
                    var $area = $allWrap.find('.area');
                    var _area_dom = ['<option value="">选择区</option>'];
                    if (_cid) {
                        var _area_val = $area.val();
                        if (_area[_cid]) {
                            var _a_l = _area[_cid].length;
                            while (_a_l--) {
                                _area_dom.push([
                                    '<option',
                                    ' value="',
                                    _area[_cid][_a_l].name,
                                    '"',
                                    (_area_val === _area[_cid][_a_l].name) ? ' selected="selected"' : '',
                                    '>',
                                    _area[_cid][_a_l].name,
                                    '</option>'
                                ].join(''));
                            };
                        };
                    };
                    $area.html(_area_dom.join(''));
                },
                starControl: function($this) {
                    var _to_v = ($starIpt.val() - 0) + $this.data('num');
                    if (_to_v < 0) {
                        layer.alert('星级不能小于0');
                        return;
                    };
                    if (_to_v > 5) {
                        layer.alert('星级不能大于5');
                        return;
                    }
                    $starIpt.val(_to_v);
                },
                moveStart: function($this) {
                    $moveImg = $this;
                    $this.addClass('active');
                },
                moveDrop: function(_this) {
                    // _this -- 放置的Dom节点
                    $moveImg.removeClass('active');
                    // 如果移动到自己上面不做任何反应
                    if ($.contains($moveImg[0], _this) || $moveImg[0] === _this) {
                        return;
                    }
                    // 遍历已有的 figure（已经排除现在figure）
                    var $figure = $standardWrap.find('.move-img'),
                        _l = $figure.length;
                    while (_l--) {
                        if ($.contains($figure[_l], _this) || $figure[_l] === _this) {
                            // $moveImg 和 $figure.eq(_l) 进行Dom位置交换 [然后break]
                            $moveImg.addClass('none');
                            $figure.eq(_l).addClass('none');
                            $moveImg.before($figure.eq(_l).clone());
                            $moveImg.prev().removeClass('none');
                            $figure.eq(_l).before($moveImg);
                            $figure.eq(_l).prev().removeClass('none');
                            $figure.eq(_l).remove();
                            break;
                        }
                    }
                }
            };
        })();
    // 页面初始化
    Hotel.init();
    // 表单提交
    $allWrap.on('click', '.submit-form', function() {
        Hotel.submit();
    });
    // 酒店图片删除
    $allWrap.on('click', '.thumbnail-img-del', function() {
        Hotel.thumbnailImgDel();
    });
    // 酒店图片删除
    $allWrap.on('click', '.standard-img-del', function() {
        Hotel.standardImgDel($(this));
    });
    // figure开始移动
    $allWrap.on('dragstart', '.move-img', function() {
        Hotel.moveStart($(this));
    });
    // figure移动经过
    $main.on('dragover', function(e) {
        $.getE(e).preventDefault();
        return false;
    });
    // figure放置移动
    $main.on('drop', function(e) {
        e = $.getE(e);
        e.preventDefault();
        Hotel.moveDrop(e.target);
    });
    // 省份选择
    $allWrap.on('change', '.province', function() {
        Hotel.renderCity($(this).find('option[value="' + $(this).val() + '"]').data('id'));
    });
    // 市选择
    $allWrap.on('change', '.city', function() {
        Hotel.renderArea($(this).find('option[value="' + $(this).val() + '"]').data('id'));
    });
    // 星级操作
    $allWrap.on('click', '.num-control', function() {
        Hotel.starControl($(this));
    });
}(jQuery);
