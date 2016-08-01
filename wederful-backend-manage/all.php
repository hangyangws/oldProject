<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="UTF-8" />
    <title>模板统一页面 - wederful</title>
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
    <main class="main bb pr">
        <?php
            require_once "public/nav.php";
        ?>
        <section id="allWrap">
            <!-- 导航栏 -->
            <div class="con-nav i-lh30 i-bcm p10 mb20 c">
                <nav class="fl">
                    <a href="index.php">后台</a>
                    <a href="goodsmanage.php">商品管理</a>
                </nav>
                <div class="fr c">
                    <!-- 第一个不需要 class ml20 -->
                    <dl class="fl dlb">
                        <dt class="fl">总页数:</dt>
                        <dd class="fl">111</dd>
                    </dl>
                    <label class="nav-search fl ml20">
                        <input class="i-input i-b1m fl" type="text" />
                        <button class="i-button fl" type="botton">搜索</button>
                    </label>
                    <select class="i-select ml20">
                        <option value="0">Tools</option>
                        <option value="1">Excel</option>
                    </select>
                    <button class="i-button i-b-mw fl ml20" type="button">新增商品</button>
                    <a href="#" class="i-button i-b-mw fl ml20">新增商品</a>
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
            <!-- h4 二级标题 -->
            <div class="mb20">
                <h4 class="fs20 fc3 dlb mr30">基本信息</h4>
                <button class="i-button i-b-mw" type="button">编辑</button>
            </div>
            <div class="mb20">
                <h4 class="fs20 fc3 dlb mr30">目的地管理</h4>
                <select class="i-select mr30">
                    <option value="0">选择目的地</option>
                    <option value="1">英国</option>
                </select>
                <select class="i-select mr30">
                    <option value="0">选择地区</option>
                    <option value="1">英国</option>
                </select>
                <button class="i-button i-b-mw mr30" type="button">增加目的地</button>
                <button class="i-button i-b-mw" type="button">删除目的地</button>
            </div>
            <div class="mb20">
                <h4 class="fs20 fc3 dlb mr30">目的地管理<span class="dlb ml30">套餐A：巴厘岛宝格丽泳池婚礼简约套餐</span></h4>
            </div>
            <!-- 内容展示 -->
            <table class="con-show w1">
                <tbody>
                    <tr>
                        <td>商品名称</td>
                        <td>巴厘岛宝格丽泳池婚礼</td>
                        <td>Bulgari water wedding Bali</td>
                    </tr>
                    <tr>
                        <td>商品名称</td>
                        <td><input class="i-input i-w-long" type="text" value="巴厘岛宝格丽泳池婚礼" /></td>
                        <td><input class="i-input i-w-long" type="text" value="Bulgari water wedding Bali" /></td>
                    </tr>
                    <tr>
                        <td>商品所在地区</td>
                        <td>巴厘岛，乌鲁瓦图</td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>取消费用</td>
                        <td colspan="2">
                            <section class="dlb">
                                <div class="mb10">在婚礼日期前<input class="i-input i-max-width ml10 mr10" type="text" />天取消，不罚款</div>
                                <div class="mb10">在婚礼日期前<input class="i-input i-max-width ml10 mr10" type="text" />天取消，扣除定金比例<input class="i-input i-max-width ml10 mr10" type="text" />% </div>
                            </section>
                            <button class="i-button i-b-w ml10 mr10" type="button">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td>人数范围</td>
                        <td colspan="2">
                            <input class="i-input i-max-width mr10" type="text" /> - <input class="i-input i-max-width ml10 mr10" type="text" />
                        </td>
                    </tr>
                    <tr>
                        <td>超出费用</td>
                        <td>
                            <input class="i-input i-w-short mr10" type="text" placeholder="超出人数费用" /> / 人
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>不可提供日期</td>
                        <td colspan="2">
                            <section class="dlb">
                                <div class="mb10">
                                    <input class="input-date i-input mr10" type="text" placeholder="选择开始日期" />到<input class="input-date i-input ml10 mr10" type="text" placeholder="选择结束日期" />
                                </div>
                            </section>
                            <button class="i-button i-b-w mr10" type="button">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td>日期/价格</td>
                        <td colspan="2">
                            <section class="dlb">
                                <div>
                                    <input class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" />到<input class="input-date i-input ml10 mr10" type="text" placeholder="选择结束日期" />
                                    <input class="i-input i-max-width mr10 mb10" type="text" placeholder="价格" />
                                </div>
                            </section>
                            <button class="i-button i-b-w mr10" type="button">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td>商品促销</td>
                        <td colspan="2">
                            <section class="dlb">
                                <div>
                                    <input class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" />到<input class="input-date i-input ml10 mr10" type="text" placeholder="选择结束日期" />
                                    <select class="i-select mr10 mb10">
                                        <option value="0">FREE</option>
                                        <option value="0">-10%</option>
                                    </select>
                                </div>
                            </section>
                            <button class="i-button i-b-w mr10" type="button">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td>商品促销</td>
                        <td colspan="2">
                            <section class="dlb">
                                <div class="mb10">
                                    <input class="i-input mr10" type="text" />
                                    <input class="i-input mr10" type="text" />
                                    <input class="i-input mr10 i-max-width" type="text" />
                                </div>
                            </section>
                            <button class="i-button i-b-w mr10" type="button">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td>商品所在地区</td>
                        <td>
                            <select class="i-select i-w-short i-mr10">
                                <option value="0">巴厘岛</option>
                                <option value="1">英国</option>
                            </select>
                            <select class="i-select i-w-short">
                                <option value="0">乌鲁瓦图</option>
                                <option value="1">爱尔兰</option>
                            </select>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>定金比例</td>
                        <td>
                            <select class="i-select i-w-short">
                                <option value="0">选择定金比例</option>
                                <option value="1">10%</option>
                            </select>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商家名称</td>
                        <td>
                            <span class="dlb i-w-short vat i-mr10">巴厘岛宝格丽度假酒店</span>
                            <span class="dlb i-w-short">
                                <button class="i-button i-b-mw" type="button">查看</button>
                            </span>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商家名称</td>
                        <td class="c">
                            <select class="i-select i-w-short vat i-mr10 fl">
                                <option value="0">这个酒店A</option>
                                <option value="1">那个酒店B</option>
                            </select>
                            <span class="dlb i-w-short fl ml5">
                                <button class="i-button i-w-short fl" type="button">查看</button>
                                <button class="i-button i-w-short fr" type="button">添加</button>
                            </span>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商品属性</td>
                        <td class="goods-attr">
                            <div class="mb10">
                                <span>场地类型：</span>
                                <span>水上婚礼</span>
                            </div>
                            <div class="mb10">
                                <span>最大人数：</span>
                                <span>30</span>
                            </div>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商品属性</td>
                        <td class="goods-attr">
                            <div class="mb10">
                                <span class="vat">场地类型：</span>
                                <select class="i-select i-w-short">
                                    <option value="0">水上婚礼</option>
                                    <option value="0">沙滩婚礼</option>
                                </select>
                            </div>
                            <div class="mb10">
                                <span class="vat">最大人数：</span>
                                <input class="i-input i-w-short" type="text" value="30" />
                            </div>
                            <div class="mb10">
                                <span class="vat">最大人数：</span>
                                <section class="check-wrap dlb">
                                    <label class="mr10"><input type="checkbox" />水上婚礼</label>
                                    <label class="mr10"><input type="checkbox" />水上婚礼</label>
                                    <label class="mr10"><input type="checkbox" />水上婚礼</label>
                                    <label class="mr10"><input type="checkbox" />水上婚礼</label>
                                    <label class="mr10"><input type="checkbox" />水上婚礼</label>
                                    <label class="mr10"><input type="checkbox" />水上婚礼</label>
                                    <label class="mr10"><input type="checkbox" />水上婚礼</label>
                                    <label><input type="checkbox" />悬崖婚礼</label>
                                </section>
                            </div>
                            <div class="mb10">
                                <span class="vat">&ensp;</span>
                                <button class="i-button i-b-mw" type="button">新增属性</button>
                            </div>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商品描述</td>
                        <td>
                            <div class="i-w-long">中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍</div>
                        </td>
                        <td>
                            <div class="i-w-long">english english english english english english english english english english english english english english english english english</div>
                        </td>
                    </tr>
                    <tr>
                        <td>商品描述</td>
                        <td>
                            <textarea class="i-textarea i-w-long">中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍中文介绍</textarea>
                        </td>
                        <td>
                            <textarea class="i-textarea i-w-long">english english english english english english english english english english english english english english english english english</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>&ensp;</td>
                        <td>
                            <button class="i-b-mw i-button mr30" type="button">保存</button>
                            <button class="i-b-mw i-button" type="button">取消</button>
                        </td>
                        <td>&ensp;</td>
                    </tr>
                    <tr>
                        <td>商品所在地区</td>
                        <td colspan="2">1.预订本产品需支付总价款的50%作为定金，用于锁定婚礼日期。<br />
                        2.本产品基价为美元计算，为避免汇率波动造成的影响，请在订单确认后的48小时内完成定金支付。<br />
                        3.本产品余款需在婚礼日期30天前完成支付。<br />
                        4.预订后的任何变更可能会造成相应罚金或导致婚礼日期不可用，请在预订前仔细阅览产品变更政策。<br />
                        5.预定后如需增加服务项目，请尽早与我们的客服人员取得联系。</td>
                    </tr>
                    <tr>
                        <td>大图<br />900x400</td>
                        <td colspan="2">
                            <figure>
                                <img src="img/wdf_wx.png" alt="大图" />
                            </figure>
                        </td>
                    </tr>
                    <tr>
                        <td>缩略图<br />200x150</td>
                        <td colspan="2">
                            <figure>
                                <img src="img/wdf_wx.png" alt="大图" />
                            </figure>
                        </td>
                    </tr>
                    <tr>
                        <td>详情图<br />600x400</td>
                        <td colspan="2">
                            <figure>
                                <img src="img/wdf_wx.png" alt="大图" />
                            </figure>
                            <figure>
                                <img src="img/wdf_wx.png" alt="大图" />
                            </figure>
                            <figure>
                                <img src="img/wdf_wx.png" alt="大图" />
                            </figure>
                            <figure>
                                <img src="img/wdf_wx.png" alt="大图" />
                            </figure>
                            <figure>
                                <img src="img/wdf_wx.png" alt="大图" />
                            </figure>
                            <figure>
                                <img src="img/wdf_wx.png" alt="大图" />
                            </figure>
                            <span class="add-img"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- 产品操作 -->
            <div class="con-operation tac pt20 mb30">
                <button class="i-button i-b-mw">删除</button>
                <button class="i-button i-b-mw">预览</button>
                <button class="i-button i-b-mw">发布</button>
            </div>
        </section>
    </main>
    <!-- 页脚 -->
    <footer></footer>
    <!-- mask -->
    <div id="mask">
        <style>
            #mask {
                display: block;
            }
        </style>
        <div class="m-add-category m-add-box r4 bcf bc">
            <label class="db mb10">
                <span>品类名称</span>
                <input name="email" class="save-item i-input" type="text" />
            </label>
            <label class="db mb10">
                <span>&emsp;</span>
                <span class="i-error">&emsp;</span>
            </label>
            <div class="db mb10">
                <span>&emsp;</span>
                <div class="dlb">
                    <button class="save-category i-button i-b-mw mr20" type="bubtton">保存</button>
                    <button class="close-mask i-button i-b-mw" type="bubtton">关闭</button>
                </div>
            </div>
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
