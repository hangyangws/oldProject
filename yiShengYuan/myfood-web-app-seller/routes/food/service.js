/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-15.
 */

'use strict';

var pub = require('../../conf/pub');

module.exports = {
    list: (req, res) => {
        var returnData = pub.syncReq({
            method: 'GET',
            url: '/food?parameter={"shopid":"' + req.query.shopId + '"}'
        });

        // 当前访问设备
        returnData.device = req.query.device || 1;

        // 当数据正确的情况过滤和处理数据
        if (returnData.status) {
            var list = returnData.data.data.list,
                foodList = [],
                _l = list.length;
            while (_l--) {
                foodList.push({
                    id: list[_l].id,
                    price: list[_l].price.toFixed(2),
                    imagepath: JSON.parse(list[_l].imagepath).IMG[0],
                    name: list[_l].name,
                    ismarketable: list[_l].ismarketable ? '上架中' : '已下架',
                    sortNum: _l + 1
                });
            }
            // 删除本来的list 减少http数据流量
            delete returnData.data.data.list;
            returnData.foodList = foodList.reverse();
        }

        res.render('food/list', returnData);
    },
    del: (req, res) => {
        var returnData = pub.syncReq({
            method: 'DELETE',
            url: '/food/' + req.body.id
        });
        res.json(returnData);
    }
}
