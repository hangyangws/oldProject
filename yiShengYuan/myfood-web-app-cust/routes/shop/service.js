/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var pub = require('../../conf/pub');

module.exports = {
    index: (req, res) => {
        var _query = req.query,
            returnData = pub.syncReq({ // 根据 _query.shopid 获取店铺信息
                method: 'GET',
                url: `/app/cust/shop/${_query.shopid}${_query.userid ? '?memberid=' + _query.userid : ''}`
            });
        // 数据处理
        if (returnData.status) {
            let _data = returnData.data.data;
            // 店铺图片处理
            _data.shopimagepath = JSON.parse(_data.shopimagepath).IMG;
            // 店铺营业状态转换为中文
            _data.shopisopen = _data.shopisopen ? '营业中' : '休息中';
            // 就餐方式处理
            let _l = _data.diningtypes.length;
            if (_data.diningtypename) { // 历史记录当前用户选择过
                while (_l--) {
                    _data.diningtypes[_l].zhname = pub.dinType[_data.diningtypes[_l].name];
                    if (_data.diningtypes[_l].name === _data.diningtypename) {
                        _data.diningtypes[_l].default = true;
                        _data.sendmoney = _data.diningtypes[_l].freight;
                    }
                }
            } else {
                while (_l--) {
                    _data.diningtypes[_l].zhname = pub.dinType[_data.diningtypes[_l].name];
                }
                // 默认为第一个为选中状态（以第一个配送费用为准）
                _data.diningtypes[0].default = true;
                _data.sendmoney = _data.diningtypes[0].freight;
            }
            // 菜品图片出处理
            _l = _data.foods.length;
            while (_l--) {
                _data.foods[_l].price = _data.foods[_l].price.toFixed(2);
                _data.foods[_l].imagepath = JSON.parse(_data.foods[_l].imagepath).IMG[0];
            }
            // 添加购物车数据
            var _cart = pub.getCart(_query.userid);
            _data.carprice = _cart.totalAmount;
            _data.carnum = _cart.totalCount; // 没有就是0
            // 店铺距离
            _data.distance = _query.distance;
            // 重新复制数据
            returnData.data = _data;
            returnData.shopid = _query.shopid;
            returnData.userid = _query.userid;
            returnData.device = _query.device;
        }
        res.render('shop/index', returnData);
    }
}
