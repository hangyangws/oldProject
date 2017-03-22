/**
 * [首页控制器]
 * @return {[Links - project object]}    [Feng Jie production]
 */

;
! function($) {
    "use strict";
    var Links = (function() {
        return {
            toggle: function($this) {
                $this.parent().siblings().removeClass('active').end().toggleClass('active');
            }
        };
    })();

    $('#main').on('click', '.toggle-show-head', function() {
        Links.toggle($(this));
    });
}(jQuery);
