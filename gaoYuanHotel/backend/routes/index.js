/**
 * [app.use
 * 第一个参数为路由 eg: http://localhost:3001/login 表示 下面的第二行，表示进入登录页面
 * 第二个参数为路由执行的控制器的require 的 模块]
 * reated by hangyangws in 2016-03-01
 */

module.exports = function(app) {
    app.use('/', require('./index/IndexController'));
    app.use('/login', require('./login/LoginController'));
    app.use('/hotelType', require('./hotelType/HotelTypeController'));
    app.use('/imgCrop', require('./imgCrop/ImgCropController'));
    app.use('/upload', require('./upload/UploadController'));
    app.use('/hotel', require('./hotel/HotelController'));
    app.use('/hotelRoom', require('./room/RoomController'));
    app.use('/hotelMember', require('./hotelMember/MemberController'));
    app.use('/hotelMemberrank', require('./memberRank/MemberRankController'));
    app.use('/roomRule', require('./roomRule/RoomRuleController'));
    app.use('/roomOrder', require('./roomOrder/RoomOrderController'));
    app.use('/refundOrder', require('./refund/RefundController'));
}
