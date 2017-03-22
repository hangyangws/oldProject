/**
 * 酒店品牌管理服务
 * created by hangyangws in 2016-02-24.
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    add: function(req, res) {
        res.render('hotelType/add', {
            username: req.session.username
        });
    },
    save: function(req, res) {
        try {
            var saveHBrandReq = {},
                saveInfo = {},
                uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotelBrand'].join(''),
                options = {
                    json: {
                        "name": req.body.name,
                        "imagepath": req.body.imagepath,
                        "orderlist": req.body.orderlist - 0
                    }
                },
                info = {
                    status: false,
                    msg: '保存失败'
                };
            saveHBrandReq = syncRequest(global.METHOD_POST, uri, options);
            saveInfo = JSON.parse(saveHBrandReq.getBody('utf-8'));
            if (saveHBrandReq.statusCode == 200) {
                if (saveInfo.status == 201) {
                    info.status = true;
                    info.msg = '保存成功';
                } else if (saveInfo.status == 415 || saveInfo.status == 404) {
                    info.msg = saveInfo.message;
                }
            } else {
                info.msg = '网络异常';
            }
        } catch (e) {
            logger.error('服务器异常:' + e);
            info.msg = '服务器异常';
        }
        res.json(info);
    },
    list: function(req, res) {
        var info = {
                status: false,
                msg: '获取数据异常',
                data: {}
            },
            pageIndex = req.query.pageIndex,
            pageSize = req.query.pageSize,
            search = req.params.search,
            isPage = req.query.isPage,
            apiUrl = '',
            uri = '',
            listReq = {},
            listReqStr = '',
            listBrand = {},
            listInfo = {},
            tmpObj = {},
            standardImg = {},
            tempUrl = '';
        try {
            if (!search) {
                apiUrl = '/api/hotelHotelBrand/search/';
            } else {
                apiUrl = '/api/hotelHotelBrand/search/' + encodeURI(encodeURI(search));
            }
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, apiUrl].join('');
            if (isPage === 'false') {
                uri += '?isPage=false';
            } else {
                if (pageIndex && pageSize) {
                    uri = uri + '?pageNum=' + pageIndex + '&count=' + pageSize;
                } else if (pageIndex && !pageSize) {
                    uri = uri + '?pageNum=' + pageIndex;
                } else if (!pageIndex && pageSize) {
                    uri = uri + '?count=' + pageSize
                }
            }
            listReq = syncRequest(global.METHOD_GET, uri);
            listInfo = JSON.parse(listReq.getBody('utf-8'));
            if (listReq.statusCode == 200) {
                if (listInfo.status == 200) {
                    info.status = true;
                    info.msg = '获取数据正常';
                    for (var i = 0; i < listInfo.data.list.length; i++) {
                        tmpObj = listInfo.data.list[i];
                        standardImg = JSON.parse(tmpObj.imagepath).standard;
                        if (standardImg) {
                            for (var obj in standardImg) {
                                tempUrl = global.FILE_URL + global.FILE_UPLOAD_DIR + '/' + obj;
                                break;
                            }
                            tmpObj.imagepath = tempUrl;
                        }
                    }
                    info.data = listInfo;
                } else if (listInfo.status == 404) {
                    info.status = true;
                    info.msg = '没有取到任何数据';
                } else {
                    info.msg = '服务器异常';
                }
            } else {
                info.msg = '服务器异常';
            }
        } catch (e) {
            logger.error('首页异常:' + e);
            info.msg = '网络异常';
        }
        info.username = req.session.username;
        info.search = search ? search : '';
        if (isPage === 'false') {
            res.json(info);
        } else {
            res.render('hotelType/index', info);
        }
    },
    delete: function(req, res) {
        var info = {
                status: false,
                msg: "删除品牌失败"
            },
            deleteReq = {},
            uri = [
                'http://',
                global.HOST_IP,
                ':',
                global.HOST_PORT,
                global.POJECT,
                '/api/hotelHotelBrand/',
                req.params.id
            ].join(''),
            deleteInfo = '',
            deleteBrand = {};

        deleteReq = syncRequest(global.METHOD_DELETE, uri);
        deleteInfo = deleteReq.getBody('utf-8');
        deleteBrand = JSON.parse(deleteInfo);
        if (deleteReq.statusCode == 200) {
            if (deleteBrand.status == 205) {
                info.status = true;
                info.msg = '删除品牌成功';
            } else if (deleteBrand.status == 415) {
                info.msg = '此品牌下包含酒店，不能删除';
            }
        } else {
            info.status = false;
            info.msg = '网络异常';
        }
        res.json(info);
    },
    update: function(req, res) {
        var info = {
                status: false,
                msg: '更新品牌失败'
            },
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotelBrand'].join(''),
            options = {
                json: {
                    "id": req.body.id,
                    "name": req.body.name,
                    "imagepath": req.body.imagepath,
                    "orderlist": req.body.orderlist - 0
                }
            },
            putReq = {},
            putInfo = '',
            putBrand = {};
        try {
            putReq = syncRequest(global.METHOD_PUT, uri, options);
            putInfo = JSON.parse(putReq.getBody('utf-8'));
            if (putReq.statusCode == 200) {
                if (putInfo.status == 205) {
                    info.status = true;
                    info.msg = '保存成功';
                } else if (putInfo.status == 415 || putInfo.status == 404) {
                    info.msg = putInfo.message;
                }
            } else {
                info.msg = '网络异常';
            }
        } catch (e) {
            logger.error('服务器异常:' + e);
            info.msg = '服务器异常';
        }
        res.json(info);
    },
    get: function(req, res) {
        var info = {
                status: false,
                msg: "获取品牌失败"
            },
            id = req.params.id,
            getReq = {},
            getInfo = '',
            brand = {},
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, '/api/hotelHotelBrand/' + id].join(''),
            standardImg = '',
            tempUrl = '';

        try {
            getReq = syncRequest(global.METHOD_GET, uri);
            getInfo = getReq.getBody('utf-8');
            brand = JSON.parse(getInfo);
            if (getReq.statusCode == 200) {
                if (brand.status == 200) {
                    standardImg = JSON.parse(brand.data.imagepath).standard;
                    if (standardImg) {
                        for (var obj in standardImg) {
                            tempUrl = global.FILE_URL + global.FILE_UPLOAD_DIR + '/' + obj;
                            break;
                        }
                        brand.data.tempImagepath = tempUrl;
                    }
                    info.status = true;
                    info.msg = '获取品牌成功';
                    info.data = brand;
                } else {
                    info.msg = '获取品牌失败';
                }
            } else {
                info.msg = '服务器异常';
            }
        } catch (e) {
            info.status = false;
            info.msg = '网络异常';
        }
        info.username = req.session.username;
        res.render('hotelType/add', info);
    }
}
