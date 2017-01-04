<?php
return array(
    //'配置项'=>'配置值'
    'session_auto_start' => true, //是否开启session
    //默认进入Home模块
    'DEFAULT_MODULE'     => 'Home',
    //URL路由
    'URL_ROUTER_ON' => true,
    // URL模式
    'URL_MODEL' => 2,
    'DEFAULT_FILTER' =>  '',//关闭转义
    'URL_ROUTE_RULES' => array(
        'account$'=>'Home/User/index',
        'favor$'=>'Home/User/favorites',
        // 'account$'=>'Home/User/index',
        'lovelyplanet/[:p\d]$'=>'Home/Article/index',
        'lovelyplanet/id/:id\d'=>'Home/Article/articleDetail',
        'lovelyplanet/:type/[:p\d]'=>function($type,$p){
            switch ($type) {
                case 'inspired':
                    $categoryid = 1;
                    break;
                case 'story':
                    $categoryid = 2;
                    break;
                case 'guru':
                    $categoryid = 3;
                    break;
                case 'lgbt':
                    $categoryid = 4;
                    break;
            }
            $_SERVER['CATEGORY'] = $type;
            $_SERVER['PATH_INFO'] = 'Article/index/category/'.$categoryid.'/p/'.$p;
            return false;
        },
        ':area/:id\d'=>function($area,$id){
            /**
             * 判断地区
             */
            switch ($area) {
                case 'bali':
                    $areaid = 1;
                    break;
                case 'maldive':
                    $areaid = 5;
                    break;
                case 'australia':
                    $areaid = 6;
                    break;
                case 'thailand':
                    $areaid = 4;
                    break;
                case 'japan':
                    $areaid = 7;
                    break;
                case 'unitedkingdom':
                    $areaid = 3;
                    break;
                default:
                    return false;
                    break;
            }
            $_SERVER['AREA'] = $area;
            $_SERVER['PATH_INFO'] = 'Service/serviceDetail/id/'.$id.'/area/'.$areaid;
            return false;
        },
        ':area/:category/[:p]\d'=>function($area,$category,$p){
            $areaid = "";
            $categoryid = "";
            /**
             * 判断地区
             */
            switch ($area) {
                case 'bali':
                    $areaid = 1;
                    break;
                case 'maldive':
                    $areaid = 5;
                    break;
                case 'australia':
                    $areaid = 6;
                    break;
                case 'thailand':
                    $areaid = 4;
                    break;
                case 'japan':
                    $areaid = 7;
                    break;
                case 'unitedkingdom':
                    $areaid = 3;
                    break;
                default:
                    return false;
                    break;
            }
            /**
             * 判断分类
             */
            switch ($category) {
                case 'venue':
                    $categoryid = 55;
                    break;
                case 'prewedding':
                    $categoryid = 56;
                    break;
                case 'wedding':
                    $categoryid = 57;
                    break;
            }

            $_SERVER['CID'] = $categoryid;
            $_SERVER['AREA'] = $area;
            $_SERVER['PATH_INFO'] = 'Service/index/area/'.$areaid.'/categoryid/'.$categoryid.'/p/'.$p;
            return false;
        }
    ),
    // 配置邮件发送服务器
    'MAIL_HOST' =>'smtp.qq.com',//smtp服务器的名称
    'MAIL_SMTPAUTH' =>TRUE, //启用smtp认证
    'MAIL_USERNAME' =>'2659567955@qq.com',//你的邮箱名
    'MAIL_FROM' =>'2659567955@qq.com',//发件人地址
    'MAIL_FROMNAME'=>'wederful',//发件人姓名
    'MAIL_PASSWORD' =>'lmqokjxxichmdiea',//邮箱密码
    'MAIL_CHARSET' =>'utf-8',//设置邮件编码
    'MAIL_ISHTML' =>TRUE, // 是否HTML格式邮件
    'MAIL_DEBUG' =>FALSE,

    'DB_SQL_BUILD_CACHE' => true,//sql解析缓存

    'URL_CASE_INSENSITIVE' =>false, // 不区分大小写

    'SHOW_PAGE_TRACE' => false,//开启trace
    //开启语言包功能
    'LANG_SWITCH_ON' => true,
    //自动侦测语言 开启多语言功能后有效
    'LANG_AUTO_DETECT' => true,
    //允许切换的语言列表 用逗号分隔
    'LANG_LIST' => 'zh-cn,en-us',
    //默认语言切换变量
    'VAR_LANGUAGE' => 'lang',
    //模板后缀
    'TMPL_TEMPLATE_SUFFIX'=>'.tpl',
    // 显示错误信息
    'SHOW_ERROR_MSG' =>  true,
    //设置后缀名为空
    'URL_HTML_SUFFIX'=>'',

    // 'TOKEN_ON'      =>    false,  // 是否开启令牌验证 默认关闭
    // 'TOKEN_NAME'    =>    '__hash__',    // 令牌验证的表单隐藏字段名称，默认为__hash__
    // 'TOKEN_TYPE'    =>    'md5',  //令牌哈希验证规则 默认为MD5
    // 'TOKEN_RESET'   =>    true,  //令牌验证出错后是否重置令牌 默认为true

    //数据库配置信息
    'DB_TYPE'   => 'mysqli', // 数据库类型
    'DB_HOST'   => 'localhost', // 服务器地址
    'DB_NAME'   => 'tp_wederful', // 数据库名
    'DB_USER'   => 'root', // 用户名
    'DB_PWD'    => 'root', // 密码
    'DB_PORT'   => 3306, // 端口
    'DB_CHARSET'=> 'utf8', // 字符集
    'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增


    'BACKEND_PAGESIZE' => 20,//后台产品列表pagesize
    'TAGLIB_PRE_LOAD' => 'Admin\TagLib\ExtendsTags',//预加载自定义标签
    'QINIU_CONFIG' => array(
        'secretKey'      => 'kDnayIo-3r6NUaUhGOm3dQtwTcczD-lhy9QSJaOb', //七牛服务器
        'accessKey'      => 'h2WokpMaskgB6f1L8JsgC62_gfqUHe7e3vKwXasR', //七牛用户
        'domain'         => '7xo7hn.com1.z0.glb.clouddn.com',
        'bucket'         => 'project', //空间名称
    ),
    'UPLOAD_SITEIMG_QINIU' => array(
                    'maxSize' => 5 * 1024 * 1024,//文件大小
                    'rootPath' => './',
                    'saveName' => array('uniqid', ''),
                    'driver' => 'Qiniu',
                    'driverConfig' =>array(
                            'secretKey' => 'kDnayIo-3r6NUaUhGOm3dQtwTcczD-lhy9QSJaOb',
                            'accessKey' => 'h2WokpMaskgB6f1L8JsgC62_gfqUHe7e3vKwXasR',
                            'domain' => '7xo7hn.com1.z0.glb.clouddn.com',
                            'bucket' => 'project'
                    )
    ),
    'DEPOSIT_RATIO' => array('10','20','30','40','50','60','70','80','90','100'),//定金比例

    'MODULE_ALLOW_LIST' => array('Home','Admin')
);