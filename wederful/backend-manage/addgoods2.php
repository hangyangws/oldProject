<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="UTF-8" />
    <title>商品添加 - wederful</title>
    <meta name="author" content="wederfull" />
    <meta name="Copyright" content="wederful.com 版权所有" />
    <link rel="shortcut icon" href="img/shutIco.ico" type="image/x-icon" sizes="16x16 32x32" />
    <!-- basic -->
    <link rel="stylesheet" href="css/base.css" />
    <!-- public -->
    <link rel="stylesheet" href="css/public.css" />
    <!-- 富文本 -->
    <link rel="stylesheet" href="css/simditor.css" />
    <!-- this -->
    <link rel="stylesheet" href="css/head-foot.css" />
    <link rel="stylesheet" href="css/all.css" />
    <!--[if lt IE 10]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script>
        var global = {};
    </script>
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
                    <a href="">商品信息</a>
                    <a href="">须知/图片管理</a>
                </nav>
            </div>
            <form action="temp/del.php" method="post">
                <!-- 内容展示 -->
                <table class="con-show w1">
                    <tbody>
                        <!-- 预定须知 -->
                        <tr>
                            <td colspan="3" class="mb10 fs20 fc3 mr30">预订须知</td>
                        </tr>
                        <tr>
                            <td>预订须知</td>
                            <td>
                                <textarea name="text-area1" class="edit-dom i-textarea i-w-long"></textarea>
                            </td>
                            <td>&emsp;</td>
                        </tr>
                        <tr>
                            <td>费用包含</td>
                            <td>
                                <textarea name="text-area2" class="edit-dom i-textarea i-w-long"></textarea>
                            </td>
                            <td>&emsp;</td>
                        </tr>
                        <tr>
                            <td>费用不包含</td>
                            <td>
                                <textarea name="text-area3" class="edit-dom i-textarea i-w-long"></textarea>
                            </td>
                            <td>&emsp;</td>
                        </tr>
                        <tr>
                            <td>费用其他</td>
                            <td>
                                <textarea name="text-area4" class="edit-dom i-textarea i-w-long"></textarea>
                            </td>
                            <td>&emsp;</td>
                        </tr>
                        <tr>
                            <td>取消政策</td>
                            <td>
                                <textarea name="text-area5" class="edit-dom i-textarea i-w-long"></textarea>
                            </td>
                            <td>&emsp;</td>
                        </tr>
                        <tr>
                            <td>修改政策</td>
                            <td>
                                <textarea name="text-area6" class="edit-dom i-textarea i-w-long"></textarea>
                            </td>
                            <td>&emsp;</td>
                        </tr>
                        <!-- 图片管理 -->
                        <tr>
                            <td colspan="3" class="mb10 fs20 fc3 mr30">图片管理</td>
                        </tr>
                        <tr>
                            <td>大图<br />900x400</td>
                            <td colspan="2">
                                <!--<figure>
                                    <img src="img/wdf_wx.png" alt="大图" />
                                </figure> -->
                                <span class="add-img"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>缩略图<br />200x150</td>
                            <td colspan="2">
                                <!--<figure>
                                    <img src="img/wdf_wx.png" alt="大图" />
                                </figure> -->
                                <span class="add-img"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>详情图<br />600x400</td>
                            <td colspan="2">
                                <!--<figure>
                                    <img src="img/wdf_wx.png" alt="大图" />
                                </figure> -->
                                <span class="add-img"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- 产品操作 -->
                <div class="con-operation tac pt20 mb30">
                    <button class="i-button i-b-mw">保存 / 下一步</button>
                </div>
            </form>
        </section>
    </main>
    <!-- 页脚 -->
    <footer></footer>
    <!-- mask -->
    <div id="mask"></div>
    <!-- script -->
    <script src="js/jq.js"></script>
    <script src="js/public.js"></script>
    <!-- 富文本 -->
    <script src="js/module.min.js"></script>
    <script src="js/uploader.min.js"></script>
    <script src="js/hotkeys.min.js"></script>
    <script src="js/simditor.min.js"></script>
    <!-- 日期选择 -->
    <link href="css/inputdate.css" rel="stylesheet" />
    <script src="js/inputdate.js"></script>
    <!-- this -->
    <script src="js/all.js"></script>
</body>
</html>
