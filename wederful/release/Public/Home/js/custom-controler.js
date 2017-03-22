/**
 * [定制页控制器]
 * @return {[Pj - project object]}    [Feng Jie production]
 */

;! function($) {
    "use strict";
    var Pj = (function() {
        /**
         * [首页轮播]
         */
        var $inputDom = $('#main').find('.input-item'),
            _submit = true;
        return {
            changeContact: function($this) {
                $this.closest('.contact-wrap').find('.contact-name').html($this.html()).end()
                                              .find('.contact-input').attr({
                                                'name': $this.data('name'),
                                                'placeholder': '请输入' + $this.html()
                                              });
            },
            submit: function($this) {
                var _data = {},
                    $this_dom,
                    _input_l;
                if (_submit) {
                    _submit = false;
                    _input_l = $inputDom.length;

                    // 检验是否为空
                    while(_input_l--) {

                        $this_dom = $inputDom.eq(_input_l);

                        if ($this_dom.data('need') === true && $.trim($this_dom.val()) === '') {
                            Pj.inputTip($this_dom, '不能为空');
                            break;
                        } else {
                            _data[$this_dom.attr('name')] = $.trim($this_dom.val());
                        };
                    };

                    // 为 -1  表示 正确
                    if (_input_l === -1) {
                        $this.html('提交中...');
                        $.ajax({
                            type: 'POST',
                            url: global.customMessageUrl,
                            dataType: 'json',
                            data: _data,
                            success: function(r) {
                                if (r.status === 'success') {
                                    // 提示成功
                                    $mask.html('<img class="middle" src="' + global.imgUrl + 'letter.png" alt="提交成功 succes" />').fadeIn(400);
                                    setTimeout(function() {
                                        location.reload(true);
                                    }, 4000);
                                } else {
                                    $.remaind(r.message, true);
                                };
                                _submit = true;
                                $this.html('提交');
                            },
                            error: function() {
                                $.remaind('网络堵塞', true);
                                $this.html('提交');
                                _submit = true;
                            }
                        });
                    };
                };
            },
            inputTip: function($dom, _text) {
                $dom.val(_text).css('color', '#f33');
                setTimeout(function() {
                    $dom.val('').css('color', '#fff');
                    _submit = true;
                }, 1000);
            }
        };
    })();

    // 改变联系方式
    $('#main').on('click', '.contact-type', function() {
        Pj.changeContact($(this));
    });

    //提交
    $('#main').on('click', '.form-submit', function() {
        Pj.submit($(this));
    });
}(jQuery);