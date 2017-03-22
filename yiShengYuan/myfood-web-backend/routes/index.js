/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-17.
 * [路由请求页面]
 */

module.exports = function(app) {
    app.use('/', require('./index/controller'));
}
