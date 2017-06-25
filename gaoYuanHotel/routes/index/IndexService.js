/**
 * created by hangyangws in 2016-03-03
 */

module.exports = {
    init: function(req, res) {
        res.render('index', {
            username: req.session.username,
            headimg: req.session.headimg
        });
    }
}
