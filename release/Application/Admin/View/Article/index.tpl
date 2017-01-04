<extend name="Public/base" />
<block name="title">内容管理 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            localUrl: '{:U("Article/index/")}', // 页面基本地址
            articleIsShowUrl: '{:U("Article/articleIsShow")}', // 文章发布url
            delArticleUrl: '{:U("Article/delArticle")}', // 文章删除url
            articleIsTopUrl: '{:U("Article/articleIsTop")}', // 文章置顶url
            keywords: '{$search}', // 当前搜索关键字
            categoryid: '{$categoryid}', // 当前文章内容板块
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_content">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm h30 p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Article/index/')}">内容管理</a>
        </nav>
        <div class="fr c">
            <!-- 第一个不需要 class ml20 -->
            <label class="nav-search fl">
                <input class="search-list i-input i-b1m fl" type="text" />
                <button class="art-search-btn i-button fl" type="botton">搜索</button>
            </label>
            <a href="{:U('Article/addArticle/')}" class="i-button i-b-mw fl ml20">新增文章</a>
        </div>
    </div>
    <!-- 搜索区域 select 集 -->
    <div class="mb20 c">
        <select class="art-type i-select fl mr10" name="categoryid">
            <option value="null">选择内容板块</option>
            <volist name="categorys" id="category">
                <option value="{$category.id}">{$category.name}</option>
            </volist>
        </select>
    </div>
    <!-- 结果展示区域 table -->
    <table class="i-table mb20 w1">
        <thead>
            <tr>
                <th>内容板块</th>
                <th>文章名</th>
                <th>上传时间</th>
                <th>阅读数</th>
                <th>点赞数</th>
                <th>上传者</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <volist name="result" id="re">
                <tr data-id="{$re.id}" data-name="{$re.categoryName} : {$re.title}">
                    <td>{$re.categoryName}</td>
                    <td>{$re.title}</td>
                    <td>{$re.createtime}</td>
                    <td>{$re.visit_num}</td>
                    <td>{$re.praise_num}</td>
                    <td><ExtendsTags:getusername uid="re.uid"/></td>
                    <td>
                        <a href="{:U('Home/Article/articleDetail')}/id/{$re.id}" class="dlb mr20 cp" target="_blank">查看</a>
                        <a class="art-del dlb mr20 cp">删除</a>
                        <a class="dlb mr20 cp" href="{:U('Article/editArticle/')}/id/{$re.id}">编辑</a>
                        <a class="art-publish dlb mr20 cp"><if condition="$re.is_show eq '1'">取消发布<else />发布</if></a>
                        <a class="art-top dlb cp"><if condition="$re.is_top eq '1'">取消置顶<else />置顶</if></a>
                    </td>
                </tr>
            </volist>
        </tbody>
    </table>
    <!-- 分页 paging -->
    <section class="paging">
        <dl class="dlb mr20">
            <dt class="dlb">文章数：</dt>
            <dd class="dlb">{$totalSize}</dd>
        </dl>
        {$page}
    </section>
</block>

<block name="script">
    <script src="__PUBLIC__/Admin/js/article.js"></script>
</block>
