/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-03-04.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $departCon = $('#departCon'),
        Project = {
            init: function() {
                // 加载数据
                Project.loadData(Project.render);
            },
            loadData: function(_callback) {
                F.ajax({
                    type: 'POST',
                    url: win.G.statisticsUrl,
                    yes: function(_data) {
                        _data = _data.data;
                        var _html = [],
                            _key;
                        for (_key in _data) {
                            _html.push(
                                win._tp.depart
                                .replace('{{name}}', _key)
                                .replace('{{data}}', Project.getRate(_data[_key]))
                            );
                        }
                        $departCon.html(_html.join(''));
                        _callback && _callback();
                    }
                });
            },
            render: function() {
                var $con = $departCon.find('.j-type-con'),
                    $charts;
                $con.forEach(function($typecon) {
                    // 宽度改变
                    $typecon.style.width = 7.4 * $typecon.children.length - 0.6 + 'rem';
                    // 插件依次调用
                    $charts = $($typecon).find('.j-type-chart');
                    $charts.forEach(function($chart) {
                        new win.Sector($chart, $chart.dataset.rate, 'right')
                    });
                });
            },
            getRate: function(_rate_arr) {
                var _html = [],
                    rateHandle = function(_part) {
                        _html.push(
                            win._tp.data
                            .replace('{{areaid}}', _part.areaid)
                            .replace('{{depid}}', _part.depid)
                            .replace(/{{rate}}/g, _part.rate)
                            .replace('{{areaname}}', _part.areaname)
                        );
                    };
                _rate_arr.forEach(rateHandle);
                return _html.join('');
            },
            jump: function() {
                var _href = this.dataset.href;
                if (_href) {
                    win.location.href = _href;
                }
            }
        };
    Project.init();

    /**
     * event binding
     */
    $departCon
        .on(win.method, '.j-jump', Project.jump); // 页面跳转
}(window || this, Zepto);
