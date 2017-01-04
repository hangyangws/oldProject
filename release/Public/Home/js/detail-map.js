/**
 * mapBox 设置地图marker交互 和自定义窗口交互
 * fj in 2015-10-30
 */

! function($) {
    "use strict";
    var setMap = (function() {
        var map = null, // mapbox初始化变量
            scrW = 0,
            moveL = 0,
            layer = null,
            $mapBox = $('#map').find('.map-box'),
            $mapEx = $('#mapExCon').find('section'),
            now = 0, // 推荐周边地方
            length = $mapEx.find('.ex-lg').length;
        return {
            ini: function() {
                var self = this,
                    lg = $('#map').find('.center-lg').data('lg').split(','), // 主要地点经纬度
                    g = {
                        type: 'FeatureCollection',
                        features: Map.getgeojson()
                    },
                    w = g.features.length;
                // 防止恶意内存攻击 释放地图变量内存 转存至虚拟内存
                delete Map.getgeojson;
                // 初始化地图
                L.mapbox.accessToken = 'pk.eyJ1IjoiaGFuZ3lhbmd3YXMiLCJhIjoiY2E3YjZmZGZhNDMzNmJmMjQ2MDJhZmUwZWYwMDZkY2UifQ.uR6E8hClwJdPRd98g7x4lQ';
                map = L.mapbox.map('mapBox', 'mapbox.streets', { // 给id 为mapBox 的 节点初始化为地图
                    attributionControl: {
                        compact: true // 地图右下角的水印为紧凑版
                    }
                }).setView([+lg[0], +lg[1]], 10); // 设置初始地图位置和放缩大小
                // 禁止鼠标滚动放缩
                map.scrollWheelZoom.disable();
                // 交换经纬顺序（mapbox是按照纬经顺序）
                while (w--) {
                    g.features[w].geometry.coordinates.reverse();
                };
                // 给地图添加交互层
                layer = L.mapbox.featureLayer().addTo(map);
                // layer交互marker点击效果
                layer.on('click', function(e) {
                    self.setView(e.layer._latlng.lat, e.layer._latlng.lng);
                });
                layer.on('layeradd', function(e) {
                    var marker = e.layer,
                        feature = marker.feature; // feature 代表当前点
                    marker.setIcon(L.icon(feature.properties.icon)); // 给当前点设置图标路径
                });
                layer.on('mouseover', function(e) {
                    e.layer.openPopup();
                });
                // 添加marker
                layer.setGeoJSON(g);

                // 展开主要的marker
                layer.eachLayer(function(m) {
                    var popupContent = '<div class="fcm fs16 fb mb5">' + m.feature.properties.title + '</div><div class="fc6 lh150">' + m.feature.properties.description + '</div>';
                    m.bindPopup(popupContent, {
                        maxWidth: 240
                    });
                    (+lg[0] === m._latlng.lat && +lg[1] === m._latlng.lng) && m.openPopup();
                });

                // 检测自定义窗口数据数量 (小于三条就移除控制箭头)
                length < 4 && $('#mapExPrev').add('#mapExNext').remove();
                // 设置mapbox信息提示框的初始位置
                self.moveBox();
            },

            moveBox: function() {
                // 移动地图悬浮层
                scrW = ($(document).width() - 1000) / 2;
                moveL = scrW > 0 ? scrW : 0;
                $mapBox.css({
                    '-ms-transform': 'translateX(' + moveL + 'px)',
                    '-o-transform': 'translateX(' + moveL + 'px)',
                    '-moz-transform': 'translateX(' + moveL + 'px)',
                    '-webkit-transform': 'translateX(' + moveL + 'px)',
                    'transform': 'translateX(' + moveL + 'px)'
                });
            },

            setView: function(l, g) {
                layer.eachLayer(function(m) {
                    (l === m._latlng.lat && g === m._latlng.lng) && (
                        map.setView([l, g], 10),
                        m.openPopup()
                    )
                });
            },

            mapExMove: function(dre) {
                // console.log(now);
                var l,
                    deal = {
                        up: function() {
                            (now > 0 && now <= length - 3) && now--;
                        },
                        down: function() {
                            (now >= 0 && now < length - 3) && now++;
                        }
                    };
                deal[dre]();
                l = -now * 28;
                $mapEx.css({
                    '-ms-transform': 'translateY(' + l + 'px)',
                    '-o-transform': 'translateY(' + l + 'px)',
                    '-moz-transform': 'translateY(' + l + 'px)',
                    '-webkit-transform': 'translateY(' + l + 'px)',
                    'transform': 'translateY(' + l + 'px)'
                });
            }
        };
    })();

    // mapbox地图
    setMap.ini();

    // 窗口大小改变事件(共用)
    $(window).resize(function() {
        $(document).width() > 600 && setMap.moveBox(); // 调节mapbox 地图提示信息框的位置
    });

    // 地图点击相应的地区
    $('#map').on('click', '.map-lg', function() {
        var lg = $(this).data('lg').split(',');
        setMap.setView(+lg[0], +lg[1]);
    });

    // 上一个推荐地点
    $('#mapExPrev').on('click', function() {
        setMap.mapExMove('up');
    });
    // 下一个推荐地点
    $('#mapExNext').on('click', function() {
        setMap.mapExMove('down');
    });
}(jQuery);
