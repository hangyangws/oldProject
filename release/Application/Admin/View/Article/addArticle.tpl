<extend name="Public/base" />
<block name="title">文章添加 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            qiniuUploadTokenUrl:'{:U("Product/qiniuUploadToken")}',
            uploadUrl:'{:U("Index/uploadImg")}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_content">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Article/index/')}">内容管理</a>
            <a href="{:U('Article/addArticle/')}">文章添加</a>
        </nav>
    </div>
    <form action="{:U('Article/addArticleMethod/')}" method="POST">
        <table class="con-show w1">
            <tbody>
                <tr>
                    <td>内容板块</td>
                    <td>
                        <select class="i-select i-w-long" name="category_id">
                            <option value="null">选择板块</option>
                            <volist name="categorys" id="category">
                                <option value="{$category.id}">{$category.name}</option>
                            </volist>
                        </select>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>文章关键字</td>
                    <td><input class="i-input i-w-long" name="keywords" type="text" placeholder="文章关键字，用于搜索引擎" /></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>文章描述</td>
                    <td><input class="i-input i-w-long" name="description" type="text" placeholder="文章描述，用于搜索引擎" /></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>文章标题</td>
                    <td><input class="i-input i-w-long" name="title" type="text" placeholder="标题(最多16个字符)" /></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>文章副标题</td>
                    <td><input class="i-input i-w-long" name="subtitle" type="text" placeholder="副标题(最多46个字符)" /></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>文章作者</td>
                    <td>
                        <select class="i-select i-w-short i-mr10" name="source">
                            <option value="null">选择作者/转载</option>
                            <option value="1">作者</option>
                            <option value="2">转载</option>
                        </select>
                        <input class="i-input i-w-short" name="author" type="text" placeholder="作者/转载" />
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>文章大图</td>
                    <td colspan="2">
                        <span class="add-img" data-rule="random" data-num="1" data-name="bigpic"></span>
                    </td>
                </tr>
                <tr>
                    <td>TAG</td>
                    <td colspan="2">
                        <volist name="articleTags" id="tag">
                            <label class="dlb mr20"><input class="mr5" type="checkbox" value="{$tag.id}" name="tagName[]" />{$tag.name}</label>
                        </volist>
                    </td>
                </tr>
                <tr>
                    <td>正文内容</td>
                    <td colspan="2">
                        <textarea class="edit-dom i-textarea i-w-long" name="content"></textarea>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="con-operation tac pt20 mb30">
            <button class="i-button i-b-mw">保存</button>
        </div>
    </form>
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
    <script src="__PUBLIC__/Admin/js/article.js"></script>
</block>