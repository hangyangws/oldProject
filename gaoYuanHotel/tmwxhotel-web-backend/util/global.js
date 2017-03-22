/**
 * [关于一些常量的配置]
 * created by hangyangws in 2016-04-22
 */

module.exports = {
    /**
     * 网站运行配置
     */
    FILE_UPLOAD_TMPDIR: '/tmp',
    FILE_UPLOAD_DIR: '/pub',
    // 产线配置
    // HOST_SESSION_IP: '127.0.0.1:27017', // session mongodb 数据库配置
    // HOST_DB: 'tmwxhotel', // mongodb 数据库名
    // HOST_IP: '127.0.0.1', // 服务器IP
    // FILE_UPLOAD_TEMP_ADDR: '/root/90-tomcat-7/webapps/gy-wxhotel-img', // 项目图片存放绝对路径
    // FILE_URL: 'http://114.55.37.95:90/gy-wxhotel-img', // 图片访问路径
    // HOST_PORT: '90', // 端口号
    // POJECT: '/tssp-hotel', // 项目名
    // 开发配置
    HOST_SESSION_IP: '127.0.0.1:27017', // session mongodb 数据库配置
    HOST_DB: 'test', // mongodb 数据库名
    HOST_IP: '114.55.37.95', // 服务器IP
    FILE_UPLOAD_TEMP_ADDR: 'D:/phpStudy/WWW/hotel_img', // 项目图片存放绝对路径
    FILE_URL: 'http://114.55.37.95:90/gy-wxhotel-img', // 图片访问路径
    HOST_PORT: '90', // 端口号
    POJECT: '/tssp-hotel', // 项目名
    /**
     * 项目基本配置
     */
    METHOD_GET: 'GET',
    METHOD_POST: 'POST',
    METHOD_DELETE: 'DELETE',
    METHOD_PUT: 'PUT',
    PATH_UPLOAD: './upload/', //文件上传保存路径
    REQ_URL: '/login,/users,/language,/login/captcha', //规则：每个路径需以‘,’隔开
    // 缩略图宽高比例配置
    imgConf: {
        brand: {
            width: 240,
            height: 240
        }
    },
    /**
     * 常用方法
     */
    // 日期处理返回 eg: 19930512
    GETDATE: function (date) {
        var date = date || new Date(),
            _return_date = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();
        _return_date += (month < 10 ? ('0' + month) : month);
        _return_date += (day < 10 ? ('0' + day) : day);
        return _return_date;
    },
    // 获取客户端ip
    GETCLIENT_IP: function (req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    // 获取随机数
    RANDOMSTRING: function (_len) {
        var _str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            _str_l = _str.length - 1,
            _len = _len || 32,
            _temp_str = [];
        while (_len--) {
            _temp_str.push(_str.charAt(~~(Math.random() * _str_l)));
        }
        return _temp_str.join('');
    }
};
