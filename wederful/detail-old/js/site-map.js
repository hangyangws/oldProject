! function() {
  // mapbox
  var setMap = (function() {
    var map = null, // mapbox初始化变量
      lg = $('#siteMapBox h3').attr('data-lg').split(','), // 主要地点经纬度
      scrW = 0,
      moveL = 0,
      layer = null,
      g = {
        type: 'FeatureCollection',
        features: gVar.getgeojson()
      },
      w = g.features.length;
    return {
      ini: function() {
        var self = this;
        // 防止恶意内存攻击 释放地图变量内存 转存至虚拟内存
        delete gVar.getgeojson;
        // 初始化地图
        L.mapbox.accessToken = 'pk.eyJ1IjoiaGFuZ3lhbmd3YXMiLCJhIjoiY2E3YjZmZGZhNDMzNmJmMjQ2MDJhZmUwZWYwMDZkY2UifQ.uR6E8hClwJdPRd98g7x4lQ';
        map = L.mapbox.map('siteMap', 'mapbox.streets', {
          attributionControl: {
            compact: true
          }
        }).setView([+lg[0], +lg[1]], 10);
        map.scrollWheelZoom.disable();
        // 交换经纬顺序（mapbox是按照纬经顺序）
        while (w--) {
          g.features[w].geometry.coordinates.reverse();
        }
        // 添加层
        layer = L.mapbox.featureLayer().addTo(map);
        // layer 交互 marker 效果
        layer.on('click', function(e) {
          self.setView(e.layer._latlng.lat, e.layer._latlng.lng);
        });
        layer.on('layeradd', function(e) {
          var marker = e.layer,
            feature = marker.feature;
          marker.setIcon(L.icon(feature.properties.icon));
        });
        layer.on('mouseover', function(e) {
          e.layer.openPopup();
        });
        // 添加marker
        layer.setGeoJSON(g);

        // 展开主要的marker
        layer.eachLayer(function(m) {
          var popupContent = '<div class="fcm f16 fb mb5">' + m.feature.properties.title + '</div><div class="fc6 f13 lh150">' + m.feature.properties.description + '</div>';
          m.bindPopup(popupContent, {
            maxWidth: 240
          });
          if (+lg[0] === m._latlng.lat && +lg[1] === m._latlng.lng) {
            m.openPopup();
          }
        });

        // 设置mapbox信息提示框的初始位置
        self.moveBox();
      },

      moveBox: function() {
        // 移动地图悬浮层
        scrW = ($(document).width() - 900) / 2;
        movel = scrW > 0 ? scrW + 25 : 25;
        $('#siteMapBox').css({
          '-ms-transform': 'translateX(' + movel + 'px)',
          '-o-transform': 'translateX(' + movel + 'px)',
          '-moz-transform': 'translateX(' + movel + 'px)',
          '-webkit-transform': 'translateX(' + movel + 'px)',
          'transform': 'translateX(' + movel + 'px)'
        });
      },

      setView: function(l, g) {
        layer.eachLayer(function(m) {
          if (l === m._latlng.lat && g === m._latlng.lng) {
            map.setView([l, g], 10);
            m.openPopup();
          }
        });
      }
    };
  })();


  // mapbox地图
  setMap.ini();

  // 窗口大小改变事件(共用)
  $(window).resize(function() {
    if ($(document).width() > 500) {
      // 调节mapbox 地图提示信息框的位置
      setMap.moveBox();
    }
  });

  // 地图点击相应的地区
  $('#siteMapBox h3, #siteMapBox li[data-lg]').bind('click', function() {
    var lg = $(this).attr('data-lg').split(',');
    setMap.setView(+lg[0], +lg[1]);
  });
}()
