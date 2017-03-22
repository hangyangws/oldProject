/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 */

'use strict';

var pub = require('../../conf/pub'),
    qs = require('querystring'),
    getFoodType = (req, res) => { // 获取食品分类列表
        var _query = req.query,
            returnData = pub.syncReq({
                method: 'GET',
                url: '/food/category'
            });

        if (returnData.status) {
            // 删除分类列表多余参数[加快http响应]
            let typeList = returnData.data.data.list,
                _len = typeList.length;
            while (_len--) {
                delete typeList[_len].orderlist;
                delete typeList[_len].createdate;
            }
            returnData.typeList = typeList;
            // 删除原有数据
            delete returnData.data;
        }

        // 回写经纬度、搜索、设备
        returnData.s_applongitude = _query.s_applongitude;
        returnData.s_applatitude = _query.s_applatitude;
        returnData.search = _query.search || '';
        returnData.device = _query.device || 1;

        return returnData;
    };

module.exports = {
    index: (req, res) => {
        res.render('food/index', getFoodType(req, res));
    },
    search: (req, res) => {
        var _return = getFoodType(req, res);
        _return.scrollFixed = 'active';
        res.render('food/search', _return);
    },
    detail: (req, res) => {
        // 根据 foodid 获取菜品信息
        var _query = req.query,
            returnData = pub.syncReq({
                method: 'GET',
                url: `/app/cust/food/${_query.foodid}?memberid=${_query.userid}`
            });
        // 数据处理
        if (returnData.status) {
            let _data = returnData.data.data;
            // 图片处理
            _data.foodimagepath = JSON.parse(_data.foodimagepath).IMG;
            _data.shopimagepath = JSON.parse(_data.shopimagepath).IMG[0];
            // 价格处理
            _data.foodprice = _data.foodprice.toFixed(2);
            // 添加购物车数据
            let _cart = pub.getCart(_query.userid);
            _data.carprice = _cart.totalAmount;
            _data.carnum = _cart.totalCount; // 没有就是0
            // 添加其他信息
            _data.userid = _query.userid;
            _data.device = _query.device;
            // 数据赋值
            returnData.data = _data;
        }
        res.render('food/detail', returnData);
    },
    list: (req, res) => {
        // 根据经纬度、分页、菜品类型搜索
        var returnData = pub.syncReq({
            method: 'GET',
            url: `/app/cust/food?${qs.stringify(req.body)}`
        });

        // 数据处理
        if (returnData.status) {
            var _list = returnData.data.data.list,
                _l = _list.length,
                _temp;
            while (_l--) {
                _temp = _list[_l];
                _temp.shopportraitpath = JSON.parse(_temp.shopportraitpath).IMG[0];
                _temp.foodimagepath = JSON.parse(_temp.foodimagepath).IMG[0];
                _temp.foodprice = _temp.foodprice.toFixed(2);
                _temp.shopisopen = _temp.shopisopen ? '营业中' : '休息中';
            }
            returnData.foodList = returnData.data.data.list;
            delete returnData.data;
        }

        res.json(returnData);
    }
}
