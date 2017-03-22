/**
 * 文件上传路由控制
 * Created by Peter.D.Wang on 2016/1/29.
 */
var express = require('express'),
    uploadService = require('./UploadService'),
    upload = express();

// 文件上传视图
upload.get("/", function(req, res, next) {
    uploadService.index(req, res);
});

// 文件上传
upload.post("/", function(req, res, next) {
    uploadService.init(req, res);
});

// 图片裁剪及压缩
upload.post("/crop", function(req, res) {
    uploadService.crop(req, res);
});

module.exports = upload;
