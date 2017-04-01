//省略多余字符串 str文本内容，len 显示长度
function cutstr(str, len) {
  var restr = str;
  var wlength = str.replace(/[^\x00-\xff]/g, "**").length; //把汉字或者全角用**代替来计算长度,为了让汉字或全角算成2个字符长度
  if (wlength > len) {
    for (var k = len / 2; k < str.length; k++) {
      if (str.substr(0, k).replace(/[^\x00-\xff]/g, "**").length >= len) {
        restr = str.substr(0, k) + "...";
        break;
      }
    }
  } else {
    //如果长度没有超过，就返回原来字符串
    return str;
  }
  return restr;
}
//删除数组中存在重复的元素 someArray数组
function DeleteSameArrayItem(someArray) {
  tempArray = someArray.slice(0); //复制数组到临时数组
  for (var i = 0; i < tempArray.length; i++) {
    for (var j = i + 1; j < tempArray.length;) {
      if (tempArray[j] == tempArray[i])
      //后面的元素若和待比较的相同，则删除并计数；
      //删除后，后面的元素会自动提前，所以指针j不移动
      {
        tempArray.splice(j, 1);
      } else {
        j++;
      }
      //不同，则指针移动
    }
  }
  return tempArray;
}
//判断数组中是否存在重复的元素 someArray数组
function confirmRepeat(someArray) {
  tempArray = someArray.slice(0); //复制数组到临时数组
  for (var i = 0; i < tempArray.length; i++) {
    for (var j = i + 1; j < tempArray.length;) {
      if (tempArray[j] == tempArray[i])
      //后面的元素若和待比较的相同，则删除并计数；
      //删除后，后面的元素会自动提前，所以指针j不移动
      {
        return true;
      } else {
        j++;
      }
      //不同，则指针移动
    }
  }
  return false;
}
//格式化日期 DateFormat('yyyy_MM_dd hh:mm:ss:SS 星期w 第q季度')
function DateFormat(format, date) {
  if (!date) {
    date = new Date();
  }
  var Week = ['日', '一', '二', '三', '四', '五', '六'];
  var o = {
    // "y+": date.getYear(), //year
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "H+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    "S": date.getMilliseconds(), //millisecond
    "w": Week[date.getDay()]
  }
  if (/(y+)/.test(format)) {
    //substr  是在y不足4个时  以倒数方式出现
    format = format.replace(RegExp.$1, (date.getFullYear() + "")
      .substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}
//获取页面高度
function getPageHeight() {
  var g = document,
    a = g.body,
    f = g.documentElement,
    d = g.compatMode == "BackCompat" ? a : f;
  return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
}
//获取页面宽度
function getPageWidth() {
  var g = document,
    a = g.body,
    f = g.documentElement,
    d = g.compatMode == "BackCompat" ? a : f;
  return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
}

//获取页面可视宽度
function getPageViewWidth() {
  var d = document,
    a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
  return a.clientWidth;
}
//获取页面可视高度
function getPageViewHeight() {
  var d = document,
    a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
  return a.clientHeight;
}

//获取页面scrollLeft
function getPageScrollLeft() {
  var a = document;
  return a.documentElement.scrollLeft || a.body.scrollLeft;
}
//获取页面scrollTop
function getPageScrollTop() {
  var a = document;
  return a.documentElement.scrollTop || a.body.scrollTop;
}
//获取窗体可见范围的宽与高
function getViewSize() {
  var de = document.documentElement;
  var db = document.body;
  var viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth;
  var viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight;
  return Array(viewW, viewH);
}

//验证邮箱
function isemail(str) {
  var result = str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
  if (result == null) return false;
  return true;
}
//验证表单
//ele form
function vailForm(ele) {
  var form = ele;
  if (!vailNickName()) return false;
  if (!vailPhone()) return false;
  if (!vailPwd()) return false;
  if (!vailConfirmPwd()) return false;
  if (!vailEmail()) return false;
  if (!vailCode()) return false;
  if (!vailAgree()) return false;
  return true;
}
//验证昵称
//opt 参数
//minLen 最小长度
//maxLen 最大长度
//val 字符串
// var opt = {
//   val: "str",
//   minLen: 3,
//   maxLen: 3
// }

function vailNickName(opt) {
  var nickName = opt.val;
  var message = "";
  var patrn = /^\d+$/;
  var length = getNickNameLength(nickName);
  var p = {};
  if (nickName == '') {
    p.message = "昵称不能为空！";
    p.result = false;
    return p;
  } else if (length < opt.minLen || length > opt.maxLen) {
    p.message = "昵称为" + opt.minLen + "-" + opt.maxLen + "个字符！";
    p.result = false;
    return p;
  } else {
    p.result = true;
    return p;
  }
}
//计算昵称长度
function getNickNameLength(nickName) {
  var len = 0;
  for (var i = 0; i < nickName.length; i++) {
    var a = nickName.charAt(i);　　　　　　 //函数格式：stringObj.match(rgExp) stringObj为字符串必选 rgExp为正则表达式必选项
    　　　　　　 //返回值：如果能匹配则返回结果数组，如果不能匹配返回null
    if (a.match(/[^\x00-\xff]/ig) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
}

//验证手机号
//str 参数 string

function vailPhone(str) {
  var phone = str;
  //var myreg = /^(((13[0-9]{1})|159|153)+\d{8})$/;
  var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-3]{1})|(18[5-9]{1}))+\d{8})$/;
  var p = {};
  if (phone == '') {
    p.message = "手机号码不能为空！";
    p.result = false;
    return p;
  } else if (phone.length != 11) {
    p.message = "请输入有效的手机号码！";
    p.result = false;
    return p;
  } else if (!myreg.test(phone)) {
    p.message = "请输入有效的手机号码！";
    p.result = false;
    return p;
  } else {
    p.result = true;
    return p;
  }
}

//验证密码
//opt 参数
//val 密码值
//minLen 最小长度
//maxLen 最大长度
// var opt = {
//   val: str,
//   minLen: minLen,
//   maxLen: maxLen
// }
function vailPwd(opt) {
  var password = opt.val;
  var p = {};
  if (password == '') {
    p.message = "密码不能为空！";
    p.result = false;
    return p;
  } else if (password.length < opt.minLen || password.length > opt.maxLen) {
    p.message = "密码" + opt.minLen + "-" + opt.maxLen + "位！";
    p.result = false;
    return p;
  } else {
    p.result = true;
    return p;
  }
}
//验证确认密码
//opt 参数
//val 待验证string文本
//source 密码文本
// var opt = {
//   val: "str",
//   source:"str",
// }
function vailConfirmPwd(opt) {
  var confirmPassword = opt.val;
  var password = opt.source;
  if (confirmPassword == '') {
    p.message = "请输入确认密码！";
    p.result = false;
  } else if (confirmPassword != password) {
    p.message = "二次密码输入不一致，请重新输入！";
    p.result = false;
    return p;
  } else {
    p.result = true;
    return p;
  }
}

//验证邮箱
//str 待验证文本内容
function vailEmail(str) {
  var email = str;
  var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
  var p = {};
  if (email == '') {
    p.message = "邮箱不能为空！";
    p.result = false;
    return p;
  } else if (!myreg.test(email)) {
    p.message = "请输入有效的邮箱地址！";
    p.result = false;
    return p;
  } else {
    p.result = true;
    return p;
  }
}
//验证验证码
//str 待验证文本
function vailCode(str) {
  var randCode = str;
  var p = {};
  if (randCode == '') {
    p.message = "请输入验证码！";
    p.result = false;
    return p;
  } else {
    p.result = true;
    return p;
  }
}

//上下按键事件 opt参数
//ele 对像
//cb 处理事件
function customPos(opt) {
  opt.ele.unbind('keydown');
  opt.ele.keydown(function(event) {
    var posLen;
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 38) {
      posLen = parseInt($(this).val()) + 1;
      $(this).val(posLen);
    };
    if (e && e.keyCode == 40) {
      posLen = parseInt($(this).val()) - 1;
      if (posLen < 0) posLen = 0;
      $(this).val(posLen);
    };
    opt.cb.call(this); //处理函数
    opt.ele.unbind('keyup');
    opt.ele.keyup(function() {
      opt.cb.call(this); //处理函数
    })
  });
};

//获取指定年月天数 y年m月 (2016,10)
function getDays(y, m) {
  var isy = false;
  if (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)) isy = true;
  switch (m) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return isy ? 29 : 28;
  }
}
//获取当月第一天的星期 y年m月 (2016,10)
function getFirstDay(y, m) {
  return new Date(y, m, 1).getDay();
}

//生成table表格
//data 数据
//crearTr 生成tr内容（必须）
function creatTable(opt) {
  var table = "";
  opt.data.forEach(function(item) {
    table += opt.crearTr(item);
  })
  return table;
}



//11.4日  孙祺雄  提交
var checkImg = function(file) { //file代表 要上传文件表单
  if (!(/(?:jpg|gif|png)$/i.test(file.value))) {
    if (window.ActiveXObject) { //for IE
      file.select(); //select the file ,and clear selection
      document.selection.clear();
    } else if (window.opera) { //for opera
      file.type = "text";
      file.type = "file";
    } else file.value = ""; //for FF,Chrome,Safari
    return false;
  } else {
    return true;
  }
};
//这种方法貌似不如那个省略字符串的好用，
//而且令人疑惑的是 “” 居然算3个
function getLength(text) {
  var temp = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;"
  temp = temp + "`~!@#$%^&*()_+|-=/[]{};':,./<>?/";
  temp = temp + "·～！◎＃￥％……※×（）——＋§－＝÷【】『』；‘：“，。、《》?";
  var len = text.trim().length;
  for (j = 0; j < text.trim().length; j++) {
    var ch = text.trim().charAt(j);
    if (temp.indexOf(ch) == -1) {
      len++;
    }
  }
  return len;
}

//转换成unicode编码
function unicode(s) {
  var len = s.length;
  var rs = "";
  for (var i = 0; i < len; i++) {
    var k = s.substring(i, i + 1);
    rs += "&#" + s.charCodeAt(i) + ";";
  }
  return rs;
}
//unicode反编码
function runicode(s) {
  var k = s.split(";");
  var r = "";
  for (var x = 0; x < k.length; x++) {
    var m = k[x].replace(/&#/, "");
    r += String.fromCharCode(m);
  }
  return r;
}
//年月日历选择框 ele对象元素
var selYM = {
  init: function(ele) {
    var self = this;
    ele.each(function() {
      self.calendar($(this));
    });
    return this;
  },
  calendar: function(ele) {
    var now = new Date();
    var isShow = true;
    var y = now.getFullYear();
    ele.find(".btn-con-y").html(y);
    ele.find(".btn-con-m").html(now.getMonth() + 1);
    ele.find(".ym-search").click(function(e) {
      e.stopPropagation();
      ele.find(".search-con").show();
    });
    ele.find(".list-item span").click(function() {
      var html = ele.find(".btn-con-y").html() + "年" + $(this).html();
      ele.find(".ym-search").val(html);
      ele.find(".search-con").hide();
    });
    $("body").click(function() {
      ele.find(".search-con").hide();
    })
    ele.find(".btn-left").click(function(e) {
      e.stopPropagation();
      y -= 1;
      ele.find(".btn-con-y").html(y);
    });
    ele.find(".btn-right").click(function(e) {
      e.stopPropagation();
      y += 1;
      ele.find(".btn-con-y").html(y);
    })
  }
}

//将一位数转化为两位数  即 9 ——》09
function formateNumber(number) {
  var result = Number(number)
  return result > 9 ? "" + result : "0" + result;
}

// 参数 opt
// ele 创建对象节点
// edit 是否是编辑
// jsonArr 数据
var treeModel = {
  init: function(opt) {
    var defaults = {
      datas: [{
        name: "系统资源",
        val: [{
          name: "业务运营首页",
          val: [{
            name: "首页图标展示"
          }, {
            name: "首页表格"
          }, {
            name: "告警区域"
          }, {
            name: "首页我创建的任务"
          }, {
            name: "首页我处理的任务"
          }, {
            name: "稽核排名"
          }, {
            name: "日收入指标数据"
          }, {
            name: "业务稽核数据"
          }, {
            name: "业务稽核数据"
          }, {
            name: "业务稽核数据"
          }]
        }, {
          name: "运营视图",
          val: [{
            name: "运营视图数据获取ajax请求"
          }, {
            name: "运营视图指标数据展示",
            val: [{
              name: "运营视图指标数据展示",
            }]
          }, {
            name: "运营视图获取告警信息列表",
            val: [{
              name: "运营视图获取告警信息列表",
            }]
          }, {
            name: "运营视图指标定制",
            val: [{
              name: "运营视图指标定制",
            }]
          }]
        }, {
          name: "业务监控",
        }]
      }]
    };
    $.extend(defaults, opt)
    this.trs = "";
    this.edit = defaults.edit;
    this.ele = defaults.ele.find(".treemodel-left");
    this.rightCon = defaults.ele.find(".right-con");
    this.fSetjsonShow(defaults.datas, 0);
    this.ele.html(this.trs);
    this.setFun();
  },
  //处理传入的数据
  fSetjsonShow: function(json, zj, level) {
    var self = this;
    if (!json && typeof(json) != "undefined" && json != 0) {
      return false;
    };
    if ($.isArray(json)) {
      self.trs += "<div class='toggle-div'>";
      for (var i = 0; i < json.length; i++) {
        self.fSetjsonShow(json[i], zj, (i + 1));
      };
      self.trs += "</div>";
    } else {
      var type = (typeof json);
      if (type == "object") {
        var arr = json.val;
        delete json.val;
        self.fTrHtml(json, zj, level);
        if (arr) {
          self.fSetjsonShow(arr, (zj + 1));
        }
      }
    };
  },
  //设置内容
  fTrHtml: function(obj, zj, level) {
    var self = this;
    var name = obj.name;
    var li = self.fTdDivHtml(name, zj, level);
    self.trs += li;
  },
  //每个节点内部内容
  fTdDivHtml: function(name, zj, level) {
    var self = this;
    var html = "";
    if (this.edit) {
      html = self.jsonEdit(zj) + self.desc(name, level) + self.editsHtml();
    } else {
      html = self.jsonEdit(zj) + self.checkbox() + self.desc(name, level);
    }
    // (this.edit)&&||((html=self.jsonEdit(zj) + self.desc(name)+self.checkbox())
    return '<div class="level" data_level="' + zj + '" style="padding-left:' + (zj * 20) + 'px">' + html + '</div>';
  },
  //选择框
  checkbox: function() {
    return '<input type="checkbox" class="checkbox" />';
  },
  //json-edit 三角框
  jsonEdit: function(i) {
    return '<div class="json-edit json-edit' + i + '"><img src="./img/angle.png"/></div>';
  },
  //内容显示
  desc: function(name, level) {
    return '<div class="desc" level="' + level + '">' + name + '</div>';
  },
  //右侧编辑按钮
  editsHtml: function() {
    return '<ul class="edit-list"><li class="btn-add"><img src="img/btnAdd.png" /></li><li class="shift-up"><img src="img/shiftUp.png" /></li><li class="shift-down"><img src="img/shiftDown.png" /></li><li class="del-item"><img src="img/delItem.png" /></li></ul>';
  },
  //设置线的高度
  fSetlineTopHei: function(ele) {
    var levelArr = [];
    var trlen = ele.find("li").length;
    var trhei = parseInt(ele.find("li").css("height"));
    ele.find("li").each(function() {
      var level = $(this).attr("data_level");
      var i = 0;
      for (; i < levelArr.length; i++) {
        if (levelArr[i].level == level) {
          break;
        }
      }
      if (i == levelArr.length) {
        var p = {
          level: level,
          val: []
        };
        levelArr.push(p);
      } else {
        var p = levelArr[i];
      }
      p.val.push($(this).index());
    });
    for (var m = 0; m < levelArr.length; m++) {
      var vals = levelArr[m].val;
      for (var j = 1; j < vals.length; j++) {
        var temp = vals[j] - vals[j - 1];
        var $that = ele.find("li").eq(vals[j - 1]);
        if ($that.next() && $that.next().attr("data_level") > $that.attr("data_level")) {
          $that.find(".line-top").css({
            "height": trhei * (temp - 1) - 1 + "px"
          });
        } else {
          $that.find(".line-top").remove();
        }
      }
      var s = trlen - vals[vals.length - 1];
      ele.find("li").eq(vals[vals.length - 1]).find(".line-top").css({
        "height": trhei * (s - 1) - 1 + "px"
      });
    }
    ele.find("li").eq(trlen - 1).find(".line-top").remove();
  },
  //阻止默认
  stopPro: function(e) {
    var e = e || window.event;
    e.stopPropagation();
  },
  setFun: function() {
    this.setToggle();
    this.setDel();
    this.setAdd();
    this.setUpdate();
    this.setSure();
    this.setCannel();
    this.setShiftUp();
    this.setShiftDown();
    this.setDisable();
  },
  //删除事件
  setDel: function() {
    var self = this;
    this.ele.find(".edit-list .del-item").unbind("click").click(function() {
      var ele = $(this).closest(".level");
      if (ele.next().hasClass('toggle-div')) {
        ele.next().remove();
      }
      ele.remove();
      self.setFun();
    });
  },
  //增加事件
  setAdd: function() {
    var self = this;
    this.ele.find(".edit-list .btn-add").unbind("click").click(function() {
      uObj = $(this).closest(".level");
      self.rightCon.find(".m-text").html("添加节点");
      self.rightCon.find(".m-input").val('');
      self.rightCon.show();
    });
  },
  //修改事件
  setUpdate: function() {
    var self = this;
    this.ele.find(".level .desc").unbind("click").click(function() {
      uObj = $(this).closest(".level");
      var html = $(this).text();
      self.rightCon.find(".m-text").html("修改节点");
      self.rightCon.find(".m-input").val(html);
      self.rightCon.show();
    });
  },
  //确定事件
  setSure: function() {
    var self = this;
    self.rightCon.find(".tright-btn-wrap .btn-sure").unbind("click").click(function() {
      var title = self.rightCon.find(".m-text").html();
      var val = self.rightCon.find(".m-input").val();
      if (title == "修改节点") {
        uObj.find(">.desc").text(val);
        self.rightCon.hide();
        self.setFun();
      } else {
        var val = val.replace(/^\s+|\s+$/g, "");
        if (val != "") {
          var level = Number(uObj.attr("data_level")) + 1;
          var ele = uObj.next();
          if (ele.hasClass('toggle-div')) {
            var $levelHtml = ele.find(".level").last().clone();
          } else {
            var $levelHtml = uObj.clone();
            uObj.after("<div class='toggle-div'></div>");
          }
          $levelHtml.find(".toggle-div").remove();
          $levelHtml.attr("data_level", level).css("padding-left", (20 * level) + "px");
          $levelHtml.find(">.desc").text(val);
          var ele = uObj.next();
          ele.append($levelHtml);
          self.rightCon.hide();
          self.setFun();
        } else {
          alert("请输入节点名!");
        }
      }

    });
  },
  //上移事件
  setShiftUp: function() {
    var self = this;
    this.ele.find(".edit-list .shift-up").unbind("click").click(function() {
      var ele = $(this).closest(".level");
      var level = ele.find(".desc").attr("level");
      var prev = ele.prev();
      var next = ele.next();
      if (prev) {
        if (prev.hasClass("toggle-div")) {
          prev = prev.prev();
        };
        ele.find(".desc").attr("level", Number(level) - 1);
        prev.find(".desc").attr("level", level);
        prev.before(ele);
        if (next.hasClass("toggle-div")) {
          prev.before(next);
        }
        self.setDisable();
      }
    });
  },
  //下移事件
  setShiftDown: function() {
    var self = this;
    this.ele.find(".edit-list .shift-down").unbind("click").click(function() {
      //当前节点
      var ele = $(this).closest(".level");
      var level = ele.find(".desc").attr("level");
      //下个节点
      var next = ele.next();
      if (next) {
        //下下个节点
        var nextLevel = next.next();
        if (next.hasClass("toggle-div")) {
          //下个节点为当前节点的子节点
          if (nextLevel) {
            nextLevel.find(".desc").attr("level", level);
            ele.find(".desc").attr("level", Number(level) + 1);
            var nextLevelToggle = nextLevel.next();
            if (nextLevelToggle.hasClass("toggle-div")) {
              nextLevelToggle.after(next);
              nextLevelToggle.after(ele);
            } else {
              nextLevel.after(next);
              nextLevel.after(ele);
            }
          }
        } else {
          //下个节点不为当前节点的子节点
          next.find(".desc").attr("level", Number(level));
          ele.find(".desc").attr("level", Number(level) + 1);
          if (nextLevel.hasClass("toggle-div")) {
            //下下个节点为下个节点的子节点
            //追加到下下个节点之后
            nextLevel.after(ele);
          } else {
            //下下个节点不为下个节点的子节点
            //追加到下个节点之后
            next.after(ele);
          }
        }
        self.setDisable();
      }
    });
  },
  //取消事件
  setCannel: function() {
    var self = this;
    self.rightCon.find(".tright-btn-wrap .btn-cacel").unbind("click").click(function() {
      self.rightCon.hide();
    })
  },
  //收放事件
  setToggle: function() {
    var self = this;
    this.ele.find(".json-edit").unbind("click");
    this.ele.find(".json-edit").click(function(e) {
      var e = e || window.event;
      e.stopPropagation();
      if ($(this).parent().next().hasClass('toggle-div')) {
        $(this).parent().next().slideToggle();
        $(this).prev().prev().slideToggle();
      }
      $(this).toggleClass("angle-rotate");
    })
  },
  //置灰
  setDisable: function() {
    this.ele.find(".level").each(function() {
      var shiftUp = $(this).prev();
      var shiftDown = $(this).next();
      if (shiftUp.length > 0) {
        $(this).find(">.edit-list .shift-up img").attr("src", "img/shiftUp.png");
      } else {
        $(this).find(">.edit-list .shift-up img").attr("src", "img/shiftUpno.png");
      }
      if (shiftDown.length > 0) {
        if (shiftDown.hasClass('toggle-div')) {
          shiftDown = shiftDown.next();
          if (shiftDown.length > 0) {
            $(this).find(">.edit-list .shift-down img").attr("src", "img/shiftDown.png");
          } else {
            $(this).find(">.edit-list .shift-down img").attr("src", "img/shiftDownno.png");
          }
        } else {
          $(this).find(">.edit-list .shift-down img").attr("src", "img/shiftDown.png");
        }
      } else {
        $(this).find(">.edit-list .shift-down img").attr("src", "img/shiftDownno.png");
      }
    })
  }
};

//观察者对象
var listener=function(){
  var obsever;
  var createObsever=function(){};
  createObsever.prototype={
    message:{},
    regiest:function(type,fn){
      if(this.message[type]&&this.message[type].length>0){
        this.message[type].push(fn);
      }else{
        this.message[type]=[fn];
      }
    },
    fire:function(type,opt){
      if(!this.message[type]) return false;
      this.message[type].forEach(function(item){
        item.call(opt);
      });
    },
    remove:function(type,fn){
      var i=this.message[type].indexOf(fn);
      if(!this.message[type]||i==-1) return false;
      this.message[type].splice(i,1);
    }
  }
  if(!obsever){
    obsever=new createObsever()
  }
  return obsever;;
};