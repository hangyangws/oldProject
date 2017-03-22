/**
 * 文件上传服务
 * Created by Peter.D.Wang on 2016/1/29.
 */

var multiparty = require('multiparty'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    gm = require('gm'),
    // var images = require("images"),
    global = require('../../util/global');

module.exports = {
    index: function(req, res) {
        res.render("upload/upload");
    },
    // 图片上传
    init: function(req, res) {
        // 临时文件存放目录
        var tmpPath = global.FILE_UPLOAD_TEMP_ADDR + global.FILE_UPLOAD_TMPDIR + '/',
            // 上传的文件
            inputFile = {},
            // 文件的上传路径
            uploadPath = '',
            // 文件元素名
            trueName = '',
            // 文件后缀名
            ext = '',
            // 新的图片名称
            newName = '',
            // 生成multparty对象，并配置上传目标路径
            form = {},
            // 上传数据
            filesTmp = '',
            // 上传返回信息
            uploadInfo = {
                status: false,
                msg: '上传失败'
            },
            // 上传成功后文件处理的信息
            fileInfo = {},
            getImgUrl = '';
        form = new multiparty.Form({
            uploadDir: tmpPath
        });
        // 上传完成后处理
        form.parse(req, function(err, fields, files) {
            filesTmp = JSON.stringify(files, null, 2);
            if (err) {
                console.log('parse error:' + err);
                res.json(uploadInfo);
            } else {
                console.log('parse files:' + filesTmp);
                inputFile = files.inputFile[0];
                uploadPath = inputFile.path;
                trueName = inputFile.originalFilename;
                ext = trueName.substring(trueName.lastIndexOf('.'));
                newName = uuid.v4() + ext;
                fileInfo.path = global.FILE_URL + global.FILE_UPLOAD_TMPDIR + '/' + newName;
                // fileInfo.trueName = trueName;
                // var imgUrl = global.FILE_URL + 'product/' + uuid.v4() + ext;
                console.log('imgUrl:' + fileInfo.path);
                console.log('uploadPath:' + uploadPath);

                fs.rename(uploadPath, tmpPath + newName,
                    function(err) {
                        if (err) {
                            console.log('文件重命名成功失败');
                            res.json(uploadInfo);
                        } else {
                            console.log('文件重命名成功');
                            uploadInfo.info = fileInfo;
                            uploadInfo.msg = '上传成功';
                            uploadInfo.status = true;
                            res.json(uploadInfo);
                        }
                    });
            }
        });
    },
    // 图片裁剪及压缩
    crop: function(req, res) {
        // 裁剪的图片宽
        var w = req.body.w,
            // 裁剪的图片高
            h = req.body.h,
            // 裁剪的图片开始横坐标
            x = req.body.x,
            // 裁剪的图片开始纵坐标
            y = req.body.y,
            // 需要裁剪的图片的名称
            imgName = req.body.imgName,
            // 图片功能性类型
            type = req.body.type,
            // 图片后缀名
            ext = imgName.substring(imgName.lastIndexOf('.')),
            // uuid
            uid = uuid.v4(),
            // 标准图名
            cropName = global.GETDATE(new Date()) + '_' + uid + '_' + type + ext,
            // 需要裁剪的图片的路径
            oldPath = global.FILE_UPLOAD_TEMP_ADDR + global.FILE_UPLOAD_TMPDIR + '/' + imgName,
            // 输出根目录
            cropPath = global.FILE_UPLOAD_TEMP_ADDR + global.FILE_UPLOAD_DIR + '/',
            // 标准图输出路径
            standardPath = cropPath + cropName,
            // 可访问路径
            canGetUrl = global.FILE_URL + global.FILE_UPLOAD_DIR + '/',
            // 标准图可访问路径
            cStandardPath = canGetUrl + cropName,
            // 返回信息
            cropInfo = {
                status: false,
                msg: '图片裁剪出错'
            },
            imgConf = global.imgConf,
            brandConf = (imgConf && imgConf.brand),
            fileInfo = {};

        // 图片裁剪
        gm(oldPath).crop(w, h, x, y).write(standardPath, function(err) {
            if (err) {
                console.log('corp error........' + err);
                res.json(cropInfo);
            } else {
                if (brandConf && req.body.isResize == true) {
                    /*gm(standardPath).resize(brandConf.width, brandConf.height).write(thumbnailPath, function(err) {
                        if (err) {
                            console.log('resize error........');
                            fs.unlink(standardPath, function(err) {
                                fs.unlink(oldPath, function(err) {
                                    console.log('unlink error...1.....');
                                    res.json(cropInfo);
                                });
                            });
                        } else {
                            fs.rename(oldPath, originPath,
                                function(err) {
                                    if (err) {
                                        console.log('rename error...1.....');
                                        res.json(cropInfo);
                                    } else {
                                        console.log('图片裁剪成功');
                                        fileInfo.origin = {
                                            path: cOriginPath,
                                            name: name
                                        }
                                        fileInfo.standard = {
                                            path: cStandardPath,
                                            name: cropName
                                        }
                                        fileInfo.thumbnail = {
                                            path: cThumbnailPath,
                                            name: resizeName
                                        }
                                        cropInfo.info = fileInfo;
                                        cropInfo.msg = '图片裁剪成功';
                                        cropInfo.status = true;
                                        res.json(cropInfo);
                                    }
                                });
                        }
                    });*/
                } else {
                    fs.unlink(oldPath);
                    fileInfo[type] = {
                        path: cStandardPath,
                        name: cropName
                    }
                    cropInfo.info = fileInfo;
                    cropInfo.msg = '图片裁剪成功';
                    cropInfo.status = true;
                    res.json(cropInfo);
                }
            }
        });
    }
}
