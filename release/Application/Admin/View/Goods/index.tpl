<extend name="Public/base" />

<block name="title">商品管理 - wederful后台管理系统</block>

<block name="global">
    <script>
        var global = {
            area: '{$areaid}', // 当前地区
            localUrl: '{:U("Goods/index")}', // 页面基本地址
            categoryid: '{$categoryid}', // 当前类型
            keywords: '{$keywords}', // 当前搜索关键字
            isShowUrl: '{:U("Goods/showGoods")}',
            delGoodsUrl: '{:U("Goods/delGoods")}',
            vendorid: '{$vendorid}', // 当前商家id
            order: '{$order}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_goods">
</block>

<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm h30 p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Index/goodsManage/')}">商品管理</a>
        </nav>
        <div class="fr c">
            <!-- 第一个不需要 class ml20 -->
            <label class="nav-search fl">
                <input class="search-list goods-search-ipt i-input i-b1m fl" type="text" />
                <button class="goods-search-btn i-button fl" type="botton">搜索</button>
            </label>
            <a href="{:U('Goods/addGoods/')}" class="i-button i-b-mw fl ml20">新增商品</a>
        </div>
    </div>
    <!-- 搜索区域 select 集 -->
    <div class="mb20 c">
        <select class="category-type-list i-select fl mr10" name="categoryid">
            <option value="null">选择商品大类</option>
            <volist name="categorys" id="category">
                <option value="{$category.id}">{$category.name}</option>
            </volist>
        </select>
        <select class="provider-type-list i-select fl mr10" name="vendorid">
            <option value="null">选择服务商</option>
            <volist name="vendorsArr" id="vendors">
                <option value="{$vendors.id}">{$vendors.name}</option>
            </volist>
        </select>
        <select class="area-type-list i-select fl" name="area">
            <option value="null">选择地区</option>
            <volist name="destinations" id="destination">
                <option value="{$destination.id}">{$destination.name}</option>
            </volist>
        </select>
    </div>
    <!-- 结果展示区域 table -->
    <table class="i-table mb20 w1">
        <thead>
            <tr>
                <th>商品编号</th>
                <th>商品类型</th>
                <th>服务商</th>
                <th>服务项</th>
                <th>商品名称</th>
                <th>所在地</th>
                <th class="order cp"><b class="dlb vat">↕</b> 价格</th>
                <!-- <th>访问数</th> -->
                <th>收藏数</th>
                <th>购买数</th>
                <!-- <th>创建时间</th> -->
                <th>创建人</th>
                <!-- <th>促销</th> -->
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <volist name="packageData" id="data">
                <tr data-name="{$data.proname}" data-id="{$data.id}">
                    <td>{$data.goods_no}</td>
                    <td>{$data.categoryname}</td>
                    <td>{$data.vendorname}</td>
                    <td>{$data.proname}</td>
                    <td class="goods-name">{$data.name}</td>
                    <!--自定义标签-->
                    <td><ExtendsTags:getregion destination="data.area_id"/></td>
                    <td><notempty name="data.price">${$data.price}<else />0</notempty></td>
                    <!-- <td>{$data.visit_num}</td> -->
                    <td>0</td>
                    <td>0</td>
                    <!-- <td>{$data.createtime}</td> -->
                    <td><ExtendsTags:getusername uid="data.uid"/></td>
                    <!-- <td>{$data.product_no}</td> -->
                    <td>
                        <a class="dlb mr20" href="{:U('/Home/Service/serviceDetail')}/id/{$data.proid}/area/{$data.area_id}" target="_blank">查看</a>
                        <span class="goods-del dlb mr20 cp">删除</span>
                        <a class="dlb mr20" href="{:U('Goods/editGoods')}/id/{$data.id}" target="_blank">编辑</a>
                        <span class="goods-publish dlb cp" data-id="{$data.id}"><if condition="$data.is_show eq '1'">取消发布<else />发布</if></span>
                    </td>
                </tr>
            </volist>
        </tbody>
    </table>
    <!-- 分页 paging -->
    <section class="paging">
        <dl class="dlb mr20">
            <dt class="dlb">商品数：</dt>
            <dd class="dlb">{$totalSize}</dd>
        </dl>
        {$page}
    </section>
</block>

<block name="script">
    <!-- this -->
    <script src="__PUBLIC__/Admin/js/goods.js"></script>
</block>