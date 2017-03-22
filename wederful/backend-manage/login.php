<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="UTF-8" />
    <title>后台登录 - wederful</title>
    <meta name="author" content="wederfull" />
    <meta name="Copyright" content="wederful.com 版权所有" />
    <link rel="shortcut icon" href="img/shutIco.ico" type="image/x-icon" sizes="16x16 32x32" />
    <!-- basic -->
    <link rel="stylesheet" href="css/base.css" />
    <!-- public -->
    <link rel="stylesheet" href="css/public.css" />
    <!-- this -->
    <link rel="stylesheet" href="css/login.css" />
    <!--[if lt IE 10]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body id="body">
    <!-- 主体 -->
    <main class="main h1">
        <section class="login-wrap r4">
            <label class="db mb10 c">
                <span class="dlb tar w100 fs16 fc3 fl">用户名</span>
                <input id="name" type="text" />
            </label>
            <label class="db c">
                <span class="dlb tar w100 fs16 fc3 fl">密&emsp;码</span>
                <input id="pass" type="password" />
            </label>
            <div class="submit-wrap mt10 c">
                <button id="submit" class="login db dlb fl mr10" type="button">登&ensp;陆</button>
                <span id="error" class="error fl">&emsp;</span>
            </div>
        </section>
    </main>
    <script src="js/jq.js"></script>
    <script src="js/login.js"></script>
</body>

</html>
