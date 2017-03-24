/**
 * [拦截器 - 添加于所有路由之前判断用户是否登录]
 * create by hangyangws in 2015-08-06
 */

var global = require('../global');

function fnLogin_Filter(req, res, next) {
    //路径过滤拦截
    var aUrl = global.REQ_URL.split(','),
        temp = 0,
        reqUrl = req.url;

    res.locals.url = reqUrl;
    var reqUrlC = reqUrl.indexOf('?');
    if (reqUrlC > 0) {
        reqUrl = reqUrl.substring(0, reqUrlC);
    }
    for (var i = 0; i < aUrl.length; i++) {
        if (aUrl[i] == reqUrl) {
            temp += 1;
            break;
        }
    }
    if (temp == 0) { //登录前不放行的
        if (!req.session) {
            res.render('/login');
            return;
        } else if (!req.session.username) {
            res.redirect('/login'); //跳转到首页
            return;
        }
    }

    next();
}
exports.LOGIN_FILTER = fnLogin_Filter;
