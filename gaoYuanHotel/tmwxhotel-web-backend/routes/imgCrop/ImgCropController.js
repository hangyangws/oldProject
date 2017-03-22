/**
 * 图片裁剪路由控制
 * created by hangyangws in 2016-02-25.
 */

var express = require('express'),
    imgCropService = require('./ImgCropService'),
    imgCrop = express();

imgCrop.get("/", function(req, res) {
    imgCropService.init(req, res);
});

module.exports = imgCrop;
