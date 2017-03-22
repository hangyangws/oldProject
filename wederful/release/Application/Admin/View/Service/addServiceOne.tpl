<extend name="Public/base" />
<block name="title">新增服务项 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            qiniuUploadTokenUrl:'{:U("Product/qiniuUploadToken")}',
            uploadUrl:'{:U("Index/uploadImg")}',
            getVendorsUrl:'{:U("Service/getVendors")}',
            getCategoryAttrUrl:'{:U("Product/getCategoryAttr")}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_service">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Service/index/')}">服务项管理</a>
            <a href="{:U('Service/addServiceOne/')}">新增服务项</a>
        </nav>
    </div>
    <form class="package-form" action='{:U("Service/addServiceOneMethod")}' method="POST">
        <table class="con-show w1">
            <tbody>
                <tr>
                    <td>商品大类</td>
                    <td>
                        <select class="category-type i-select i-w-long" name="category_id">
                            <option value="null">选择类型</option>
                            <volist name="categorys" id="category">
                                <option value="{$category.id}">{$category.name}</option>
                            </volist>
                        </select>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>服务商</td>
                    <td>
                        <select class="provider-sel i-select i-w-long" name="vendors_id">
                            <option value="null">选择服务商</option>
                            <volist name="vendors" id="vendors">
                                <option value="{$vendors.id}">{$vendors.name}</option>
                            </volist>
                            <!-- <option value="1">服务商</option> -->
                        </select>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>服务项名称</td>
                    <td>
                        <input class="i-input i-w-long" name="name" type="text" placeholder="中文名" />
                    </td>
                    <td>
                        <input class="i-input i-w-long" name="name_en" type="text" placeholder="英文名" />
                    </td>
                </tr>
                <tr>
                    <td>服务项属性</td>
                    <td colspan="2" class="goods-attr fs0">
                        <section class="category-wrap fs14">
                            请选择商品大类
                        </section>
                    </td>
                </tr>
                <tr>
                    <td>服务项关键字(搜索引擎优化)</td>
                    <td><input class="i-input i-w-long" name="seo_keywords" type="text" placeholder="文章关键字，用于搜索引擎" /></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>服务项描述(搜索引擎优化)</td>
                    <td><input class="i-input i-w-long" name="seo_description" type="text" placeholder="文章描述，用于搜索引擎" /></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>场地经纬度</td>
                    <td>
                        <input class="i-input i-w-long" name="longitude" type="text" placeholder="经度" />
                    </td>
                    <td>
                        <input class="i-input i-w-long" name="latitude" type="text" placeholder="纬度" />
                    </td>
                </tr>
                <tr>
                    <td>服务项描述</td>
                    <td>
                        <textarea class="edit-dom i-textarea i-w-long" placeholder="服务项中文描述" name="description"></textarea>
                    </td>
                    <td>
                        <textarea class="edit-dom i-textarea i-w-long" placeholder="服务项英文描述" name="description_en"></textarea>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="con-operation tac pt20 mb30">
            <button class="i-button i-b-mw">保存/下一步</button>
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
    <script src="__PUBLIC__/Admin/js/service.js"></script>
</block>