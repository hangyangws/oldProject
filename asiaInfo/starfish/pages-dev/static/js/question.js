/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-11-03.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $question = $('#question'),
        Project = {
            questionClick: function() {
                var $this = $(this);
                if ($this.is('.p-ques-active')) {
                    $this.removeClass('p-ques-active p-ques-show');
                } else {
                    $this.addClass('p-ques-show');
                    setTimeout(function() {
                        $this.addClass('p-ques-active');
                    }, 10);
                }
            }
        };
    /**
     * event binding
     */
    $question
        .on(win.method, '.j-plan-question', Project.questionClick); // 问题点击
}(window || this, Zepto);
