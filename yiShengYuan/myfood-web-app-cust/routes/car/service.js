/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var pub = require('../../conf/pub');

module.exports = {
    option: (req, res) => {
        var _body = req.body,
            _obj = {
                memberid: _body.userid,
                foodid: _body.foodid
            };
        _body.diningtypename && (_obj.diningtypename = _body.diningtypename);
        var returnData = pub.syncReq({
            method: 'POST',
            url: `/app/cust/cart/${_body.type}`,
            data: _obj
        });

        // 数据处理
        if (returnData.status) {
            returnData.data = returnData.data.data;
            // 价格处理
            returnData.data.totalAmount = returnData.data.totalAmount.toFixed(2);
        }
        res.json(returnData);
    },
    del: (req, res) => {
        var _body = req.body,
            returnData = pub.syncReq({
                method: 'DELETE',
                url: `/app/cust/cart?memberid=${_body.userId}&shopid=${_body.shopId}`
            });
        // 数据处理（删除后购物车的总价）
        returnData.status && (returnData.totalAmount = pub.getCart(_body.userId).totalAmount);

        res.json(returnData);
    },
    index: (req, res) => {
        var _query = req.query,
            returnData = pub.syncReq({ // 根据 _query.userid 查看购车数据
                method: 'GET',
                url: `/app/cust/cart/${_query.userid}`
            });
        // 数据处理
        if (returnData.status) {
            let _data = returnData.data.data,
                _l_shop = _data.shops.length,
                _foods_temp,
                _l_food;
            while (_l_shop--) {
                // 菜品图片处理 价格处理
                _foods_temp = _data.shops[_l_shop].foods;
                _l_food = _foods_temp.length;
                while (_l_food--) {
                    _foods_temp[_l_food].imagepath = JSON.parse(_foods_temp[_l_food].imagepath).IMG[0];
                    _foods_temp[_l_food].foodprice = _foods_temp[_l_food].foodprice.toFixed(2);
                }
                // 就餐方式对象中文化
                _data.shops[_l_shop].diningtypezhname = pub.dinType[_data.shops[_l_shop].diningtypename];
            }
            // 数据赋值
            returnData.data = _data;
            returnData.carPrice = pub.getCart(_query.userid).totalAmount;
        }
        // 绑定其他数据
        returnData.userId = _query.userid;
        returnData.device = _query.device;

        res.render('car/index', returnData);
    }
}
