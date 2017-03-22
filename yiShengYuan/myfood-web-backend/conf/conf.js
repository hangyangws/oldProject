/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-06-01.
 * [网站运行配置]
 */

var _export = {
    // 产线配置
    // HOST_SESSION_IP: '127.0.0.1:27017', // session mongodb 数据库配置
    // HOST_DB: 'tmwxhotel', // mongodb 数据库名
    // HOST_IP: '127.0.0.1', // 服务器IP
    // HOST_PORT: '90', // 服务器端口号
    // POJECT: '/tssp-hotel', // 项目名

    // 开发配置
    HOST_SESSION_IP: '127.0.0.1:27017', // session mongodb 数据库配置
    HOST_DB: 'test', // mongodb 数据库名
    HOST_IP: '114.55.37.95', // 服务器IP
    HOST_PORT: '90', // 服务器端口号
    POJECT: '/tssp-hotel', // 项目名

    PORT: '3001', // 项目启动端口
    appName: 'myfood-web-app', // 项目名称
    staticSrc: 'public'
};

module.exports = _export;
