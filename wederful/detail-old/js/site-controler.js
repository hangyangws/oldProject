"use strict";
// 场地控制器 make by hangyangws
! function(global, factory) {
  factory(global);
}(typeof window !== "undefined" ? window : this, function(w) {
  w.project = (function() {
    var f_like = true, // 旗帜 - 是否能收藏
      f_order = true, // 旗帜 - 是否能下订单
      imgMt_d = $('#siteIntro'), // 封面margin-top 的节点
      img_d = $('#siteImg'), // 封面大图
      re_time, // 窗口改变大小时间id
      n = (function() { // 场地图片轮播实际渲染图片数量的一半（奇数的情况向下取整）
        var l = $('#miniCarousel li').length,
          h = $('#miniCarousel').html();
        if (l < 5) {
          if (l < 3) {
            $('#miniCarousel').html(h + h + h + h);
            return l * 2;
          } else {
            $('#miniCarousel').html(h + h);
            return l;
          }
        }
        return ~~(l / 2);
      })(),
      ulW = n * 628, // 轮播器左边宽度
      scrW = 0, // 图片轮播器宽口主体左边宽度
      movel = 0, // 轮播器移动距离
      moveL = 0, // 轮播器控制按钮距离
      now = 0, // 其他推荐 现在位置
      all = Math.ceil($('#carouselOther li').length / 2) - 1, // 其他推荐 总共轮数
      d = $('#carouselOther ul'), // 其他推荐轮播器ul元素
      f_pack = false, // 防止手动篡改执行对象 验证旗帜
      Pack = function() {
        var _pack = gVar.getPack(); // 为防止恶意改变地址和变量 提前提取pack到全局渲染私有变量 --- (注：此变量是会和订单交互 十分重要)
        // 私有方法
        this.getPack = function() { // 返回 本package全部的套餐数组
          return _pack;
        };
        this.setPack = function(p) {
          if (f_pack) {
            f_pack = false;
            _pack = p;
          }
        };
      },
      pack = new Pack(), //实例化套餐对象
      calendar = (function() {
        // var t_Obj = {},
        //     t_pack = pack.getPack(),
        //     t_p_l = t_pack.length,
        //     t_id;
        // while (t_p_l--) {
        //     t_id = t_pack[t_p_l].goods.id;
        //     $.ajax({
        //         type: 'GET',
        //         async: false, // 浏览器可能会提示同步会堵塞 但是在本页面忽略提示
        //         url: 'temp/' + t_pack[t_p_l].goods.id,
        //         dataType: 'json',
        //         success: function(t) {
        //             t_Obj[t_pack[t_p_l].goods.id] = t;
        //         }
        //     });
        // }
        // console.log(t_Obj);
        // return t_Obj;
      })();
    return {
      /*
      *********************************
      场地方法
      */

      // 场地初始化操作
      site_ini: function() {
        var target = null, //页面的url hash
          d_unoder = $('#siteUnoder').find('li'),
          unoder_l = d_unoder.length,
          // 封面大图和logo加载完成事件
          imgLoad = (function() {
            var img = $('#siteLogo').find('img'), // 场地logo
              d = img[0],
              t = setInterval(function() {
                if (img_d[0].complete) {
                  clearInterval(t);
                  // 封面大图下面的元素加上margin-top
                  project.imgMargin();
                  // 图片景深效果
                  img_d.delay(200).show(function() {
                    $(this).addClass('ts7').removeClass('site-img');
                  });
                }
              }, 200),
              t2 = setInterval(function() {
                if (d.complete) {
                  clearInterval(t2);
                  // 场地logo自适应
                  img.width() / img.height() > 1 ? d.style.width = 156 + 'px' : d.style.height = 104 + 'px';
                }
              }, 200); 
          })(),
          unoder_c = [{
            b: 'ccc',
            f: '444'
          }, {
            b: 'bbb',
            f: '444'
          }, {
            b: 'aaa',
            f: '333'
          }, {
            b: '999',
            f: '333'
          }, {
            b: '777',
            f: 'fff'
          }, {
            b: '666',
            f: 'fff'
          }, {
            b: '555',
            f: 'fff'
          }, {
            b: '444',
            c: 'fff'
          }],
          i_w = $('#siteInfo').find('li').first().find('div').width();
        // 基本介绍图标左对齐检测
        i_w < 140 && $('#siteInfo').css('margin-left', (i_w - 140) / 2 + 'px');
        // 防止恶意内存攻击和数据泄露 转存至虚拟内存后 释放套餐信息变量内存
        delete gVar.getPack;
        // target 默认展开 (收藏返回)
        target = $('#' + location.hash.replace(/#/g, ''));
        if (target.length) {
          target.addClass('active');
          setTimeout(function() {
            var top = target.offset().top - 50;
            $('html, body').animate({
              "scrollTop": top + 'px'
            }, 400);
          }, 1200);
        }
        // 场地描述是否够高
        if ($('.site-desc div').height() <= 220) {
          $('#descFlex').remove();
        } else {
          $('.site-desc div').css('height', '220px');
          // 描述 折叠
          this.descFlex = function(this$) {
            if (this$.attr('data-role') === 'open') {
              this$.prev().css('height', 'auto').end().attr('data-role', 'close').html('收起');
            } else {
              this$.prev().css('height', '220px').end().attr('data-role', 'open').html('显示全部');
            }
          }
          $('#descFlex').bind('click', function() {
            project.descFlex($(this));
          });
        }

        // 遍历本package所有的套餐
        $.each(pack.getPack(), function(i, v) {
          $('#pj-' + v.goods.id + ' .p-calendar').fullCalendar({ // 为当前套餐绑定日历
            events: 'temp/' + v.goods.id, // events 是日历读取套餐的路径
            dayClick: function(d) { // 为当前套餐日历的每一天绑定点击事件
              var cur_d = $.fullCalendar.formatDate(d, "yyyy-MM-dd"),
                r = 0, //当前币种
                d = 0, //美元
                p = pack.getPack(), //临时套餐对象
                p_l = p.length,
                date_f = true;
              $.getJSON('temp/' + v.goods.id, function(t) {
                // 遍历日历对象获取当前日期的价格
                if (t.length) {
                  $.each(t, function(i, v) {
                    // v 表示一段时间对象
                    if (cur_d === v.start.slice(0, 10)) {
                      if (v.price === '0') {
                        $.remaind('当前日期不可选', true);
                        date_f = false
                      } else {
                        r = +v.price;
                        d = +v.wdfPrice
                      }
                      return false
                    }
                  });
                }
                if (date_f) {
                  //日历对象里面没有此日期 遍历pack对象获取当前套餐此日期的价格
                  if (!r && !d) {
                    $.each(pack.getPack(), function(i, v2) {
                      if (v.goods.id === v2.goods.id) {
                        // v2 表示一个套餐对象
                        r = +v2.goods.price;
                        d = +v2.goods.wdfPrice;
                        return false;
                      }
                    });
                  }
                  while (p_l--) {
                    // 只修改当前套餐
                    if (p[p_l].goods.id === v.goods.id) {
                      // 第一步 加上增值服务的价格
                      var other = p[p_l].goods.other,
                        o_l = other.length,
                        exPer = p[p_l].goods.perNum - p[p_l].goods.baseNum;
                      while (o_l--) {
                        if (other[o_l].selected === '1') {
                          r = tools.addNum(r, +other[o_l].price);
                          d += +other[o_l].wdfPrice;
                        }
                      }
                      // 第二步 加上多于人数的价格
                      if (exPer > 0) {
                        r = tools.addNum(r, tools.sunNum(exPer, +p[p_l].goods.extPrice));
                        d += exPer * p[p_l].goods.wdfExtPrice;
                      }
                      // 修改 p 里面的当前套餐的值
                      p[p_l].goods.date = cur_d;
                      p[p_l].goods.curPrice = r + '';
                      p[p_l].goods.wdfCurPrice = d + '';
                      f_pack = true;
                      pack.setPack(p);
                      // 页面价格展示
                      $('#' + v.goods.id).find('.p-o-money b').html(tools.toThousands(r));
                      // 最后 完成当前套餐修改 退出
                      break;
                    }
                  }
                }
              });
            }
          });
        });

        // 调用轮播器的ini
        this.img_arousel_ini(true);

        // "取消政策"的列表初始化
        d_unoder.css('width', ~~(628 / unoder_l)).eq(-1).find('span').css('right', '0');
        while (unoder_l--) {
          d_unoder.eq(unoder_l).css({
            'background-color': '#' + unoder_c[unoder_l].b,
            'color': '#' + unoder_c[unoder_l].f
          });
        }
      },

      // 首页大图大margin-top 间距自适应
      imgMargin: function() {
        imgMt_d.css('margin-top', img_d.height() + 'px');
      },

      // 套餐 折叠
      togglePack: function(this$) {

        this$.parents('.s-p-each').toggleClass('active').siblings().removeClass('active');
      },

      // 选择套餐人数
      openPerson: function(this$) {
        var p = this$.next(),
          h = p.height(),
          m = ~~(this$.find('.person-con').html());
        p.css({
          'display': 'block',
          'top': h < 300 ? -h / 2 : -150 + 'px'
        });
        if (m > 7) {
          p[0].scrollTop = (m - 8) * 22;
        }
      },

      // 取消人数选择
      cancelPerson: function() {
        $('#sitePack .per-list').css('display', 'none');
      },

      // 确定选择人数
      okPerson: function(this$) {
        var n = +this$.html(), //用户选择的人数
          p = pack.getPack(), //临时套餐对象
          p_l = p.length,
          id = this$.parents('.s-p-each').attr('id').slice(3), //此套餐的id
          r = 0, //需要增加（减少）的当前币种
          d = 0; //需要增加（减少）的美元
        while (p_l--) {
          // 只修改当前套餐
          if (p[p_l].goods.id === id) {
            if (n > 0 && n <= +p[p_l].goods.maxNum) { //用户选择的值合法
              // 判断当前人数是否超出标准人数
              if (+p[p_l].goods.perNum <= +p[p_l].goods.baseNum) {
                // 基于现在用户选择的人数调整价格
                var exPer = n - p[p_l].goods.baseNum;
                if (exPer > 0) {
                  r = tools.sunNum(exPer, +p[p_l].goods.extPrice);
                  d = exPer * p[p_l].goods.wdfExtPrice;
                }
              } else {
                // 基于现在用户选择的人数和现在的人数调整价格
                var exPer = 0;
                if (n <= +p[p_l].goods.baseNum) {
                  // 在现有基础上减去响应的价格
                  exPer = p[p_l].goods.baseNum - p[p_l].goods.perNum;
                  r = tools.sunNum(exPer, +p[p_l].goods.extPrice);
                  d = exPer * p[p_l].goods.wdfExtPrice;
                } else {
                  exPer = n - p[p_l].goods.perNum;
                  r = tools.sunNum(exPer, +p[p_l].goods.extPrice);
                  d = exPer * p[p_l].goods.wdfExtPrice;
                }
              }
              p[p_l].goods.curPrice = tools.addNum(+p[p_l].goods.curPrice, r) + '';
              p[p_l].goods.wdfCurPrice = +p[p_l].goods.wdfCurPrice + d + '';
              p[p_l].goods.perNum = n + '';
              this$.parent().prev().find('.person-con').html(n);
              this.cancelPerson();
              f_pack = true;
              pack.setPack(p);
              // 页面价格展示
              $('#pj-' + id).find('.p-o-money b').html(tools.toThousands(p[p_l].goods.curPrice));
            }
            // 最后 完成当前套餐修改 退出
            break;
          }
        }
      },

      // 选择增值服务
      exSer: function(this$) {
        var id = this$.attr('id').slice(3),
          p_id = this$.closest('.s-p-each').attr('id').slice(3),
          p = pack.getPack(),
          p_l = p.length;
        while (p_l--) {
          if (p_id === p[p_l].goods.id) {
            var o = p[p_l].goods.other,
              o_l = o.length;
            while (o_l--) {
              if (o[o_l].id === id) {
                if (o[o_l].selected === '0') {
                  o[o_l].selected = '1';
                  $('#pj-' + p_id + ' #zz-' + id).attr('checked', true);
                  p[p_l].goods.curPrice = tools.addNum(+p[p_l].goods.curPrice, +o[o_l].price) + '';
                  p[p_l].goods.wdfCurPrice = +p[p_l].goods.wdfCurPrice + +o[o_l].wdfPrice + '';
                } else {
                  o[o_l].selected = '0';
                  $('#pj-' + p_id + ' #zz-' + id).attr('checked', false);
                  p[p_l].goods.curPrice = tools.addNum(+p[p_l].goods.curPrice, -o[o_l].price) + '';
                  p[p_l].goods.wdfCurPrice = p[p_l].goods.wdfCurPrice - o[o_l].wdfPrice + '';
                }
                f_pack = true;
                pack.setPack(p);
                // 页面价格展示
                $('#pj-' + p_id).find('.p-o-money b').html(tools.toThousands(p[p_l].goods.curPrice));
                break;
              }
            }
            break;
          }
        }
      },

      // 确认订单
      inOrder: function(this$) {
        if (f_order) {
          f_order = false;
          this$.html('提交订单...');
          // 检查时间是否选择
          var id = this$.parents('.s-p-each').attr('id').slice(3),
            p = pack.getPack(),
            p_l = p.length;
          while (p_l--) {
            if (id === p[p_l].goods.id) {
              if (p[p_l].goods.date === '') {
                $.remaind('请选择日期', true);
                this$.html('申请预定');
                f_order = true;
                return;
              }
              $.ajax({
                type: 'POST',
                contentType: "application/json",
                url: 'temp/order.php',
                data: '{"t":"addCart","data":' + JSON.stringify(p[p_l]) + '}',
                success: function(res) {
                  res = JSON.parse(JSON.parse(res));
                  if (res.err) {
                    if (res.more.url) {
                      $('header .sign-in').trigger('click');
                      this$.html('申请预定');
                      f_order = true;
                    } else {
                      $.remaind('订单提交失败', true);
                      this$.html('申请预定');
                      f_order = true;
                    }
                  } else {
                    // 跳转页面
                    location.href = res.more.url;
                  }
                },
                error: function() {
                  alert('网络繁忙 请稍后重试');
                  this$.html('申请预定');
                  f_order = true;
                }
              });
              break;
            }
          }
        }
      },

      // 收藏套餐
      fav: function(this$) {
        if (f_like) {
          f_like = false;
          var type = this$.attr('data-t'),
            pid = pack.getPack()[0].goods.project.id,
            id = this$.parents('.s-p-each').attr('id').slice(3),
            url = type === 'fav' ? 'temp/fav.php' : 'temp/delFav.php';
          $.ajax({
            type: 'POST',
            contentType: "application/json",
            url: url,
            data: '{"t":"' + type + '","id":"' + id + '","pid":"' + pid + '"}',
            success: function(res) {
              res = JSON.parse(JSON.parse(res));
              if (res.err) {
                if (res.more.url) {
                  $('header .sign-in').trigger('click');
                } else {
                  $.remaind('收藏失败', true);
                }
              } else {
                if (type === 'fav') {
                  this$.attr({
                    'title': '取消收藏',
                    'data-t': 'delFav'
                  }).find('.css-hart').addClass('active');
                } else {
                  this$.attr({
                    'title': '收藏此套餐',
                    'data-t': 'fav'
                  }).find('.css-hart').removeClass('active');
                }
              }
              f_like = true;
            },
            error: function() {
              alert('网络繁忙 请稍后重试');
              f_like = true;
            }
          });
        }
      },

      /*
      *********************************
      场地图片
      */

      // 图片轮播初始化
      img_arousel_ini: function() {
        scrW = ($(document).width() - 900) / 2;
        movel = scrW > 0 ? (scrW + 222) : 222;
        moveL = scrW > 0 ? (scrW + 222 - ulW) : (222 - ulW);
        $('#miniCarousel').find('li').eq(n).addClass('active').end().end().css({
          '-ms-transform': 'translateX(' + moveL + 'px)',
          '-moz-transform': 'translateX(' + moveL + 'px)',
          '-webkit-transform': 'translateX(' + moveL + 'px)',
          '-o-transform': 'translateX(' + moveL + 'px)',
          'transform': 'translateX(' + moveL + 'px)'
        }).show(function() {
          $('#miniCW').css('left', movel + 'px');
        });
      },

      // 上一张图片
      p_img: function() {
        // 把最后一张移动到第一张
        $('#miniCarousel').prepend($('#miniCarousel li:last')).find('li.active').removeClass('active').prev().addClass('active');
      },
      p_img_m: function() {
        $('#miniOImg').attr('src', $('#miniCarousel').prepend($('#miniCarousel li:last')).find('li.active').removeClass('active').prev().addClass('active').find('img').attr('src'));
        project.imgChange();
      },

      // 下一张图片
      n_img: function() {
        // 把第一张移动到最后一张
        $('#miniCarousel').append($('#miniCarousel li:first')).find('li.active').removeClass('active').next().addClass('active');
      },
      n_img_m: function() {
        $('#miniOImg').attr('src', $('#miniCarousel').append($('#miniCarousel li:first')).find('li.active').removeClass('active').next().addClass('active').find('img').attr('src'));
        project.imgChange();
      },

      // 放缩图片
      zIn: function() { //放大图片
        var wW = $(window).width(),
          wH = $(window).height(),
          img = $('#miniCarousel li.active img'),
          i_w = img.width(),
          i_h = img.height();
        if (wW / wH > i_w / i_h) { //宽屏
          wH = wH * 0.7;
          wW = i_w / i_h * wH;
        } else { //竖屏
          wW = wW * 0.7;
          wH = wW / (i_w / i_h);
        }
        $('#mask').html('<span id="miniOPrev" class="fl w30 h30 ml100 radius50 tc lh150 fcf f20 bcm cp ts4 click-mask arial z1" title="上一张图片">&lt;</span>' +
          '<span id="miniExit" class="dlb w30 h30 pa radius50 tc fcf f20 bcm cp ts4 click-mask" title="关闭窗口">x</span>' +
          '<img id="miniOImg" style="width:' + wW + 'px;height:' + wH + 'px;" class="middle ts4" src="' + img.attr('src') + '" alt="场地图片" />' +
          '<span id="miniONext" class="fr w30 h30 mr100 radius50 tc lh150 fcf f20 bcm cp pr ts4 click-mask arial" title="下一张图片">&gt;</span>').fadeIn(400);
      },

      // 窗口自适应图片尺寸
      imgChange: function() {
        var wW = $(window).width(),
          wH = $(window).height(),
          img = $('#miniCarousel li.active img'),
          i_w = img.width(),
          i_h = img.height();
        if (wW / wH > i_w / i_h) { //宽屏
          wH = wH * 0.7;
          wW = i_w / i_h * wH;
        } else { //竖屏
          wW = wW * 0.7;
          wH = wW / (i_w / i_h);
        }
        $('#miniOImg').css({
          'width': wW,
          'height': wH
        });
      },

      /*
      *********************************
      场地其他推荐
      */

      // 上一轮
      pre: function() {
        var m = now === 0 ? -656 * all : -656 * (now - 1);
        now = --now < 0 ? all : now;
        d.css(
          'margin-left', m + 'px'
        );
      },

      // 下一轮
      next: function() {
        var m = now === all ? 0 : -656 * (now + 1);
        now = ++now > all ? 0 : now;
        d.css(
          'margin-left', m + 'px'
        );
      },

      /*
      *********************************
      公用方法
      */

      resize: function() {
        clearTimeout(re_time);
        re_time = setTimeout(function() {
          // 图片自适应位置
          project.img_arousel_ini();
          // 放大过的图片自适应 窗口尺寸
          $('#miniOImg').length > 0 && project.imgChange();
          // 首页大图大margin-top 间距自适应
          project.imgMargin();
        }, 400);
      }
    };
  })();
});
