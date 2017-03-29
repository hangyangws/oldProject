/**
 * 路由控制
 * created by hangyangws in 2016-04-25
 */

module.exports = function(app) {
    app.use('/', require('./index/IndexController'));
    app.use('/hotelType', require('./hotelType/HotelTypeController'));
    app.use('/searchHotel', require('./searchHotel/SearchHotelController'));
    app.use('/searchRoom', require('./searchRoom/SearchRoomController'));
    app.use('/user', require('./user/UserController'));
    app.use('/weixin', require('./login/LoginController'));
    app.use('/order', require('./order/OrderController'));
    app.use('/password', require('./pass/PassController'));
    app.use('/other', require('./other/OtherController'));
    // 微商城支付
    app.use('/pay', require('./pay/PayController'));
}
