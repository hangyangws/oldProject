;
/**
 * [created by hangyangws in 2016-02-25]
 * [后台管理系统 - 酒店品牌 - 新增和编辑]
 * @return {[Object - IIFE]}   [hType - hotel type]
 */
! function($) {
    "use strict";
    var hType = (function() {
        var $imgCropBtn = $('#imgCropWrap').find('.add-img'),
            $form = $allWrap.find('.form'),
            $editId = $form.find('.edit-id'),
            _is_submit = true,
            _img_data = {
                standard: {}
            };
        return {
            init: function() {
                // 酒店品牌图片上传
                hType.imgLoad();
                // 更新_img_data
                if ($editId.length) {
                    _img_data = JSON.parse(RenderData.imgData);
                };
            },
            imgLoad: function() {
                var $img = $("#imgUpload"); // 图片上传input:file
                $img.checkFileTypeAndSize({
                    allowedExtensions: ['jpg', 'jpeg', 'png'],
                    maxSize: 2048,
                    success: function() {
                        $img.fileupload({
                            "url": '/upload?tp=' + new Date().getTime(),
                            done: function(e, result) {
                                var _r = result.result;
                                if (_r.status) {
                                    layer.open({
                                        title: '品牌图片上传',
                                        type: 2,
                                        area: [
                                            '820px',
                                            '480px'
                                        ],
                                        content: '/imgCrop?src=' + _r.info.path + '&width=270&height=100&type=standard'
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
                });
                $img.fileupload();
                // 图片裁剪成功回掉
                window.imgPublic = {
                    standard: function(info) {
                        hType.setCropImg(info);
                    }
                };
            },
            setCropImg: function(info) {
                $imgCropBtn.before(['<figure>',
                    '<img src="',
                    info.standard.path,
                    '" />',
                    '<span class="img-del">×</span>',
                    '</figure>'
                ].join(''));
                ($imgCropBtn.data('num') !== 'infinity') && $imgCropBtn.hide(400);
                // 设置 _img_data
                _img_data.standard = {};
                _img_data.standard[info.standard.name] = {
                    "isDefault": 1,
                    "orderList": 1
                };
            },
            submit: function() {
                if (_is_submit) {
                    _is_submit = false;
                    var _data = {},
                        $ipt = $form.find('.ipt-item'),
                        _ipt_l = $ipt.length,
                        _url = '/hotelType/add',
                        _ajax_type = 'POST',
                        $now,
                        _val;
                    // 保存类型(新增还是编辑)
                    if ($editId.length) {
                        _data.id = $editId.val();
                        _url = '/hotelType/update';
                        _ajax_type = "PUT";
                    };
                    while (_ipt_l--) {
                        $now = $ipt.eq(_ipt_l);
                        _val = $.trim($now.val());
                        if ($now.data('need') && !_val) {
                            layer.msg($now.data('tit') + '不能为空');
                            _is_submit = true;
                            return;
                        };
                        _data[$now.data('name')] = _val;
                    };
                    if (_img_data.standard) {
                        _data.imagepath = JSON.stringify(_img_data);
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
                                            location.href = '/hotelType';
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
                    } else {
                        layer.msg('请上传品牌图片');
                        _is_submit = true;
                        return;
                    };
                };
            },
            imgDel: function() {
                _img_data.standard = {};
            }
        };
    })();
    // 页面初始化
    hType.init();
    // 表单提交
    $allWrap.on('click', '.submit-form', function() {
        hType.submit();
    });
    $allWrap.on('click', '.img-del', function() {
        hType.imgDel();
    });
}(jQuery);
