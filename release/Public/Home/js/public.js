// made by hangyangws
var $mask = $('#mask'),
    $body = $('#body');
(function($) {
    // jQuery 自定义插件
    $.extend({
        remaind: function(text, type) {

            $mask.html(Pj.$remaind);

            if (type) {
                $('#remaindMessage').css('color', '#f33').html(text);
            } else {
                $('#remaindMessage').css('color', '#0c9').html(text);
            };

            Pj.maskShow(true);
        },

        showMask: function(type) {

            Pj.maskShow(type);
        },

        // 验证手机号码
        cTel: function(_v) {
            var _reg = /(^13\d{9}$)|(^14)[5,7]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[6,7,8]\d{8}$|(^18\d{9}$)/g;
            return _v.length === 11 && _reg.test(_v) ? true : false;
        },

        cEmail: function(_v) {
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(_v);
        },

        getE: function(e) {
            return e || window.event || arguments.callee.caller.arguments[0];
        },

        getKey: function(e) {
            e = $.getE(e);
            return e.keyCode || e.which || e.charCode;
        },

        cloneObj: function(o) {
            var newO = {},
                key;

            if (o instanceof Array) {
                newO = [];
            };

            for (key in o) {
                var val = o[key];
                newO[key] = (typeof val === 'object') ? arguments.callee(val) : val;
            }
            return newO;
        }
    });
    // 全局方法
    var Pj = (function() {
        var G = {
            $numOnly: $('.only-num')
        };
        return {
            $remaind: ['<div class="middle remaind-wrap r4 ofh">',
                '<span id="remaindMessage"></span>',
                '<span class="remaind-confirm close-mask ts4-live">确定</span>',
                '</div>'
            ].join(''),
            ini: function() {
                G.$numOnly.length > 0 &&
                    $('.only-num').on('keyup', function(e) {
                        if ([37, 38, 39, 40, 46, 13, 8].indexOf($.getKey(e)) !== -1) { // 四个方向键 delete 回车 backspace
                            return;
                        }
                        $(this).val($(this).val().replace(/\D/gi, ''));
                    });
                delete G.$numOnly;
            },
            maskShow: function(type) {
                type && (
                    $mask.fadeIn(400)
                ) || (
                    $mask.fadeOut(400).html('')
                );
            }
        };
    })();

    Pj.ini();

    // close-mask
    $('#mask, #body').on('click', '.close-mask', function() {
        Pj.maskShow(false);
    });

    $mask.on('click', function(e) {
        e = $.getE(e);
        e = e.srcElement || e.target;
        e.id === 'mask' && Pj.maskShow(false);
    });

})(jQuery);

// 自定义工具
var tools = (function() {
    return {
        Cookie: function(c_name) {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(c_name + "="),
                    c_end;
                if (c_start !== -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end === -1) {
                        c_end = document.cookie.length;
                    };
                    return document.cookie.slice(c_start, c_end);
                };
            };
            return '';
        },

        addCookie: function(name, value, days) {
            var date;
            date = new Date();
            date.setTime(date.getTime() + days * 86400000);
            document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toGMTString() + "; path=/";
        },

        delCookie: function(name) {
            this.addCookie(name, "", -1);
        },

        toThousands: function(n) {
            var _dot_index,
                fix = '', // 包括小数点后面的字符串
                result = '';
            n += '';
            _dot_index = n.indexOf('.');
            if (_dot_index >-1) {
                fix = n.slice(_dot_index);
                n = n.slice(0, _dot_index);
            };
            while (n.length > 3) {
                result = ',' + n.slice(-3) + result;
                n = n.slice(0, n.length - 3);
            };
            if (n) {
                result = n + result;
            };
            return result + fix;
        },

        addNum: function(n1, n2) {
            var s1, s2;
            try {
                s1 = n1.toString().split(".")[1].length;
            } catch (e) {
                s1 = 0;
            }
            try {
                s2 = n2.toString().split(".")[1].length;
            } catch (e) {
                s2 = 0;
            }
            s1 = Math.pow(10, Math.max(s1, s2));
            return (~~(n1 * s1) + ~~(n2 * s1)) / s1;
        },

        sunNum: function(n1, n2) {
            var l1, l2;
            try {
                l1 = n1.toString().split(".")[1].length;
            } catch (e) {
                l1 = 0;
            }
            try {
                l2 = n2.toString().split(".")[1].length;
            } catch (e) {
                l2 = 0;
            }
            l1 = Math.pow(10, Math.max(l1, l2)); // 该除的10次方数
            return ~~(~~(n1 * l1) * ~~(n2 * l1)) / (l1 * l1);
        }
    };
})();
