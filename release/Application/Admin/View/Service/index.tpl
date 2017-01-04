<extend name="Public/base" />
<block name="title">服务项管理 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            localUrl:'{:U("Service/index")}', // 页面基本地址
            keywords:'{$keywords}', // 当前搜索关键字
            categoryid:'{$categoryid}', // 当前商品类型
            vendorid:'{$vendorid}', // 当前服务商
            isShowUrl:'{:U("Service/isShow")}',
            delProductUrl:'{:U("Service/delProduct")}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_service">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm h30 p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Service/index/')}">服务项管理</a>
        </nav>
        <div class="fr c">
            <!-- 第一个不需要 class ml20 -->
            <label class="nav-search fl">
                <input class="search-list i-input i-b1m fl" type="text" />
                <button class="service-search-btn i-button fl" type="botton">搜索</button>
            </label>
            <a href="{:U('Service/addServiceOne/')}" class="i-button i-b-mw fl ml20">新增服务项</a>
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
        <select class="provider-type i-select fl mr10" name="vendorid">
            <option value="null">选择服务商</option>
            <volist name="vendorsArr" id="vendors">
                <option value="{$vendors.id}">{$vendors.name}</option>
            </volist>
        </select>
    </div>
    <!-- 结果展示区域 table -->
    <table class="i-table mb20 w1">
        <thead>
            <tr>
                <th>商品类型</th>
                <th>服务商</th>
                <th>服务项</th>
                <th>商品数</th>
                <th>访问数</th>
                <th>上传者</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
          <volist name="result" id="re">
            <tr data-id="{$re.id}" data-name="{$re.name}">
                <td>{$re.categoryName}</td>
                <td>{$re.vendorName}</td>
                <td>{$re.name}</td>
                <td>{$re.packageCount}</td>
                <td>{$re.visit_num}</td>
                <td><ExtendsTags:getusername uid="re.uid"/></td>
                <td>
                    <a class="service-del dlb cp mr20">删除</a>
                    <a href="{:U('Service/editServiceOne/')}/pid/{$re.id}" class="dlb cp">编辑</a>
                    <!-- <a class="service-publish dlb cp"><if condition="$re.is_show eq '1'">取消发布<else />发布</if></a> -->
                </td>
            </tr>
          </volist>
        </tbody>
    </table>
    <!-- 分页 paging -->
    <section class="paging">
        <dl class="dlb mr20">
            <dt class="dlb">服务项数：</dt>
            <dd class="dlb">{$totalSize}</dd>
        </dl>
        {$page}
    </section>
</block>

<block name="script">
    <!-- 富文本 -->
    <link rel="stylesheet" href="__PUBLIC__/Admin/css/simditor.css" />
    <script src="__PUBLIC__/Admin/js/module.min.js"></script>
    <script src="__PUBLIC__/Admin/js/uploader.min.js"></script>
    <script src="__PUBLIC__/Admin/js/hotkeys.min.js"></script>
    <script src="__PUBLIC__/Admin/js/simditor.min.js"></script>
    <!-- 七牛图片上传 -->
    <script src="__PUBLIC__/Admin/js/plupload.min.js" ></script>
    <script src="__PUBLIC__/Admin/js/qiniu.min.js" ></script>
    <!-- this -->
    <script src="__PUBLIC__/Admin/js/service.js"></script>
</block>
