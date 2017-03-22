;
/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */
! function(win, $, undefined) {
    'use strict';
    var $win = $(win),
        $foodSelect = $('#foodSelect'),
        $itemSelect = $foodSelect.find('.js-item-select'),
        $typeSelect = $foodSelect.find('.js-type-select'),
        $main = $('#main'), // 内容展示主区域
        $foodType = $foodSelect.find('.js-type-select'),
        $foodList = $foodSelect.find('.js-item-select'),
        body = $body[0], // body Dom
        _no_data_html = $('#tpNoData').html(),
        _shop_list_html = $('#tpShopList').html(),
        _error_html = $('#tpError').html(),
        _css_bg = 'background: url(${img}) 50% 50% / cover no-repeat;',
        _count = 10, // 每页加载个数
        pagenum = 1, // 即将加载页数
        _is_ajax = true,
        FoodList = {
            init: function() {
                // 获取店铺列表
                var _obj = {
                    s_applongitude: G.lng,
                    s_applatitude: G.lat,
                    s_categoryid: $itemSelect.find('li:first-child').addClass('active').data('id'),
                    pagenum: 1,
                    count: _count
                };
                G.search && (_obj.search = G.search); // 判断是否有搜索参数
                FoodList.loadShop(_obj);
            },
            typeOpen: function() {
                $itemSelect.toggleClass('active');
                $typeSelect.toggleClass('active');
            },
            typeSelect: function($this) {
                var _obj = {
                    s_applongitude: G.lng,
                    s_applatitude: G.lat,
                    s_categoryid: $this.data('id'),
                    pagenum: 1,
                    count: _count
                };
                G.search && (_obj.search = G.search); // 判断是否有搜索参数
                FoodList.loadShop(_obj, function() {
                    $foodType.removeClass('active')[0].firstChild.nodeValue = $this.html();
                    $foodList.removeClass('active').find('.active').removeClass('active');
                    $this.addClass('active');
                });
            },
            loadShop: function(_obj, _callb) {
                /**
                 * _obj 为 参数对象 {s_applongitude: ***, s_applatitude: ***, s_categoryid: ***, pagenum: ***, count: ***[, search: ***]}
                 */
                if (!_obj) {
                    var _obj = {
                        s_applongitude: G.lng,
                        s_applatitude: G.lat,
                        s_categoryid: G.s_categoryid,
                        pagenum: pagenum,
                        count: _count
                    };
                }
                var _food_html = _food_html = [],
                    _l,
                    _temp;
                if (_is_ajax) {
                    _is_ajax = false;
                    win.oLoad();
                    G.s_categoryid = _obj.s_categoryid; // 设置但前搜索分类id
                    $.ajax({
                        url: '/food/list',
                        type: 'POST',
                        dataType: 'json',
                        data: _obj,
                        success: function(_data) {
                            if (_data.status) {
                                // 渲染店铺Dom
                                _l = _data.foodList.length;
                                while (_l--) {
                                    _temp = _data.foodList[_l];
                                    // 距离字符串化
                                    _temp.shopdistance = _temp.shopdistance + '';
                                    _food_html.push(_shop_list_html
                                        .replace('${foodId}', _temp.foodid)
                                        .replace('${shopid}', _temp.shopid)
                                        .replace('${shopname}', _temp.shopname)
                                        .replace('${styleFoodImg}', _css_bg.replace('${img}', _temp.foodimagepath))
                                        .replace('${styleCookImg}', _css_bg.replace('${img}', _temp.shopportraitpath))
                                        .replace('${shopStatus}', _temp.shopisopen)
                                        .replace('${gray}', _temp.shopisopen === '休息中' ? 'gray' : '')
                                        .replace('${foodName}', _temp.foodname)
                                        .replace('${shopAddr}', _temp.shopaddress)
                                        .replace(/\${distance}/g, _temp.shopdistance.slice(0, _temp.shopdistance.indexOf('.')))
                                        .replace('${price}', _temp.foodprice)
                                        .replace('${sales}', _temp.foodsales || 0)
                                    );
                                }
                                _food_html = _food_html.reverse().join('')
                                if (_obj.pagenum == 1) {
                                    $main.html('<ul class="food-wrap fs12">' + _food_html + '</ul>')
                                } else {
                                    $main.find('.food-wrap').append(_food_html);
                                }
                                // 设置即将加载的页码
                                pagenum = _obj.pagenum + 1;
                                _is_ajax = true;
                                win.cLoad();
                            } else {
                                if (_data.isempty) {
                                    FoodList.errorMsg(_obj.pagenum, 1);
                                } else {
                                    FoodList.errorMsg(_obj.pagenum, 2, _data.msg);
                                }
                            }
                        },
                        error: function() {
                            FoodList.errorMsg(_obj.pagenum, 2, '网络出错');
                        }
                    });
                }
                _callb && _callb();
            },
            errorMsg: function(_pagenum, _type, _msg) {
                // _pagenum为1表示第一次加载
                // _type为1表示没有数据，为2表示请求异常
                // 只在_type为2的时候_msg才有效果
                _is_ajax = true;
                win.cLoad();
                if (_pagenum == 1) {
                    $main.html(_type == 1 ? _no_data_html : _error_html.replace('${msg}', _msg));
                } else {
                    (_type == 2) && win.oConfrim(_msg, true);
                }
            },
            changeAddr: function() {
                if (G.device == 1) {
                    // android
                    win.android.changeAddr();
                } else {
                    // ios
                    location.href = 'objc://ChangeAddr';
                }
            },
            reLoad: function() {
                var _obj = {
                    s_applongitude: G.lng,
                    s_applatitude: G.lat,
                    s_categoryid: G.s_categoryid,
                    pagenum: 1,
                    count: _count
                };
                G.search && (_obj.search = G.search);
                FoodList.loadShop(_obj);
            },
            goShop: function($foodItem) {
                var _shopId = $foodItem.data('shopid'),
                    _shopName = $foodItem.data('shopname'),
                    _shopDistance = $foodItem.data('distancce');
                if (G.device == 1) {
                    // android
                    win.android.goShop(_shopId, _shopDistance, _shopName);
                } else {
                    // ios
                    location.href = 'objc://goShop:/' + _shopId + '/' + _shopDistance + '/' + _shopName;
                }
            },
            goFood: function(_foodId) {
                if (G.device == 1) {
                    // android
                    win.android.goFood(_foodId);
                } else {
                    // ios
                    location.href = 'objc://goFood:/' + _foodId;
                }
            }
        };
    /**
     * 事件绑定
     */
    FoodList.init(); // 项目初始化
    $foodSelect.on('tap', '.js-type-select', function() { // 展开菜品搜索
        FoodList.typeOpen();
    }).on('tap', 'li', function() { // 菜品类型选择
        FoodList.typeSelect($(this));
    });
    $main.on('tap', '.js-change-addr', function() { // 改变位置
        FoodList.changeAddr();
    }).on('tap', '.js-reload', function() { // 重新加载第一页
        FoodList.reLoad();
    }).on('tap', '.js-go-shop', function() { // 进入店铺
        FoodList.goShop($(this).closest('.food-item'));
    }).on('tap', '.js-go-food', function() { // 进入菜品
        FoodList.goFood($(this).closest('.food-item').data('foodid'));
    });
    $win.on('scroll', function() { // 页面滚动
        (body.scrollHeight - body.clientHeight + 30 === body.scrollTop) && FoodList.loadShop();
    });
}(window || this, Zepto);
