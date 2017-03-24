/**
 * 微信支付和登录相关配置
 */

module.exports = {
    // 产线配置
    WX_REDIRECT_URL: 'http://gaoyuan.treemee.cn/weixin/loginCallback',
    WX_NOTIFY_URL: 'http://gaoyuan.treemee.cn/order/wxpay/notify',
    PAY_NOTIFY_URL: 'http://gaoyuan.treemee.cn/pay/notify',
    WX_PFX_PATH: '/root/gy-run/run-res/wechat-pay-cert/apiclient_cert.p12',

    // 开发配置
    // WX_REDIRECT_URL: 'http://hangyangws.ngrok.natapp.cn/weixin/loginCallback',
    // WX_NOTIFY_URL: 'http://hangyangws.ngrok.natapp.cn/order/wxpay/notify',
    // PAY_NOTIFY_URL: 'http://hangyangws.ngrok.natapp.cn/pay/notify',
    // WX_PFX_PATH: 'E:/temp/apiclient_cert.p12',

    // 基本配置
    WX_APPID: 'wx3145febe4ba1ad3e',
    WX_APPSECRET: '4a584396859f02157e44b7c98abe4fc2',

    WX_RESPONSE_TYPE: 'code',
    WX_SCOPE: 'snsapi_base',
    WX_STATE: 'debb3b7354c82a8c55553ec47970d9d1',

    // 支付相关配置
    WX_MCH_ID: '1322383401',
    WX_MCH_KEY: 'GYHwxpt4006602288057489081961088'
}
