;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-22.
 * [菜品信息]
 */

! function(win, $, undefined) {
    'use strict';
    var $listWrap = $('#listWrap'),
        $mask = $('#mask'),
        _start_x = 0, // 触摸开始的位置
        _move_l = -75, // 当前激活元素移动的距离
        _none_food_html = $('#noneFood').html(),
        _is_ajax = true,
        FoodInfo = {
            touchStart: function(e, $this) {
                var $active = $listWrap.find('.food-item.active');
                if (typeof $active[0] !== 'undefined' && $active[0] !== $this[0]) {
                    // 重置其他列表位置
                    FoodInfo.changeX($active.removeClass('active').find('.food-edit'), 0);
                }
                $this.addClass('active');
                _start_x = e.changedTouches[0].clientX;
            },
            touchMove: function(_x, $this) {
                _move_l = _move_l + (_x - _start_x);
                _move_l < -78 && (_move_l = -78);
                _move_l > 0 && (_move_l = 0);
                FoodInfo.changeX($this.find('.food-edit'), _move_l);
            },
            touchMoveEnd: function(e, $this) {
                if (_move_l < -30) {
                    FoodInfo.changeX($this.find('.food-edit'), -78);
                } else {
                    FoodInfo.changeX($this.find('.food-edit'), 0);
                    $this.removeClass('active');
                }
            },
            changeX: function($this, _x) {
                $this.css({
                    '-webkit-transform': 'translate3d(' + _x + 'px, 0, 0)',
                    '-moz-transform': 'translate3d(' + _x + 'px, 0, 0)',
                    '-o-transform': 'translate3d(' + _x + 'px, 0, 0)',
                    'transform': 'translate3d(' + _x + 'p, 0, 0x)'
                });
            },
            del: function($foodItem) {
                if (_is_ajax) {
                    win.oConfrim('确认删除此菜品', false, function() {
                        _is_ajax = false;
                        win.cConfrim();
                        $.ajax({
                            url: '/food/del',
                            type: 'DELETE',
                            dataType: 'json',
                            data: { id: $foodItem.data('id') },
                            success: function(_data) {
                                if (_data.status) {
                                    // 删除dom
                                    $foodItem.addClass('del');
                                    setTimeout(function() {
                                        $foodItem.remove();
                                        // 检测是不是最后一个
                                        if ($listWrap.find('.food-item').length === 0) {
                                            $listWrap.html(_none_food_html);
                                        }
                                    }, 800);
                                } else {
                                    win.oConfrim(_data.msg, true);
                                }
                                _is_ajax = true;
                            },
                            error: function() {
                                win.oConfrim('操作失败', true);
                                _is_ajax = true;
                            }
                        });
                    });
                }
            },
            edit: function($foodItem) {
                var _id = $foodItem.data('id');
                if (G.device == 1) {
                    // Android
                    win.android.toDishes(_id);
                } else {
                    // IOS
                    var para = [
                        'EditFood',
                        _id
                    ];
                    location.href = 'objc://' + para.join(':/');
                }
            }
        };
    /**
     * 事件绑定
     */
    $listWrap.on('touchstart', '.food-item', function(e) { // 左滑菜品
        FoodInfo.touchStart(e, $(this))
    }).on('touchmove', '.food-item', function(e) {
        FoodInfo.touchMove(e.changedTouches[0].clientX, $(this));
    }).on('touchend', '.food-item', function(e) {
        FoodInfo.touchMoveEnd(e, $(this));
    }).on('touchcancel', '.food-item', function(e) {
        FoodInfo.touchMoveEnd(e, $(this));
    }).on('tap', '.del-btn', function() { // 删除菜品
        FoodInfo.del($(this).closest('.food-item'));
    }).on('tap', '.edit-btn', function() { // 编辑菜品
        FoodInfo.edit($(this).closest('.food-item'));
    });
}(window || this, Zepto);
