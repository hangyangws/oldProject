/**
 * 会员查询
 */

var syncRequest = require('sync-request'),
    global = require('../../util/global'),
    logger = require('../../log/logConfig').logger;

module.exports = {
    list: function(req, res) {
        var info = {
                status: false,
                msg: '获取数据异常'
            },
            pageIndex = req.query.pageIndex,
            pageSize = req.query.pageSize,
            search = req.params.search,
            isPage = req.query.isPage,
            isaccountenabled = req.query.isaccountenabled,
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
                apiUrl = '/api/hotelMember/search/';
            } else {
                apiUrl = '/api/hotelMember/search/' + encodeURI(encodeURI(search));
            }
            uri = ['http://', global.HOST_IP, ':', global.HOST_PORT, global.POJECT, apiUrl].join('');
            if (isPage === 'false') {
                uri += '?isPage=false';
                if (isaccountenabled) {
                    uri += "&isaccountenabled=" + isaccountenabled;
                }
            } else {
                if (pageIndex && pageSize) {
                    uri = uri + '?pageNum=' + pageIndex + '&count=' + pageSize;
                } else if (pageIndex && !pageSize) {
                    uri = uri + '?pageNum=' + pageIndex;
                } else if (!pageIndex && pageSize) {
                    uri = uri + '?count=' + pageSize
                }
                if (isaccountenabled) {
                    uri += (uri.indexOf('?') === -1 ? '?' : '&') + "isaccountenabled=" + isaccountenabled;
                }
            }
            listReq = syncRequest(global.METHOD_GET, uri);
            listInfo = JSON.parse(listReq.getBody('utf-8'));
            if (listReq.statusCode == 200) {
                if (listInfo.status == 200) {
                    info.status = true;
                    info.msg = '获取数据正常';
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
            console.log(e);
            logger.error('首页异常:' + e);
            info.msg = '网络异常';
        }
        info.username = req.session.username;
        info.search = search ? search : '';
        info.isaccountenabled = isaccountenabled ? isaccountenabled : '';
        if (isPage === 'false') {
            res.json(info);
        } else {
            res.render('member/index', info);
        }
    }
}
