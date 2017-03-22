/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-08.
 * [路由请求页面]
 */

module.exports = app => {
    app.use('/', require('./index/controller'));
    app.use('/food', require('./food/controller'));
    app.use('/order', require('./order/controller'));
    app.use('/manage', require('./manage/controller'));
}
