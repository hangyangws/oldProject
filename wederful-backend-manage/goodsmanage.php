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
                    <a href="">商品管理</a>
                </nav>
                <div class="fr c">
                    <!-- 第一个不需要 class ml20 -->
                    <label class="nav-search fl">
                        <input class="i-input i-b1m fl" type="text" />
                        <button class="i-button fl" type="botton">搜索</button>
                    </label>
                    <a href="addgoods.php" class="i-button i-b-mw fl ml20">新增商品</a>
                </div>
            </div>
            <!-- 搜索区域 select 集 -->
            <div class="mb20 c">
                <select class="i-select fl mr10">
                    <option value="0">选择地区</option>
                    <option value="1">巴厘岛</option>
                    <option value="2">爱尔兰</option>
                </select>
                <select class="i-select fl">
                    <option value="0">选择分类</option>
                    <option value="1">第一类</option>
                    <option value="2">第二类</option>
                </select>
            </div>
            <!-- 结果展示区域 table -->
            <table class="i-table mb20 w1">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>商品编号</th>
                        <th>商品名称</th>
                        <th>所在地</th>
                        <th>起始价格</th>
                        <th>访问数</th>
                        <th>收藏数</th>
                        <th>销售数</th>
                        <th>创建时间</th>
                        <th>创建人</th>
                        <th>促销</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>TH383628</td>
                        <td>清迈文华东方教堂场地</td>
                        <td>泰国-清迈</td>
                        <td>$3500</td>
                        <td>65</td>
                        <td>100</td>
                        <td>2</td>
                        <td>2015-05-09  12:03</td>
                        <td>A同学</td>
                        <td>促销中</td>
                        <td><a href="#">查看</a> / <a href="#">编辑</a></td>
                    </tr>
                </tbody>
            </table>
            <!-- 分页 paging -->
            <div class="con-paging mb20 c h30 i-lh30">
                <dl class="fl mr20">
                    <dt class="dlb">商品数：</dt>
                    <dd class="dlb">20</dd>
                </dl>
                <div class="fl mr20">
                    <span>当前页：</span>
                    <div class="dlb">
                        <i class="paging-dir disable">&lt;</i>
                        <span class="paging-now">1</span>
                        <i class="paging-dir">&gt;</i>
                    </div>
                </div>
                <div class="fl">
                    转到
                    <select class="i-select">
                        <option value="1">1</option>
                    </select>
                    页
                </div>
            </div>
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
