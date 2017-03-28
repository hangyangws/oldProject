/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-03-07.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $perviewWrap = $('#perviewWrap'),
        Project = {
            init: function() {
                var $time = $perviewWrap.find('.j-perview-time');
                $time.html($time.data('time').replace(/-/g, '/').replace(' ', ' - '));
            }
        };
    Project.init();
}(window || this, Zepto);
