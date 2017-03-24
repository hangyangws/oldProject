/**
 * created by hanghangws in 2016-01-29
 */

var globalUtil = require('../../util/global'),
    md5 = require('md5');

module.exports = {
    set: function(req, res) {
        var _info = globalUtil.syncReq({
            method: globalUtil.METHOD_PUT,
            url: '/api/hotelMember',
            data: {
                json: {
                    id: req.session.userid,
                    loginpassword: md5(req.body.password)
                }
            },
            status: 205
        });
        if (_info.status) {
            req.session.islogin = true;
            req.session.save();
        }
        res.json(_info);
    },
    get: function(req, res) {
        var _info = { status: false };
        if (req.session.loginpassword === md5(req.body.password)) {
            req.session.islogin = true;
            req.session.save();
            _info.status = true;
        } else {
            _info.msg = '密码错误';
        }
        res.json(_info);
    }
};
