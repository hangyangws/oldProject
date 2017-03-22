/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

module.exports = {
    index: (req, res) => {
        var _returnData = {
            userId: req.query.userid,
            type: req.query.type
        };
        res.render('coupon/index', _returnData);
    },
    list: (req, res) => {
        // 根据 _query.type 查看优惠券信息
        // var returnData = pub.syncReq({
        //     method: 'UPDATE',
        //     url: `/app/cust/fooddetail/${req._query.foodid}`
        // });
        var _type = req.body.type,
            _userId = req.body.userId,
            _returnData = {
                status: true,
                couponList: [{
                    full: '200',
                    discount: '10',
                    expiryDate: '2016-12-12'
                }, {
                    full: '201',
                    discount: '20',
                    expiryDate: '2016-12-12'
                }, {
                    full: '230',
                    discount: '13',
                    expiryDate: '2016-12-12'
                }, {
                    full: '204',
                    discount: '70',
                    expiryDate: '2016-12-12'
                }]
            };
        res.json(_returnData);
    }
}
