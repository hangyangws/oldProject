/**
 * created by hangyangws in 2016-01-29
 */

var syncRequest = require('sync-request'),
    captchapng = require('captchapng'),
    global = require('../../util/global'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    init: function(req, res) {
        res.render('login/index');
    },
    captcha: function(req, res) {
        var _text = ~~(Math.random() * 9000 + 1000) + '',
            _pic = new captchapng(96, 28, _text);
        _pic.color(189, 176, 153, 255);
        req.session.captcha = _text;
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(new Buffer(_pic.getBase64(), 'base64'));
    },
    login: function(req, res) {
        var info = {
                status: false,
                msg: ''
            },
            userInfo = '',
            loginReq = {},
            tmpUser = {},
            username = req.body.name,
            password = req.body.password,
            ip = global.GETCLIENT_IP(req),
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/pfAdmin/login'].join(''),
            options = {
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            };
        if (req.body.captcha === req.session.captcha) {
            try {
                loginReq = syncRequest(global.METHOD_POST, uri, options);
                userInfo = loginReq.getBody('utf-8');
                tmpUser = JSON.parse(userInfo);
                if (loginReq.statusCode == 200) {
                    if (tmpUser.status == 201) {
                        info.status = true;
                        req.session.username = username;
                        logger.info(username + '登录成功,登录ip' + ip);
                    } else if (tmpUser.status == 404) {
                        info.status = false;
                        info.msg = "用户名或密码不正确";
                    } else if (tmpUser.status == 415) {
                        info.status = false;
                        info.msg = tmpUser.message;
                    } else {
                        info.status = false;
                        info.msg = "服务器异常";
                    }
                } else {
                    logger.error('loginReqStatus:' + loginReq.statusCode);
                    logger.error(username + '登录失败,登录ip' + ip);
                    info.status = false;
                    info.msg = "网络异常";
                }
            } catch (e) {
                console.log('e:' + e);
                logger.error('e:' + e);
                info.status = false;
                info.msg = "服务器异常";
            }
        } else {
            info.status = false;
            info.msg = "验证码错误";
        }
        res.json(info);
    },
    logout: function(req, res) {
        if (req.session) {
            logger.info(req.session.username + '退出登录,登录ip:' + global.GETCLIENT_IP(req));
            req.session.destroy();
        }
        res.redirect("/login");
    }
}
