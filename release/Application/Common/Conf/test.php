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
	// 'URL_CASE_INSENSITIVE' =>true // 不区分大小写
	
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

	//数据库配置信息
    'DB_TYPE'   => 'mysqli', // 数据库类型
    'DB_HOST'   => 'localhost', // 服务器地址
    'DB_NAME'   => 'tp_wederful', // 数据库名
    'DB_USER'   => 'root', // 用户名
    'DB_PWD'    => 'root', // 密码
    'DB_PORT'   => 3306, // 端口
    'DB_CHARSET'=> 'utf8', // 字符集
    'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增
	
);