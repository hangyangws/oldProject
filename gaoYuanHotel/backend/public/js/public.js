// made by hangyangws
! function($) {
    // jQuery 自定义插件
    $.extend({
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
        getK: function(e) {
            var e = $.getE(e);
            return e.keyCode || e.which || e.charCode;
        },
        cloneObj: function(o) {
            var _obj = {},
                _k,
                _val = null;
            if (o instanceof Array) {
                _obj = [];
            };
            for (_k in o) {
                _val = o[_k];
                _obj[_k] = (typeof _val === 'object') ? arguments.callee(_val) : _val;
            }
            return _obj;
        }
    });
}(jQuery);

// 自定义工具
var tools = (function() {
    'use strict';
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
            if (_dot_index > -1) {
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
        },
        //判断js对象是否为空
        isEmptyObject: function(_obj) {
            // 返回true表示空对象
            var i;
            for (i in _obj) {
                return false;
            };
            return true;
        }
    };
})();
