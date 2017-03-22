/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-15.
 */

'use strict';

var pub = require('../../conf/pub');

module.exports = {
    listPage: function(req, res) {
        var _query = req.query;
        res.render('order/list', {
            orderType: _query.ordertype,
            device: _query.device,
            shopId: _query.shopid
        });
    },
    list: (req, res) => {
        var _body = req.body,
            returnData = pub.syncReq({
                method: 'GET',
                url: `/app/shop/order/${_body.shopId}?category=${_body.category}&pagenum=${_body.pagenum}&count=${_body.count}`
            });

        // 数据处理
        if (returnData.status) {
            let _data = returnData.data.data,
                _items = _data.list,
                _len = _items.length;
            while (_len--) {
                // 时间处理
                _items[_len].createtime = _items[_len].createtime.replace(/-/g, '/').slice(0, 16);
                _items[_len].expectdeliverytime = _items[_len].expectdeliverytime.slice(11, 16);
                // 就餐方式中文化
                _items[_len].diningtypename = pub.dinType[_items[_len].diningtypename];
                // 价格处理
                _items[_len].paymentamount = _items[_len].paymentamount.toFixed(2);
                _items[_len].freight = _items[_len].freight.toFixed(2);
            }
            // 数据赋值
            returnData.data = _data;
        }

        res.json(returnData);
    },
    detail: (req, res) => {
        var orderId = req.query.orderId;
        // 根据 orderId 去获取当前订单的详情信息
        // returnData = pub.syncReq({ 'GET', '/url', { orderType: orderType } });
        var returnData = {
            status: true,
            orderId: orderId,
            orderType: req.query.orderType,
            device: req.query.device,
            orderDetail: {
                orderNum: '72323124343423',
                orderTime: '2016/06/13 10:34',
                arriveTime: '11:23',
                diningMode: '上门取餐',
                addr: '高新区中和政龙腾苑8懂几',
                allAmount: '118.00',
                distriAmount: '12.00',
                userName: '冯先生',
                tel: '18328335001',
                food: [{
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面',
                    num: 1,
                    price: '12.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }, {
                    image: 'http://img05.tooopen.com/images/20140926/sy_71908296843.jpg',
                    name: '乌冬面2',
                    num: 12,
                    price: '13.00'
                }]
            },
            msg: '不要辣椒'
        };
        res.render('order/detail', returnData);
    },
    operate: (req, res) => {
        var _body = req.body,
            returnData = pub.syncReq({
                method: 'POST',
                url: `/app/shop/order/${_body.type}/${_body.orderId}`
            });
        res.json(returnData);
    }
}
