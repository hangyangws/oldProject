/**
 * [首页控制器]
 * @return {[User - project object]}    [Feng Jie production]
 */
;
! function($) {
    "use strict";
    var $goodsWrap = $('#goodsWrap');
    var Fav = (function() {
        var _operation = true,
            $fav = $goodsWrap.find('.fav-choice'),
            $allChecked = $goodsWrap.find('.all-checked'),
            _fav_num = $fav.length,
            _checked_num = 0;
        return {
            del: function(_ids) {
                var _i = _ids.length;
                if (_i > 0) {
                    $.ajax({
                        type: 'POST',
                        url: global.delCollectionPackage,
                        dataType: 'json',
                        data: {
                            pids: _ids
                        },
                        success: function(r) {
                            if (r.status === 'success') {
                                while (_i--) {
                                    $goodsWrap.find('.goods-item[data-id="' + _ids[_i] + '"]').slideUp(340, function() {
                                        $(this).remove();
                                        $fav = $goodsWrap.find('.fav-choice');
                                        _fav_num = $fav.length;
                                    });
                                };
                            };
                        }
                    });
                };
            },
            checked: function($this) {
                $this[0].checked ? _checked_num++ : _checked_num--;
                $allChecked[0].checked = (_fav_num === _checked_num);
            },
            allChecked: function($this) {
                var _i = _fav_num,
                    _n = $this[0].checked;
                while (_i--) {
                    $fav[_i].checked = _n;
                };
                _checked_num = (_n ? _fav_num : 0);
            },
            mulCancel: function() {
                var _i = _fav_num,
                    pids = [];
                while (_i--) {
                    $fav[_i].checked && pids.push($fav.eq(_i).closest('.goods-item').data('id'));
                };
                Fav.del(pids);
            }
        };
    })();
    // 删除收藏
    $goodsWrap.on('click', '.fav-cancel', function() {
        Fav.del([$(this).closest('.goods-item').data('id')]);
    });
    // 删除选中收藏
    $goodsWrap.on('click', '.mul-cancel', function() {
        Fav.mulCancel();
    });
    $goodsWrap.on('change', '.fav-choice', function() {
        Fav.checked($(this));
    });
    $goodsWrap.on('change', '.all-checked', function() {
        Fav.allChecked($(this));
    });
}(jQuery);
