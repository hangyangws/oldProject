<extend name="Public/base" />
<block name="title">服务商管理 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            localUrl: '{:U("Provider/index/")}',
            copyAreaUrl:'{:U("Provider/copyProvider")}',
            categoryid: '{$categoryid}',
            keywords: '{$keywords}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_provider">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm h30 p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Provider/index/')}">服务商管理</a>
        </nav>
        <div class="fr c">
            <!-- 第一个不需要 class ml20 -->
            <label class="nav-search fl">
                <input class="search-list i-input i-b1m fl" type="text" />
                <button class="provider-search-btn i-button fl" type="botton">搜索</button>
            </label>
            <a href="{:U('Provider/addProvider/')}" class="i-button i-b-mw fl ml20">新增服务商</a>
        </div>
    </div>
    <!-- 搜索区域 select 集 -->
    <div class="mb20 c">
        <select class="category-type i-select fl mr10" name="categoryid">
            <option value="null">选择商品大类</option>
            <volist name="categorys" id="category">
                <option value="{$category.id}">{$category.name}</option>
            </volist>
        </select>
        <!--<select class="i-select fl mr10">
            <option value="null">选择服务地区</option>
            <option value="1">巴厘岛</option>
        </select> -->
    </div>
    <!-- 结果展示区域 table -->
    <table class="i-table mb20 w1">
        <thead>
            <tr>
                <th>服务类型</th>
                <th>服务商</th>
                <th>合约到期日</th>
                <th>上传者</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <volist name="result" id="re">
                <tr data-name="{$re.name}" data-id="{$re.id}">
                    <td>{$re.category}</td>
                    <td>{$re.name}</td>
                    <td>{$re.contract_expires|substr=0,10}</td>
                    <td class="upname"><ExtendsTags:getusername uid="re.uid"/></td>
                    <td>
                       <a class="copy-provider dlb mr20 cp">复制</a>
                       <a class="edit-this dlb cp" href="{:U('Provider/editProvider/')}/id/{$re.id}">编辑</a>
                    </td>
                </tr>
            </volist>
        </tbody>
    </table>
    <!-- 分页 paging -->
    <section class="paging">
        <dl class="dlb mr20">
            <dt class="dlb">服务商数：</dt>
            <dd class="dlb">{$totalSize}</dd>
        </dl>
        {$page}
    </section>
</block>

<block name="script">
    <!-- this -->
    <script src="__PUBLIC__/Admin/js/provider.js"></script>
</block>