/**
 * created by hangyangws in 2016-03-21
 */
;
! function($) {
    "use strict";
    var $star = $('#body').find('.star'),
        _star_l = $star.length,
        _num,
        _l,
        _temp;
    while (_star_l--) {
        _num = $star.eq(_star_l).attr('data-num');
        _l = ~~_num;
        _temp = [];
        while (_l--) {
            _temp.push('<li></li>');
        }
        (_num.indexOf('.') !== -1) && _temp.push('<li class="unfull"></li>');
        $star.eq(_star_l).html(_temp.join(''));
    }
}(Zepto);
