/**
 * created by hangyangws in 2016-03-04
 */

var express = require('express'),
    router = express.Router(),
    searchRoomService = require('./SearchRoomService');

router.get('/', function(req, res) {
    searchRoomService.init(req, res);
});

module.exports = router;
