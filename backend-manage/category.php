<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="UTF-8" />
    <title>商品管理 - wederful</title>
    <meta name="author" content="wederfull" />
    <meta name="Copyright" content="wederful.com 版权所有" />
    <link rel="shortcut icon" href="img/shutIco.ico" type="image/x-icon" sizes="16x16 32x32" />
    <!-- basic -->
    <link rel="stylesheet" href="css/base.css" />
    <!-- public -->
    <link rel="stylesheet" href="css/public.css" />
    <!-- this -->
    <link rel="stylesheet" href="css/head-foot.css" />
    <link rel="stylesheet" href="css/all.css" />
    <!--[if lt IE 10]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body id="body">
    <?php
        require_once "public/header.php";
    ?>
    <!-- 主体 -->
    <main class="page_goodsmanage main bb pr">
        <?php
            require_once "public/nav.php";
        ?>
        <section id="allWrap">
            <!-- 导航栏 -->
            <div class="con-nav i-lh30 i-bcm h30 p10 mb20 c">
                <nav class="fl">
                    <a href="index.php">后台</a>
                    <a href="goodsmanage.php">商品管理</a>
                    <a href="">属性类别</a>
                </nav>
            </div>
            <!-- 折叠导航 -->
            <ul class="fold-nav mb20 i-lh30">
                <li data-id="0">
                    <div class="c mb5">
                        <button class="fold-nav-open mr5 bct fl"></button>
                        <span class="fl">分类名称1</span>
                        <button type="button" class="i-button i-b-mw fr ml20">删除</button>
                        <button type="button" class="i-button i-b-mw fr">添加子类</button>
                    </div>
                    <ul class="pl20">
                        <li data-id="1">
                            <div class="c mb10">
                                <button class="fold-nav-close mr5 r50 pr fl"></button>
                                <span class="fl">分类名称2</span>
                                <button type="button" class="i-button i-b-mw fr ml20">删除</button>
                                <button type="button" class="i-button i-b-mw fr">添加属性</button>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>
    </main>
    <!-- 页脚 -->
    <footer></footer>
    <!-- mask -->
    <div id="mask"></div>
    <!-- script -->
    <script src="js/jq.js"></script>
    <script src="js/public.js"></script>
    <!-- 日期选择 -->
    <link href="css/inputdate.css" rel="stylesheet" />
    <script src="js/inputdate.js"></script>
    <!-- this -->
    <script src="js/all.js"></script>
</body>
</html>
