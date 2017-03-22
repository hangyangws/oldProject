/**
 * 图片裁剪服务
 * created by hangyangws in 2016-02-25.
 */

module.exports = {
    init: function(req, res) {
        res.render('common/imgCrop', {
            'imgSrc': req.query.src,
            'width': req.query.width,
            'height': req.query.height,
            'type': req.query.type
        });
    }
}
