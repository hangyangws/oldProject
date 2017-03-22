/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-15.
 */

module.exports = {
    init: function(req, res) {
        res.render('index/index', { 'name': 'gulp' });
    }
}
