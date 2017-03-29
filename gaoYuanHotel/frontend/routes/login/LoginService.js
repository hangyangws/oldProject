/**
 * created by hanghangws in 2016-01-29
 */

var syncRequest = require('sync-request'),
    globalUtil = require('../../util/global'),
    payConf = require('../../util/payConf'),
    md5 = require('md5'),
    app = {
        getUserInfo: function(openId, accessToke) {
            var uri = ['https://api.weixin.qq.com/cgi-bin/user/info?',
                'access_token=',
                accessToke,
                '&openid=',
                openId,
                '&lang=zh_CN'
            ].join('');
            return JSON.parse(syncRequest(globalUtil.METHOD_GET, uri).getBody('utf-8'));
        },
        getAccessToken: function() {
            var url = ['https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=',
                payConf.WX_APPID,
                '&secret=',
                payConf.WX_APPSECRET
            ].join('');
            return JSON.parse(syncRequest(globalUtil.METHOD_GET, url).getBody('utf-8'));
        },
        postUserInfo: function(userinfo, req, res) {
            var agents = req.headers["user-agent"].toLowerCase().split(' '),
                info = { status: false },
                saveHotelMemberReq = null,
                saveInfos = null;
            try {
                saveHotelMemberReq = syncRequest(globalUtil.METHOD_POST, ['http://',
                    globalUtil.HOST_IP,
                    ':',
                    globalUtil.HOST_PORT,
                    globalUtil.POJECT,
                    '/api/hotelMember/wxLogin'
                ].join(''), {
                    json: {
                        "hotelauthplatform": [{
                            "platformtype": 1,
                            // "platformaccount": userinfo.nickname,
                            "authid": userinfo.openid,
                            "authtoken": userinfo.accesstoken
                        }],
                        "hotelmemberext": [{
                            "sex": userinfo.sex,
                            "nickname": userinfo.nickname,
                            "city": userinfo.city,
                            "country": userinfo.country,
                            "province": userinfo.province,
                            "imagepath": userinfo.headimgurl
                        }],
                        "loginip": globalUtil.GETCLIENT_IP(req),
                        "logindate": globalUtil.FORMAT(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss'),
                        "logindevice": [agents[3], agents[4], agents[4] === 'os' ? agents[5] : ''].join(' ').replace(';', '').trim()
                    }
                });
                if (saveHotelMemberReq.statusCode === 200) {
                    saveInfos = JSON.parse(saveHotelMemberReq.getBody('utf-8'));
                    if (saveInfos.status === 201) {
                        info.status = true;
                        info.user = {
                            memberid: saveInfos.data.id,
                            username: userinfo.nickname,
                            headimg: userinfo.headimgurl,
                            point: saveInfos.data.point,
                            loginpassword: saveInfos.data.loginpassword
                        }
                    } else if (saveInfos.status === 415 || saveInfos.status === 404) {
                        info.msg = saveInfos.message;
                    }
                } else {
                    info.msg = '网络异常';
                }
            } catch (e) {
                info.msg = '服务器异常:' + e;
            }
            return info;
        }
    },
    _url = '/';

module.exports = {
    index: function(req, res) {
        _url = req.session.requrl || '/';
        res.redirect(['https://open.weixin.qq.com/connect/oauth2/authorize',
            '?appid=',
            payConf.WX_APPID,
            '&redirect_uri=',
            payConf.WX_REDIRECT_URL,
            '&response_type=',
            payConf.WX_RESPONSE_TYPE,
            '&scope=',
            payConf.WX_SCOPE,
            '&state=',
            payConf.WX_STATE,
            '#wechat_redirect'
        ].join(''));
    },
    loginCallback: function(req, res) {
        if (req.query.state === payConf.WX_STATE) {
            var url = ['https://api.weixin.qq.com/sns/oauth2/access_token',
                    '?appid=',
                    payConf.WX_APPID,
                    '&secret=',
                    payConf.WX_APPSECRET,
                    '&code=',
                    req.query.code,
                    '&grant_type=authorization_code'
                ].join(''),
                // 调用微信接口获取openId
                openId = JSON.parse(syncRequest(globalUtil.METHOD_GET, url).getBody('utf-8'))['openid'],
                accessToke = app.getAccessToken()['access_token'],
                userinfo = app.getUserInfo(openId, accessToke),
                _user = null;
            // 已经获取到当前用户的微信的信息（头像，昵称等等）
            // 想服务端发送请求，注册用户或者获取用户信息
            userinfo.accesstoken = accessToke;
            _user = app.postUserInfo(userinfo, req, res);
            if (_user.status) {
                req.session.openid = openId;
                req.session.accesstoke = accessToke;
                req.session.userid = _user.user.memberid;
                req.session.point = _user.user.point;
                req.session.username = _user.user.username;
                req.session.headimg = _user.user.headimg;
                req.session.loginpassword = _user.user.loginpassword;
                req.session.haspassword = _user.user.loginpassword ? true : false;
                req.session.save();
                // 跳转到用户来时的页面
                // res.redirect(_url);
                // 跳转到用户登录页面
                res.redirect('/weixin/login');
            } else {
                res.render('common/error', { message: '登录失败' });
            }
        } else {
            res.render('common/error', { message: '授权失败' });
        }
    },
    login: function(req, res) {
        if (req.query.callbackurl) {
            req.session.callbackurl = req.query.callbackurl;
            req.session.userurl = req.query.userurl;
        }
        if (req.session.userid) {
            if (req.query.callbackurl || !req.session.islogin) {
                res.render('user/login', {
                    userid: req.session.userid,
                    haspassword: req.session.haspassword,
                    headimg: req.session.headimg,
                    username: req.session.username,
                    callbackurl: req.session.callbackurl,
                    payurl: req.session.payurl || '',
                    userurl: req.session.userurl,
                    requrl: req.session.requrl || '/'
                });
            } else {
                res.redirect(req.session.requrl || '/');
            }
        } else {
            res.redirect('/weixin');
        }
    }
};
