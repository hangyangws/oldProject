;
/**
 * [created by hangyangws in 2016-03-01]
 * [后台管理系统 - 酒店房间 - 新增和编辑]
 * @return {[Object - IIFE]}   [Room - hotel type]
 */
! function($) {
    "use strict";
    var Room = (function() {
        var $form = $allWrap.find('.form'),
            // $imgCropWrap = $('#imgCropWrap'),
            // $imgCropBtn = $imgCropWrap.find('.add-img'),
            $editId = $form.find('.edit-id'),
            // $imagepath = $form.find('#imagepath'),
            _is_submit = true,
            // _img_data = {
            //     thumbnail: {}
            // },
            _msg = '';
        return {
            init: function() {
                //是否含早
                Room.getIniBf();
                //是否上架
                Room.getIniMt();
                //表单验证
                Room.validate();
                //获取酒店列表
                Room.getHotel();
                // 房间图片上传
                // Room.imgLoad();
                // 更新_img_data
                // if ($editId.length) {
                //     _img_data = JSON.parse(RenderData.imgData);
                // };
            },
            // imgLoad: function() {
            //     var $img = $("#imgUpload"); // 图片上传input:file
            //     $img.checkFileTypeAndSize({
            //         allowedExtensions: ['jpg', 'jpeg', 'png'],
            //         maxSize: 2048,
            //         success: function() {
            //             $img.fileupload({
            //                 "url": '/upload?tp=' + new Date().getTime(),
            //                 done: function(e, result) {
            //                     var _r = result.result;
            //                     if (_r.status) {
            //                         layer.open({
            //                             title: '房间图片上传',
            //                             type: 2,
            //                             area: [
            //                                 '820px',
            //                                 '480px'
            //                             ],
            //                             content: '/imgCrop?src=' + _r.info.path + '&width=226&height=100&type=thumbnail'
            //                         });
            //                     } else {
            //                         layer.alert(_r.msg);
            //                     };
            //                 }
            //             });
            //         },
            //         extensionerror: function() {
            //             layer.alert('允许的格式为：jpg， jpeg，png');
            //             return false;
            //         },
            //         sizeerror: function() {
            //             layer.alert('文件大小不超过2m');
            //             return false;
            //         }
            //     });
            //     $img.fileupload();
            //     // 图片裁剪成功回掉
            //     window.imgPublic = {
            //         thumbnail: function(info) {
            //             Room.setCropImg(info);
            //         }
            //     };
            // },
            // setCropImg: function(_info) {
            //     $imgCropBtn.before(['<figure>',
            //         '<img src="',
            //         _info.thumbnail.path,
            //         '" />',
            //         '<span class="img-del">×</span>',
            //         '</figure>'
            //     ].join(''));
            //     ($imgCropBtn.data('num') !== 'infinity') && $imgCropBtn.hide(400);
            //     // 设置 _img_data
            //     _img_data.thumbnail[_info.thumbnail.name] = { isDefault: 0 };
            // },
            submit: function() {
                if (!$form.valid() && _msg !== '') {
                    layer.msg(_msg);
                    return;
                } else {
                    _msg = '';
                }
                if (_is_submit) {
                    _is_submit = false;
                    var _data = {},
                        $ipt = $form.find('.ipt-item'),
                        _ipt_l = $ipt.length,
                        _url = '/hotelRoom/add',
                        _ajax_type = 'POST',
                        $now,
                        _val,
                        _min_value = 0;
                    // 保存类型(新增还是编辑)
                    if ($editId.length) {
                        _data.id = $editId.val();
                        _url = '/hotelRoom/update';
                        _ajax_type = "PUT";
                    };
                    // if (!tools.isEmptyObject(_img_data.thumbnail)) {
                    // 给thumbnail的orderList编号
                    // $imgCropWrap.find('img').each(function(_i, _e) {
                    //     var _src = $(_e).attr('src'),
                    //         _img_name = _src.slice(_src.lastIndexOf('/') + 1);
                    //     _img_data.thumbnail[_img_name].orderList = _i;
                    // });
                    // -----------------------------------------------
                    // $imagepath.val(JSON.stringify(_img_data));
                    layer.msg('操作中…');
                    $.ajax({
                            url: _url,
                            type: _ajax_type,
                            dataType: 'json',
                            data: $form.serialize(),
                        })
                        .done(function(_d) {
                            if (_d.status) {
                                layer.msg('操作成功');
                                if ($editId.length) {
                                    location.href = document.referrer;
                                } else {
                                    setTimeout(function() {
                                        location.href = '/hotelRoom';
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
                    // } else {
                    //     layer.msg('请上传房间图片');
                    //     _is_submit = true;
                    //     return;
                    // };
                };
            },
            imgDel: function($this) {
                var _src = $this.parent().find('img').attr('src'),
                    _img_name = _src.slice(_src.lastIndexOf('/') + 1);
                delete _img_data.thumbnail[_img_name];
            },
            getHotel: function() {
                $.ajax({
                        url: '/hotel?isPage=false',
                        dataType: 'json'
                    })
                    .done(function(_data) {
                        var _hotel_list = _data.data.data.list,
                            _list_l = _hotel_list.length,
                            _list_dom = [];
                        while (_list_l--) {
                            _list_dom.push('<option value="' + _hotel_list[_list_l].id + '" ' + (RenderData.hotelid === _hotel_list[_list_l].id ? 'selected="selected"' : '') + '>' + _hotel_list[_list_l].name + '</option>');
                        };
                        $allWrap.find('.hotel-list').append(_list_dom.join(''));
                    })
                    .fail(function() {
                        layer.alert('网络堵塞，获取酒店失败');
                    });
            },
            validate: function() {
                //校验正整数
                jQuery.validator.addMethod("positiveinteger", function(value, element) {
                    return value !== '0';
                }, "Please enter a valid number.");
                //大于0的数
                jQuery.validator.addMethod("positiveNumber", function(value, element) {
                    var aint = parseFloat(value);
                    return aint >= 0 && (aint + "") == value;
                }, "Please enter a valid number.");
                $form.validate({
                    rules: {
                        name: {
                            required: true,
                            rangelength: [1, 10]
                        },
                        price: {
                            required: true,
                            min: 0
                        },
                        store: {
                            required: true,
                            positiveinteger: true
                        },
                        buyearnpoint: {
                            positiveinteger: true
                        },
                        introduction: {
                            maxlength: 15
                        }
                    },
                    messages: {
                        name: {
                            required: "请输入房间名称",
                            rangelength: "房间名字在{0}至{1}字符之内"
                        },
                        price: {
                            required: "请输入价格",
                            min: "价格不能小于{0}"
                        },
                        store: {
                            required: "请输入房间库存",
                            positiveinteger: "库存必须为正整数"
                        },
                        buyearnpoint: {
                            positiveinteger: "积分必须为正整数"
                        },
                        introduction: {
                            maxlength: "描述最多只能输入{0}个字符"
                        }
                    },
                    errorPlacement: function(error, element) {
                        //务必采用这种方式，以便该元素验证通过时，自动清除错误信息
                        //error.appendTo(element.next("span"));
                        _msg = error[0].innerText;
                    }
                });
            },
            getIniBf: function() {
                var _is_bf = $form.find('[name="isbreakfast"]:radio');
                _is_bf.each(function(index, el) {
                    if (this.value === RenderData.isbreakfast) {
                        this.checked = true;
                    }
                });
            },
            getIniMt: function() {
                var _is_mt = $form.find('[name="ismarketable"]:radio');
                _is_mt.each(function(index, el) {
                    if (this.value === RenderData.ismarketable) {
                        this.checked = true;
                    }
                });
            }
        };
    })();
    // 页面初始化
    Room.init();
    // 表单提交
    $allWrap.on('click', '.submit-form', function() {
        Room.submit();
    });
    $allWrap.on('click', '.img-del', function() {
        Room.imgDel($(this));
    });
}(jQuery);
