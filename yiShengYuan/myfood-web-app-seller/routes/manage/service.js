/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-08.
 */

'use strict';

var pub = require('../../conf/pub');

module.exports = {
    index: (req, res) => {
        var _query = req.query,
            returnData = pub.syncReq({
                method: 'GET',
                url: `/app/shop/personalcenter/${_query.shopid}`
            });
        // 数据处理
        if (returnData.status) {
            let _data = returnData.data.data;
            // 价格处理
            _data.remainbalance = _data.remainbalance.toFixed(2);
            _data.todayturnover = _data.todayturnover.toFixed(2);
            _data.device = req.query.device;
            // 数据赋值
            returnData.data = _data;
        }
        res.render('manage/index', returnData);
    },
    operate: (req, res) => {
        var _body = req.body,
            returnData = pub.syncReq({
                method: 'POST',
                url: _body.type === 'changeState' ? `/app/shop/status/${_body.shopId}?status=${_body.status === 'true' ? 'OPEN' : 'REST'}` : '申请提现url:未开发'
            });
        res.json(returnData);
    },
    order: (req, res) => {
        var _shopId = req.body.shopId,
            // returnData = pub.syncReq({ 'GET', '/url' });
            returnData = {
                status: true,
                orderList: [{
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }, {
                    orderTime: '2016-09-12 10:23:11',
                    orderNum: 'Wdcsdasf',
                    amount: '12.00'
                }],
                totalAmount: '234.00'
            };
        res.render('manage/order', returnData);
    }
}
