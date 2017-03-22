;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */
! function(win, $, undefined) {
    'use strict';
    var // Dom缓存于变量
        $main = $('#main'),
        $mask = $('#mask'),
        $footer = $('#footer'),
        $amount = $footer.find('.js-amount'), // 实际付款
        $receipt = $mask.find('.js-receipt'),
        $din = $mask.find('.js-din-mode-mask'), // 就餐方式，弹窗Dom
        $userName = $main.find('.js-username'),
        $userTel = $main.find('.js-usertel'),
        $userAddr = $main.find('.js-useraddr'),
        $userNameEdit = $mask.find('.js-username-edit'),
        $userTelEdit = $mask.find('.js-usertel-edit'),
        $userAddrEdit = $mask.find('.js-useraddr-edit'), // 收货详细地址
        $dinbtn = $mask.find('.js-m-dinbtn'),
        $nowShop, // 当前用户编辑店铺
        $sendfee = $mask.find('.js-m-sendfee'),
        _din_mode_html = '<button class="js-din-mode-btn ts4 ${status}" data-name="${zhName}" data-freight="${freight}">${chName}</button>',
        _is_ajax = true,
        _end_data = { // 结算需要的数据(在页面操作过程中，动态改变，最后数据验证此对象并且发送给java接口)
            memberid: G.userId,
            // recipientname: '冯杰', // 根据用户填写姓名改变（默认没有）
            recipientcontact: G.phone, // 跟随用户修改电话改变
            // recipientaddress: G.addr, // 跟随用户修改地址改变(默认没有)
            shops: (function() { // 每个店铺都生成一个默认对象(店铺Dom节点的data('end'), data('end')只是在初始化有用)
                var _temp = [],
                    $shopList = $main.find('.js-shop-item'),
                    _l = $shopList.length;
                while (_l--) {
                    _temp.push($shopList.eq(_l).data('end'));
                }
                return _temp;
            })()
        },
        Order = {
            editAddr: function() {
                // 显示用户地址修改蒙层
                Order.showMask($receipt, 209);
            },
            editDinMode: function($this) {
                $nowShop = $this.closest('.js-shop-item'); // 保存当前店铺Dom
                var dinmodelist = $nowShop.data('dinmodelist'), // 当前店铺就餐方式数组
                    _l = dinmodelist.length,
                    _temp,
                    _html = [];
                // 在弹窗，动态展示就餐方式按钮
                while (_l--) {
                    _temp = dinmodelist[_l];
                    _html.push(_din_mode_html
                        .replace('${status}', _temp.default ? 'active' : '')
                        .replace('${zhName}', _temp.name)
                        .replace('${freight}', _temp.freight)
                        .replace('${chName}', _temp.zhname));
                }
                $dinbtn.html(_html.join(''));
                // 在弹窗，动态展示配送费
                $sendfee.html($this.find('.js-din-fee').html());
                Order.showMask($din, 110);
            },
            changePay: function($this) {
                $this.siblings('.active').removeClass('active');
                $this.addClass('active');
                $nowShop = $this.closest('.js-shop-item'); // 当前用户编辑店铺
                // 改变当前店铺的支付方式
                Order.reEndData($nowShop.data('end').id, 'paymentmethod', $this.data('name'));
            },
            closeReceipt: function() {
                // 获取用户填写信息
                var _name = $.trim($userNameEdit.val()),
                    _tel = $.trim($userTelEdit.val()),
                    _addr = $.trim($userAddrEdit.val());
                // 回填信息到页面上
                _name && (
                    $userName.html(_name).removeClass('fc-sub').addClass('fc-impor-one'),
                    _end_data.recipientname = _name
                );
                _tel && (
                    $userTel.html(_tel),
                    _end_data.recipientcontact = _tel
                );
                _addr && (
                    $userAddr.html(G.baseAddr + _addr),
                    _end_data.recipientaddress = G.baseAddr + _addr
                );
                // 关闭弹窗
                Order.closeMask();
            },
            selectDinMode: function($this) { // $this 表示当前就餐方式按钮Dom
                var _mode_name = $this.html();
                // 改变按钮效果（没有实际作用）
                $this.siblings().removeClass('active');
                $this.addClass('active');
                // 回填页面数据
                var _now_fee = $nowShop.find('.js-din-fee').html();
                G.amount = win.NUM.sub(win.NUM.add(G.amount, $this.data('freight')), _now_fee);
                $amount.html(G.amount);
                $nowShop.find('.js-din-name').html(_mode_name);
                $nowShop.find('.js-din-fee').html($this.data('freight'));
                // 改变当前店铺data-dinmodelist
                var _temp_dinmodelist = JSON.parse($nowShop.attr('data-dinmodelist').replace('true', 'false')),
                    _l = _temp_dinmodelist.length;
                while (_l--) {
                    if (_temp_dinmodelist[_l].zhname === _mode_name) {
                        _temp_dinmodelist[_l].default = true;
                        break;
                    }
                }
                $nowShop.attr('data-dinmodelist', JSON.stringify(_temp_dinmodelist));
                // 回填对象数据(就餐方式)
                Order.reEndData($nowShop.data('end').id, 'diningtypename', $this.data('name'));
                // 关闭弹窗
                var _time = setTimeout(function() {
                    clearTimeout(_time);
                    Order.closeMask();
                }, 200);
            },
            showMask: function($showDom, _height) {
                $mask.removeClass('none');
                var _time = setTimeout(function() {
                    $mask.addClass('active');
                    clearTimeout(_time);
                    _time = setTimeout(function() {
                        clearTimeout(_time);
                        $showDom.css({
                            height: _height,
                            padding: '5px'
                        });
                    }, 100);
                }, 50);
            },
            closeMask: function() {
                $mask.children().css({
                    height: 0,
                    padding: '0 5px'
                });
                var _time = setTimeout(function() {
                    $mask.removeClass('active');
                    clearTimeout(_time);
                    _time = setTimeout(function() {
                        $mask.addClass('none');
                    }, 500);
                }, 300);
            },
            reEndData: function(_id, _n, _v) {
                var _l = _end_data.shops.length;
                while (_l--) {
                    if (_end_data.shops[_l].id === _id) {
                        _end_data.shops[_l][_n] = _v;
                        break;
                    }
                }
            },
            del: function($this) {
                if (_is_ajax) {
                    win.oConfrim('在订单中删除此店铺', false, function() {
                        _is_ajax = false;
                        win.oLoad();
                        $.ajax({
                            url: '/order/delete',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                shopId: $this.closest('.js-shop-item').data('end').shopId
                            },
                            success: function(_data) {
                                if (_data.status) {
                                    win.location.reload(true);
                                } else {
                                    win.cLoad();
                                    win.oConfrim(_data.msg, true);
                                    _is_ajax = true;
                                }
                            },
                            error: function() {
                                win.cLoad();
                                win.oConfrim('网络出错', true);
                                _is_ajax = true;
                            }
                        });
                    });
                }
            },
            statement: function() {
                if (_is_ajax) {
                    // 验证信息
                    if (!_end_data.recipientname) {
                        win.oConfrim('请输入收餐人', true, function() {
                            Order.editAddr();
                            win.cConfrim();
                        });
                        return;
                    }
                    if (!_end_data.recipientcontact) {
                        win.oConfrim('请输入联系电话', true, function() {
                            Order.editAddr();
                            win.cConfrim();
                        });
                        return;
                    }
                    if (!_end_data.recipientaddress) {
                        win.oConfrim('请输入详细地址', true, function() {
                            Order.editAddr();
                            win.cConfrim();
                        });
                        return;
                    }
                    // 填写备注信息
                    var $shopList = $main.find('.js-shop-item'),
                        _l = $shopList.length,
                        $temp;
                    while (_l--) {
                        $temp = $shopList.eq(_l);
                        Order.reEndData($temp.data('end').id, 'message', $.trim($temp.find('.js-note').val()));
                    }

                    _is_ajax = false;
                    win.oLoad();
                    $.ajax({
                        url: '/order/getid',
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(_end_data),
                        success: function(_data) {
                            win.cLoad();
                            if (_data.status) {
                                var _order_id = _data.data.id;
                                // 拿到订单id 跳转到结算页面
                                if (G.device == 1) {
                                    win.android.statement(_order_id);
                                } else {
                                    location.href = 'objc://Statement/' + _order_id;
                                }
                            } else {
                                win.oConfrim(_data.msg, true);
                                _is_ajax = true;
                            }
                        },
                        error: function() {
                            win.cLoad();
                            win.oConfrim('网络出错', true);
                            _is_ajax = true;
                        }
                    });
                }
            }
        };

    /**
     * 事件绑定
     */

    $main.on('tap', '.js-user-addr', function() { // 打开收货地址弹窗
        Order.editAddr();
    }).on('tap', '.js-din-mode', function() { // 打开就餐方式弹窗
        Order.editDinMode($(this));
    }).on('tap', '.js-pay', function() { // 改变支付方式
        Order.changePay($(this));
    }).on('tap', '.js-del', function() { // 删除店铺(此功能在页面上已经屏蔽)
        Order.del($(this));
    });

    $footer.on('tap', '.js-statement', function() { // 结算
        Order.statement();
    });

    $mask.on('tap', '.js-close-receipt', function() { // 关闭收货地址弹窗
        Order.closeReceipt();
    }).on('tap', '.js-close-din', function() { // 关闭就餐方式弹窗
        Order.closeMask();
    }).on('tap', '.js-din-mode-btn', function() { // 选择就餐方式
        Order.selectDinMode($(this));
    });
}(window || this, Zepto);
