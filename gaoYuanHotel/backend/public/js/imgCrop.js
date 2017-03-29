/**
 * [图片裁剪 created by hangyangws]
 * @return  {[objecr]} $ [Imgcrop对象包含方法]
 */
;
! function($) {
    "use strict";
    var Imgcrop = (function() {
        var $imgBig = $('#imgBig'),
            $imgThum = $('#imgThum'),
            _data = {
                imgName: _img_name,
                isResize: false, // 不生成缩略图[此功能已屏蔽]
                x: 0,
                y: 0,
                w: ~~width,
                h: ~~height,
                type: _type
            },
            _is_upload = false,
            _img_w, // 图片原始尺寸 分辨率
            _img_h, // 图片原始尺寸 分辨率
            boundx, // 图片css宽度
            boundy; // 图片css高度
        return {
            init: function() {
                layer.msg('图片加载中…', {
                    time: 0
                });
                // 检测图片加载完成事件
                if ($imgThum[0].complete) {
                    // 如果img已经加载完成
                    Imgcrop.imgLoad($imgThum[0]);
                } else {
                    $imgThum.load(function() {
                        Imgcrop.imgLoad(this);
                    });
                };
            },
            updatePreview: function(c) { // 更新_data值
                if (boundx && boundy) {
                    var _w_x = c.w / boundx,
                        _h_y = c.h / boundy,
                        _x_x = c.x / boundx,
                        _y_y = c.y / boundy,
                        // change
                        _rat = width / (_img_w * _w_x),
                        _w = _img_w * _rat,
                        _l = _img_w * _x_x * _rat,
                        _r = _img_h * _y_y * _rat;
                    if (c.w > 0) {
                        $imgThum.css({
                            width: _w + 'px',
                            left: -_l + 'px',
                            top: -_r + 'px'
                        });
                        _data.w = _img_w * _w_x; // 裁剪的宽
                        _data.h = _img_h * _h_y; // 裁剪的宽
                        _data.x = _img_w * _x_x; // 裁剪左上角顶点相对于图片左上角顶点的x坐标
                        _data.y = _img_h * _y_y; // 裁剪顶点的y坐标
                    };
                }
            },
            submit: function() {
                if (_is_upload) {
                    _is_upload = false;
                    layer.msg('操作中...');
                    $.ajax({
                            url: '/upload/crop',
                            type: 'POST',
                            dataType: 'json',
                            data: _data
                        })
                        .done(function(data) {
                            if (data.status) {
                                var _info = data.info;
                                window.parent.imgPublic[_type](_info);
                                layer.closeAll();
                                window.parent.layer.closeAll();
                            } else {
                                layer.alert(data.msg);
                            };
                            _is_upload = true;
                        })
                        .fail(function() {
                            layer.alert('图片上传失败');
                            _is_upload = true;
                        });
                };
            },
            imgLoad: function(_this) {
                var bounds;
                layer.closeAll();
                // 获取图片原始分辨率
                _img_w = $(_this).width();
                _img_h = $(_this).height();
                //使原图具有裁剪功能
                $imgBig.Jcrop({
                    onChange: Imgcrop.updatePreview,
                    onSelect: Imgcrop.updatePreview,
                    // change
                    aspectRatio: width / height,
                    setSelect: [0, 0, width, height]
                }, function() {
                    // 获取图片css 屏幕尺寸
                    bounds = this.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];
                });
                _is_upload = true;
            }
        };
    })();
    // 初始化
    Imgcrop.init();
    // 确认裁剪
    $('#submit').on('click', function() {
        Imgcrop.submit();
    });
}(jQuery);
