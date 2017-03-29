/**
 * [拦截器 - 添加于所有路由之前判断用户是否登录]
 * create by hangyangws in 2015-08-06
 */

var global = require('../global');

function fnLogin_Filter(req, res, next) {
    var _filter_url = global.REQ_URL,
        _filter_len = _filter_url.length,
        _old_reqUrl = req.url, // 当前请求网址有参数
        reqUrl = _old_reqUrl, // 当前请求网址没有参数
        _paraLocation = reqUrl.indexOf('?'),
        _is_filter = true;

    if (_paraLocation !== -1) { // 去除url参数
        reqUrl = reqUrl.slice(0, _paraLocation);
    }

    while (_filter_len--) {
        if (_filter_url[_filter_len] === reqUrl) { // 当前请求网址要求登陆拦截
            _is_filter = false;
            break;
        }
    }
    if (_is_filter) {
        if (!req.session) {
            res.render('common/error', { message: 'mongo数据库出错，请联系管理员' });
            return;
        } else if (!req.session.islogin) {
            console.log('===登录拦截地址===');
            console.log(_old_reqUrl);
            req.session.requrl = _old_reqUrl;
            req.session.save();
            res.redirect('/weixin');
            return;
        }
    }

    next();
}

exports.LOGIN_FILTER = fnLogin_Filter;
