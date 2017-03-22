;
/**
 * [created by Tanner in 2016-03-07]
 * [后台管理系统 - 会员等级 - 新增和编辑]
 * @return {[Object - IIFE]}   [hotel RememberRank]
 */
! function($) {
    "use strict";
    var MemRank = (function() {
        var $form = $allWrap.find('.form'),
            $editId = $form.find('.edit-id'),
            _is_submit = true,
            _msg = '';
        return {
            init: function() {
                //表单验证
                MemRank.validate();
            },
            submit: function() {
                var r = $form.valid();
                if (_msg !== '' && !r) {
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
                        _url = '/hotelMemberrank/add',
                        _ajax_type = 'POST',
                        $now,
                        _val;
                    // 保存类型(新增还是编辑)
                    if ($editId.length) {
                        _data.id = $editId.val();
                        _url = '/hotelMemberrank/update';
                        _ajax_type = "PUT";
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
                    };
                    $.ajax({
                            url: _url,
                            type: _ajax_type,
                            dataType: 'json',
                            data: $form.serialize(),
                        })
                        .done(function(_d) {
                            if (_d.status) {
                                layer.msg('操作成功');
                                setTimeout(function() {
                                    location.href = '/hotelMemberrank';
                                }, 200);
                            } else {
                                layer.msg(_d.msg + '失败');
                                _is_submit = true;
                            };
                        })
                        .fail(function() {
                            layer.alert('网络堵塞');
                            _is_submit = true;
                        });
                };
            },
            validate: function() {
                //校验正整数
                jQuery.validator.addMethod("positiveinteger", function(value, element) {
                    var aint = parseInt(value);
                    return aint > 0 && (aint + "") == value;
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
                        point: {
                            required: true,
                            min: 0
                        },
                        preferentialscale: {
                            required: true,
                            positiveinteger: true,
                            min: 0,
                            max: 100
                        }

                    },
                    messages: {
                        name: {
                            required: "请输入等级名称",
                            rangelength: "等级名称在{0}至{1}字符之内"
                        },
                        point: {
                            required: "请输入起始积分",
                            min: "起始积分不能小于{0}"
                        },
                        preferentialscale: {
                            required: "请输入会员折扣",
                            positiveinteger: "会员折扣为正整数",
                            min: "会员折扣不能小于{0}",
                            max: "会员折扣不能大于{0}"
                        }
                    },
                    errorPlacement: function(error, element) {
                        _msg = error[0].innerText;
                    }
                });
            }
        };
    })();
    // 页面初始化
    MemRank.init();
    // 表单提交
    $allWrap.on('click', '.submit-form', function() {
        MemRank.submit();
    });
}(jQuery);
