/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-20.
 * [路由请求页面]
 */

module.exports = function(app) {
    app.use('/car', require('./car/controller'));
    app.use('/coupon', require('./coupon/controller'));
    app.use('/food', require('./food/controller'));
    app.use('/', require('./index/controller'));
    app.use('/order', require('./order/controller'));
    app.use('/pay', require('./pay/controller'));
    app.use('/shop', require('./shop/controller'));
}
