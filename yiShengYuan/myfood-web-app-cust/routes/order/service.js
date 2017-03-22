/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var pub = require('../../conf/pub');

module.exports = {
    sure: (req, res) => {
        var _query = req.query,
            returnData = pub.syncReq({ // 根据 _query.userid 查看购车数据
                method: 'POST',
                url: `/app/cust/cart/${_query.userid}`
            });
        // 数据处理
        if (returnData.status) {
            let _data = returnData.data.data;
            // 订单总价处理
            _data.amount = _data.amount.toFixed(2);
            // 双重循环，处理店铺、食物的数据
            let _shop_l = _data.shops.length,
                _l,
                _now_shop,
                _now_item,
                _items;
            while (_shop_l--) {
                _now_shop = _data.shops[_shop_l];
                // 食品处理
                _items = _now_shop.foods;
                _l = _items.length;
                while (_l--) {
                    _now_item = _items[_l];
                    // 处理食品价格
                    _now_item.price = _now_item.price.toFixed(2);
                    // 处理食品图片
                    _now_item.imagepath = JSON.parse(_now_item.imagepath).IMG[0];
                }
                // 配送方式处理
                _items = _now_shop.diningtypes;
                _l = _items.length;
                if (_now_shop.diningtypename) {
                    // 配送方式名称处理(中英转换)
                    _now_shop.diningtypezhname = pub.dinType[_now_shop.diningtypename];
                    while (_l--) {
                        _now_item = _items[_l];
                        // 增加就餐方式中文对照
                        _now_item.zhname = pub.dinType[_now_item.name];
                        // 选择默认就餐方式
                        (_now_shop.diningtypename === _now_item.name) && (
                            _now_item.default = true,
                            // 配送费用确定
                            _now_shop.freight = _now_item.freight
                        );
                    }
                } else {
                    // 增加默认配送方式(中英)
                    _now_shop.diningtypename = _items[0].name;
                    _now_shop.diningtypezhname = pub.dinType[_items[0].name];
                    _now_shop.freight = _items[0].freight;
                    // 给第一个就餐方式加上默认
                    _items[0].default = true;
                    while (_l--) {
                        _now_item = _items[_l];
                        // 增加就餐方式中文对照
                        _now_item.zhname = pub.dinType[_now_item.name];
                    }
                }
                _now_shop.diningtypes = JSON.stringify(_items);
                // 支付方式处理
                _items = _now_shop.paymentmethods;
                _l = _items.length;
                // 默认支付方式中英对照
                _now_shop.paymentmethodzh = pub.payType[_now_shop.paymentmethod];
                while (_l--) {
                    _now_item = _items[_l];
                    // 增加支付方式中英对照
                    _now_item.zhname = pub.payType[_now_item.name];
                    // 选择默认支付方式
                    (_now_shop.paymentmethod === _now_item.name) && (_now_item.default = true);
                }
            }
            // 绑定其他数据
            _data.userId = _query.userid;
            _data.device = _query.device;
            _data.userPhone = _query.userphone;
            _data.userAddr = _query.useraddr;
            // 数据赋值
            returnData.data = _data;
        }
        res.render('order/sure', returnData);
    },
    listpage: (req, res) => {
        var _query = req.query;
        res.render('order/list', {
            device: _query.device,
            userId: _query.userid,
            orderType: _query.ordertype
        });
    },
    list: (req, res) => {
        var _body = req.body,
            orderType = _body.ordertype || 'ALL',
            returnData = pub.syncReq({
                method: 'GET',
                url: `/app/cust/order/${_body.memberid}?category=${_body.category}&pagenum=${_body.pagenum}&count=${_body.count}`
            });
        // 数据处理
        if (returnData.status) {
            let _data = returnData.data.data,
                _l = _data.list.length;
            while (_l--) {
                // 日期处理
                _data.list[_l].createtime = _data.list[_l].createtime.slice(0, -3).replace(/-/g, '/');
                if (_data.list[_l].expectdeliverytime) {
                    _data.list[_l].expectdeliverytime = _data.list[_l].expectdeliverytime.slice(11, 16);
                }
                // 价格处理
                _data.list[_l].paymentamount = _data.list[_l].paymentamount.toFixed(2);
            }
            // 数据赋值
            returnData.data = _data;
        }
        res.json(returnData);
    },
    detail: (req, res) => {
        var _query = req.query;
        // 根据 orderId 查询当前订单的数据
        // var returnData = pub.syncReq({
        //     method: 'GET',
        //     url: `/app/cust/fooddetail/${req._query.foodid}`
        // });
        var returnData = {
            status: true,
            device: _query.device,
            isFooter: true, // 是否显示页脚结算按钮（只有订单状态为"待支付"才为true）
            nowStatus: '待支付',
            nowIconClass: 'i-done',
            statusList: [{
                name: '待支付',
                checked: true
            }, {
                name: '待接单'
            }, {
                name: '待取餐'
            }, {
                name: '已完成'
            }],
            shopList: [{
                shopName: '店铺名店铺名店铺名店铺名店铺名',
                shopTel: '18382333333',
                note: '不要辣椒，少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋少一点醋',
                arriveTime: '11:22',
                dinMode: '上门取餐',
                sendMoney: '0.00',
                payMethod: '在线支付',
                payMoney: '305.00',
                foodList: [{
                    foodImg: 'http://img3.redocn.com/tupian/20141020/yipindansuzhuangpan_3277193.jpg',
                    foodName: '菜品名字',
                    foodSales: '123',
                    foodPrice: '123.11',
                    foodNum: '123'
                }, {
                    foodImg: 'http://img3.redocn.com/tupian/20141020/yipindansuzhuangpan_3277193.jpg',
                    foodName: '菜品名字2',
                    foodSales: '12',
                    foodPrice: '113.11',
                    foodNum: '1'
                }]
            }, {
                shopName: '店铺名店铺333',
                shopTel: '18382333333',
                note: '不要辣椒，多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋多一点醋',
                arriveTime: '11:22',
                dinMode: '上门取餐',
                sendMoney: '0.00',
                payMethod: '货到付款',
                payMoney: '305.00',
                foodList: [{
                    foodImg: 'http://img3.redocn.com/tupian/20141020/yipindansuzhuangpan_3277193.jpg',
                    foodName: '菜品名字',
                    foodSales: '123',
                    foodPrice: '123.11',
                    foodNum: '123'
                }]
            }],
            orderInfo: {
                orderNum: 'abcdefghijk',
                orderId: 'orderid123',
                userName: '航洋无声',
                tel: '18328335001',
                addr: '成都市高新区',
                orderTime: '2015-10-10'
            },
            totalMoney: '234.33'
        };
        res.render('order/detail', returnData);
    },
    delete: (req, res) => {
        // 根据 req.body.shopId 删除订单中的店铺
        // var returnData = pub.syncReq({
        //     method: 'UPDATE',
        //     url: `/app/cust/fooddetail/${req._query.foodid}`
        // });
        var _returnData = {
            status: true,
            // msg: '出错了'
        }
        res.json(_returnData);
    },
    cancel: (req, res) => {
        // 根据 req.body.userId 和 req.body.orderId 删除订单
        var returnData = pub.syncReq({
            method: 'DELETE',
            url: `/app/cust/order/${req.body.orderId}`
        });
        res.json(returnData);
    },
    statement: (req, res) => {
        // 根据 req.query 结算店铺
        var _query = req.query,
            returnData = pub.syncReq({
                method: 'GET',
                url: `/app/cust/payment/${_query.orderid}`
            });
        // 数据处理
        if (returnData.status) {
            let _data = returnData.data.data,
                _items = _data.coupons,
                _l = _items.length;
            while (_l--) { // 优惠券时间处理(去掉时分秒)
                _items[_l].expiretime = _items[_l].expiretime.slice(0, 10);
            }
            // 价格处理(保留小数点2位)
            _data.onlinepayment = _data.onlinepayment.toFixed(2);
            _data.cashdelivery = _data.cashdelivery.toFixed(2);
            // 订单过期时间处理
            _data.expectedtime = _data.expectedtime.substr(11, 8);
            // 当前设备
            _data.device = _query.device;

            // 数据赋值
            returnData.data = _data;
        }

        res.render('order/statement', returnData);
    },
    getid: (req, res) => {
        var returnData = pub.syncReq({
            method: 'POST',
            url: `/app/cust/order`,
            data: req.body
        });
        // 数据处理
        if (returnData.status) {
            returnData.data = returnData.data.data;
        }
        // ========
        res.json(returnData);
    }
}
