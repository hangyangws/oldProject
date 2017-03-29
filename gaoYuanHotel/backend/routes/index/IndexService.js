/**
 * created by hangyangws in 2016-01-10
 */

var syncRequest = require('sync-request'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    init: function(req, res) {
        logger.info('==进入后台欢迎页面');
        res.render('index', { 'username': req.session.username });
    }
}
