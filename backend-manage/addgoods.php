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
                    <a href="">商品信息</a>
                    <a href="">添加商品</a>
                </nav>
            </div>
            <!-- 内容展示 -->
            <table class="con-show w1">
                <tbody>
                    <!-- 基本信息 -->
                    <tr>
                        <td colspan="3" class="mb10 fs20 fc3 mr30">基本信息</td>
                    </tr>
                    <tr>
                        <td>商品名称</td>
                        <td><input class="i-input i-w-long" type="text" placeholder="中文名" /></td>
                        <td><input class="i-input i-w-long" type="text" placeholder="英文名" /></td>
                    </tr>
                    <tr>
                        <td>商品所在地区</td>
                        <td>
                            <select class="i-select i-w-short i-mr10">
                                <option value="null">请选择地区</option>
                                <option value="0">巴厘岛</option>
                                <option value="1">英国</option>
                            </select>
                            <select class="i-select i-w-short">
                                <option value="null">请选择地区</option>
                                <option value="0">乌鲁瓦图</option>
                                <option value="1">爱尔兰</option>
                            </select>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商家名称</td>
                        <td class="c">
                            <select name="vendorname" class="select-merchant i-select i-w-short vat i-mr10 fl">
                                <option value="null">选择商家</option>
                                <option value="0">这个酒店A</option>
                                <option value="1">那个酒店B</option>
                            </select>
                            <span class="dlb i-w-short fl ml5">
                                <button class="check-merchant i-button i-w-short fl" type="button">查看</button>
                                <button class="add-merchant i-button i-w-short fr" type="button">添加</button>
                            </span>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商品分类</td>
                        <td>
                            <select class="i-select i-w-short i-mr10">
                                <option value="0">水上婚礼</option>
                                <option value="1">沙滩婚礼</option>
                            </select>
                            <select class="i-select i-w-short none">
                                <option value="null">请选择地区</option>
                                <option value="0">乌鲁瓦图</option>
                                <option value="1">爱尔兰</option>
                            </select>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商品属性</td>
                        <td class="goods-attr">
                            <div class="mb10">
                                <span class="vat">空调情况：</span>
                                <select class="i-select i-w-short">
                                    <option value="0">不含空调</option>
                                    <option value="1">含空调</option>
                                </select>
                            </div>
                            <div class="mb10">
                                <span class="vat">中文服务：</span>
                                <select class="i-select i-w-short">
                                    <option value="0">包含空调</option>
                                    <option value="0">不包含空调</option>
                                </select>
                            </div>
                            <div class="mb10">
                                <span class="vat">最大人数：</span>
                                <input class="i-input i-w-short" type="text" value="30" />
                            </div>



                            <div class="mb10">
                                <span class="vat">场地类型：</span>
                                <select class="i-select i-w-short">
                                    <option value="0">水上婚礼</option>
                                    <option value="0">沙滩婚礼</option>
                                </select>
                            </div>
                            <div class="mb10">
                                <span class="vat">开业世间：</span>
                                <input class="i-input i-w-short" type="text" value="2009" />
                            </div>
                            <div class="mb10">
                                <span class="vat">客房数量：</span>
                                <input class="i-input i-w-short" type="text" value="30" />
                            </div>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商品描述</td>
                        <td>
                            <textarea class="i-textarea i-w-long" placeholder="商品中文描述"></textarea>
                        </td>
                        <td>
                            <textarea class="i-textarea i-w-long" placeholder="商品英文描述"></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- 产品操作 -->
            <div class="con-operation tac pt20 mb30">
                <button class="i-button i-b-mw">保存 / 下一步</button>
            </div>
        </section>
    </main>
    <!-- 页脚 -->
    <footer></footer>
    <!-- mask -->
    <div id="mask">
        <!-- 商家信息编辑 -->
        <div class="m-add-merchant r4 bcf bc">
            <label class="db mb10">
                <span>商家名称</span>
                <input name="name" class="save-item i-input" type="text" />
            </label>
            <label class="db mb10">
                <span>商家地址</span>
                <input name="address" class="save-item i-input" type="text" />
            </label>
            <label class="db mb10">
                <span>联系人</span>
                <input name="contacts" class="save-item i-input" type="text" />
            </label>
            <label class="db mb10">
                <span>联系电话</span>
                <input name="mobile" class="save-item i-input" type="text" />
            </label>
            <label class="db mb10">
                <span>联系邮箱</span>
                <input name="email" class="save-item i-input" type="text" />
            </label>
            <label class="db mb5">
                <span>其他</span>
                <textarea name="other" class="save-item i-textarea bb"></textarea>
            </label>
            <label class="db mb10">
                <span>&emsp;</span>
                <span class="i-error">&emsp;</span>
            </label>
            <label class="db mb10">
                <span>&emsp;</span>
                <div class="dlb">
                    <button class="close-mask i-button i-b-mw mr20" type="bubtton">关闭</button>
                    <button class="save-merchant i-button i-b-mw" type="bubtton">保存</button>
                </div>
            </label>
        </div>
    </div>
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
