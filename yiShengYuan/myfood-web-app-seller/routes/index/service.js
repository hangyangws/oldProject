/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-15.
 */

'use strict';

module.exports = {
    init: (req, res) => {
        res.render('index/index', { 'name': 'hangyangws' });
    }
}
