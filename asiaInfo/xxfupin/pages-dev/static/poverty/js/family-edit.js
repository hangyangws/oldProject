/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-28.
 * 此文件在多个html中应用，修改时注意
 */

;
! function(win, $, undefined) {
    'use strict';
    var $conWrap = $('#conWrap'),
        $form = $conWrap.find('.j-form'),
        _fields = [],
        verifyData = new F.Verify($conWrap),
        $banqian = $conWrap.find('.j-banqian-tit'),
        banqianData = new F.Verify($banqian),
        Project = {
            init: function() {
                // 下拉框value检测（有值高亮）
                var $select;
                $conWrap.find('select').forEach(function(_d) {
                    $select = $(_d);
                    $select.val() && $select.addClass('select-active');
                });
            },
            submit: function() {
                var _data;
                // 验证是否是“异地搬迁情况”页面
                if (win.G.type === 'banqian') {
                    // 验证"是否搬迁户"
                    var _bq_data = banqianData.go();
                    if (_bq_data && $banqian.find('input:checked').val() === '0') {
                        _data = banqianData.go();
                    } else {
                        _data = verifyData.go();
                    }
                } else {
                    _data = verifyData.go();
                }
                if (_data) {
                    F.ajax({
                        data: _data,
                        type: 'POST',
                        url: win.G.submit_url,
                        yes: function() {
                            F.jump({
                                msg: win.G.tit + '成功',
                                url: win.G.user_url
                            });
                        }
                    });
                }
            },
            moveSwitch: function() {
                var $bq = $conWrap.find('.j-banqian-con');
                if ($(this).val() === '1') {
                    $bq.removeClass('none');
                } else {
                    $bq.addClass('none').find('input:checked').each(function() {
                        $(this).prop('checked', false);
                    });
                }
            },
            chagneSelect: function() {
                var $select = $(this);
                $select[$select.val() ? 'addClass' : 'removeClass']('select-active');
            }
        };
    /**
     * 项目初始化
     */
    Project.init();

    /**
     * event binding
     */
    $conWrap
        .on(win.method, '.j-submit', Project.submit) // 提交数据
        .on('change', 'select', Project.chagneSelect); // select改变

    if (win.G.type === 'banqian') {
        $conWrap
            .on('change', '.j-banqian-type input', Project.moveSwitch); // 异地搬迁情况选择
    }
}(window || this, Zepto);
