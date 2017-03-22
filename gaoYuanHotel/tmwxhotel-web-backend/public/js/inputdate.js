! function() {
    $.fn.glDatePicker = function(a) {
        var b = this.data("glDatePicker");
        return b ? !0 === a ? b : this : this.each(function() {
            return $(this).data("glDatePicker", new O(this, a))
        })
    }, $.fn.glDatePicker.defaults = {
        cssName: "default",
        zIndex: 1e3,
        borderSize: 1,
        calendarOffset: {
            x: 0,
            y: 1
        },
        showAlways: !1,
        hideOnClick: !0,
        allowMonthSelect: !0,
        allowYearSelect: !0,
        todayDate: new Date,
        selectedDate: null,
        prevArrow: "\u25c4",
        nextArrow: "\u25ba",
        selectableDates: null,
        selectableDateRange: null,
        specialDates: null,
        selectableMonths: null,
        selectableYears: null,
        selectableDOW: null,
        monthNames: null,
        dowNames: null,
        dowOffset: 0,
        onClick: function(a, b, c) {
            var n = c.getFullYear(),
                y = c.getMonth() < 9 ? ('0' + (c.getMonth() + 1)) : (c.getMonth() + 1),
                d = c.getDate() < 10 ? ('0' + c.getDate()) : c.getDate();
            a.val(n + '-' + y + '-' + d).trigger('change')
        },
        onHover: function() {},
        onShow: function(a) {
            a.show()
        },
        onHide: function(a) {
            a.hide()
        },
        firstDate: null
    };
    var O = function() {
        function a(a, b) {
            var c = this;
            c.el = $(a);
            var d = c.el;
            c.options = $.extend(!0, {}, $.fn.glDatePicker.defaults, b);
            var e = c.options;
            c.calendar = $($.find("[gldp-el=" + d.attr("gldp-id") + " ]")), e.selectedDate = e.selectedDate || e.todayDate, e.firstDate = new Date(e.firstDate || e.selectedDate)._first(), (d.attr("gldp-id") || "").length || d.attr("gldp-id", "gldp-" + Math.round(1e10 * Math.random())), d.addClass("gldp-el").bind("click", function(a) {
                c.show(a)
            }).bind("focus", function(a) {
                c.show(a)
            }), c.calendar.length && !e.showAlways && c.calendar.hide(), $(document).bind("mouseup", function(a) {
                var a = a.target,
                    b = c.calendar;
                !d.is(a) && !b.is(a) && 0 === b.has(a).length && b.is(":visible") && c.hide()
            }), c.render()
        }
        return a.prototype = {
            show: function() {
                $.each($(".gldp-el").not(this.el), function(a, b) {
                    b.length && b.options.onHide(b.calendar)
                }), this.options.onShow(this.calendar)
            },
            hide: function() {
                this.options && !this.options.showAlways && this.options.onHide(this.calendar)
            },
            render: function(a) {
                var g = this,
                    d = g.el,
                    b = g.options,
                    c = g.calendar,
                    j = "gldp-" + b.cssName,
                    t = b.todayDate._val(),
                    u = t.time,
                    h = b.borderSize + "px",
                    y = function(a, b, c) {
                        for (var d = [], e = a; b >= e; e++) d.push(e);
                        if (c) {
                            var f = [];
                            $.each(c, function(c, d) {
                                d >= a && b >= d && 0 > f._indexOf(d) && f.push(d)
                            }), d = f.length ? f : d
                        }
                        return d.sort(), d
                    },
                    H = y(0, 11, b.selectableMonths),
                    v = y(t.year - 5, t.year + 5, b.selectableYears),
                    y = y(0, 6, b.selectableDOW),
                    z = b.dowNames || "Sun Mon Tue Wed Thu Fri Sat".split(" "),
                    t = b.monthNames || "January February March April May June July August September October November December".split(" "),
                    f = d.outerWidth(),
                    e, k = f / 7 + 6 * (b.borderSize / 7),
                    f = f / 8 + 7 * (b.borderSize / 8);
                c.length ? eval(c.data("is")) || (f = c.outerWidth(), e = c.outerHeight(), k = f / 7 + 6 * (b.borderSize / 7), f = e / 8 + 7 * (b.borderSize / 8)) : (g.calendar = c = $("<div/>").attr("gldp-el", d.attr("gldp-id")).data("is", !0).css({
                    display: b.showAlways ? void 0 : "none",
                    zIndex: b.zIndex,
                    width: 7 * k + "px"
                }), $("body").append(c)), d.is(":visible") || c.hide(), c.removeClass().addClass(j).children().remove(), j = function() {
                    var a = d.offset();
                    c.css({
                        top: a.top + d.outerHeight() + b.calendarOffset.y + "px",
                        left: a.left + b.calendarOffset.x + "px"
                    })
                }, $(window).resize(j), j();
                var j = {
                        width: k + "px",
                        height: f + "px",
                        lineHeight: f + "px"
                    },
                    f = function(a) {
                        for (var c = new Date(b.firstDate), a = a || 0; c.setMonth(c.getMonth() + a), c.setDate(Math.min(1, c._max())), 0 != a;) {
                            var d = c._val(),
                                e = d.year;
                            if (-1 != H._indexOf(d.month)) {
                                if (-1 != v._indexOf(e)) break;
                                if (e < v[0] || e > v[v.length - 1]) return null
                            }
                        }
                        return c
                    },
                    A = f(-1),
                    B = f(1),
                    f = b.firstDate = f();
                e = f._val();
                var I = e.month,
                    J = e.year,
                    f = new Date(f);
                e = Math.abs(Math.min(6, Math.max(0, b.dowOffset)));
                var l = f.getDay() - e,
                    l = 1 > l ? -7 - l : -l,
                    z = z.concat(z).slice(e, e + 7);
                for (f._add(l), e = $("<div/>").addClass(" core border monyear ").css($.extend({}, j, {
                        borderWidth: h + " 0 0 " + h
                    })).append($("<a/>").addClass("prev-arrow" + (A ? "" : "-off")).html(b.prevArrow)).mousedown(function() {
                        return !1
                    }).click(function(a) {
                        "" != b.prevArrow && A && (a.stopPropagation(), A && (b.firstDate = A, g.render()))
                    }), k = 5 * k - 5 * b.borderSize + b.borderSize, k = $("<div/>").addClass(" core border monyear title").css($.extend({}, j, {
                        width: k + "px",
                        borderTopWidth: h,
                        marginLeft: "-" + h
                    })), l = $("<div/>").addClass(" core border monyear ").css($.extend({}, j, {
                        marginLeft: "-" + h,
                        borderWidth: h + " " + h + " 0 0"
                    })).append($("<a/>").addClass("next-arrow" + (B ? "" : "-off")).html(b.nextArrow)).mousedown(function() {
                        return !1
                    }).click(function(a) {
                        "" != b.nextArrow && B && (a.stopPropagation(), B && (b.firstDate = B, g.render()))
                    }), c.append(e).append(k).append(l), l = e = 0; 7 > e; e++)
                    for (var q = 0; 7 > q; q++, l++) {
                        var C = new Date(f),
                            n = "day",
                            r = b.zIndex + l,
                            w = $("<div/>");
                        if (e) {
                            C._add(q + 7 * (e - 1));
                            var p = C._val(),
                                x = p.time,
                                K = null,
                                s = !0,
                                D = function(a, b) {
                                    return !0 === a.repeatYear && b.setYear(p.year), !0 === a.repeatMonth && b.setMonth(p.month), b._val()
                                };
                            w.html(p.date), b.selectableDateRange && (s = !1, $.each(b.selectableDateRange, function(a, b) {
                                var c = b.from,
                                    d = b.to || null,
                                    d = d || new Date(b.from.getFullYear(), b.from.getMonth(), b.from._max()),
                                    c = D(b, c),
                                    d = D(b, d);
                                return x >= c.time && x <= d.time ? s = !0 : void 0
                            })), b.selectableDates && ((b.selectableDateRange && !s || s && !b.selectableDateRange) && (s = !1), $.each(b.selectableDates, function(a, b) {
                                return D(b, b.date).time == x ? s = !0 : void 0
                            })), !s || 0 > v._indexOf(p.year) || 0 > H._indexOf(p.month) || 0 > y._indexOf(p.day) ? n = "noday" : (n = "sun mon tue wed thu fri sat".split(" ")[p.day], I != p.month && (n += " outday"), u == x && (n = "today", r += 50), b.selectedDate._time() == x && (n = "selected", r += 51), b.specialDates && $.each(b.specialDates, function(a, b) {
                                D(b, b.date).time == x && (n = b.cssClass || "special", r += 52, K = b.data)
                            }), w.mousedown(function() {
                                return !1
                            }).hover(function(a) {
                                a.stopPropagation(), a = $(this).data("data"), b.onHover(d, w, a.date, a.data)
                            }).click(function(a) {
                                a.stopPropagation(), a = $(this).data("data"), b.selectedDate = b.firstDate = a.date, g.render(function() {
                                    !b.showAlways && b.hideOnClick && g.hide()
                                }), b.onClick(d, $(this), a.date, a.data)
                            }))
                        } else n = "dow", w.html(z[q]), C = null;
                        $.extend(j, {
                            borderTopWidth: h,
                            borderBottomWidth: h,
                            borderLeftWidth: e > 0 || !e && !q ? h : 0,
                            borderRightWidth: e > 0 || !e && 6 == q ? h : 0,
                            marginLeft: q > 0 ? "-" + h : 0,
                            marginTop: e > 0 ? "-" + h : 0,
                            zIndex: r
                        }), w.data("data", {
                            date: C,
                            data: K
                        }).addClass(" core border " + n).css(j), c.append(w)
                    }
                var N = function(a) {
                        b.allowMonthSelect && (L.css({
                            display: a ? "inline-block" : "none"
                        }), E.css({
                            display: a ? "none" : "inline-block"
                        })), b.allowYearSelect && (M.css({
                            display: a ? "none" : "inline-block"
                        }), F.css({
                            display: a ? "inline-block" : "none"
                        }))
                    },
                    u = function() {
                        b.firstDate = new Date(F.val(), E.val(), 1), g.render()
                    },
                    E = $("<select/>").hide().change(u),
                    F = $("<select/>").hide().change(u),
                    L = $("<span/>").html(t[I]).mousedown(function() {
                        return !1
                    }).click(function(a) {
                        a.stopPropagation(), N(!1)
                    }),
                    M = $("<span/>").html(J).mousedown(function() {
                        return !1
                    }).click(function(a) {
                        a.stopPropagation(), N(!0)
                    });
                $.each(t, function(a, c) {
                    if (b.allowMonthSelect && -1 != H._indexOf(a)) {
                        var d = $("<option/>").html(c).attr("value", a);
                        a == I && d.attr("selected", "selected"), E.append(d)
                    }
                }), $.each(v, function(a, c) {
                    if (b.allowYearSelect) {
                        var d = $("<option/>").html(c).attr("value", c);
                        c == J && d.attr("selected", "selected"), F.append(d)
                    }
                }), u = $("<div/>").append(L).append(E).append(M).append(F), k.children().remove(), k.append(u), (a || function() {})()
            }
        }, a
    }();
    Date.prototype._clear = function() {
        return this.setHours(0), this.setMinutes(0), this.setSeconds(0), this.setMilliseconds(0), this
    }, Date.prototype._time = function() {
        return this._clear().getTime()
    }, Date.prototype._max = function() {
        return [31, 28 + (1 == new Date(this.getYear(), 1, 29).getMonth() ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.getMonth()]
    }, Date.prototype._add = function(a) {
        this.setDate(this.getDate() + a)
    }, Date.prototype._first = function() {
        var a = new Date(this);
        return a.setDate(1), a
    }, Date.prototype._val = function() {
        return this._clear(), {
            year: this.getFullYear(),
            month: this.getMonth(),
            date: this.getDate(),
            time: this.getTime(),
            day: this.getDay()
        }
    }, Array.prototype._indexOf = function(a) {
        return $.inArray(a, this)
    }
}();
