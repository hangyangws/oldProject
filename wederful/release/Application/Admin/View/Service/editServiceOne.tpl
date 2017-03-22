<extend name="Public/base" />
<block name="title">编辑服务项 - wederful后台管理系统</block>
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
            <a href="{:U('Service/addServiceOne/')}">编辑服务项</a>
        </nav>
    </div>
    <form class="package-form" action='{:U("Service/editServiceOneMethod")}' method="POST">
        <input name="pid" type="hidden" value='{$pid}'/>
        <table class="con-show w1">
            <tbody>
                <tr>
                    <td>商品大类</td>
                    <td>
                        <select class="category-type i-select i-w-long" name="category_id">
                            <option value="null">选择类型</option>
                            <volist name="categorys" id="category">
                                <if condition="$category.id eq $categoryId">
                                    <option value="{$category.id}" selected="selected">{$category.name}</option>
                                <else />
                                    <option value="{$category.id}">{$category.name}</option>
                                </if>
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
                             <volist name="vendorsArr" id="vendor">
                                <if condition="$vendor.id eq $vendorId">
                                    <option value="{$vendor.id}" selected="selected">{$vendor.name}</option>
                                <else />
                                    <option value="{$vendor.id}">{$vendor.name}</option>
                                </if>
                            </volist>
                        </select>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>服务项名称</td>
                    <td>
                        <input class="i-input i-w-long" name="name" type="text" placeholder="中文名" value="{$proData.name}"/>
                    </td>
                    <td>
                        <input class="i-input i-w-long" name="name_en" type="text" placeholder="英文名" value="{$proData.name_en}"/>
                    </td>
                </tr>
                <tr>
                    <td>服务项属性</td>
                    <td colspan="2" class="goods-attr fs0">
                        <section class="category-wrap fs14">
                            <volist name="attrData" id="attr">
                                <div class="mb10 c">
                                    <span class="vat fl">{$attr.name}：</span>
                                    <if condition="$attr.type eq 'textarea'">
                                        <textarea class="i-textarea i-w-short bb" name="attr[{$attr.id}]">{$attr.value}</textarea>
                                    <elseif condition="$attr.type eq 'input'"/>
                                        <input type="text" class="i-input i-w-short" name="attr[{$attr.id}]" value="{$attr.value}">
                                    <elseif condition="$attr.type eq 'radio'"/>
                                        <div style="width: 80%; float: left">
                                        <volist name="attr.options" id="op">
                                            <label class="dlb mr20">
                                            <if condition="$attr.value eq $op['id']">
                                                <input type="radio" checked="checked" value="{$op.id}" class="mr5" name="attr[{$attr.id}]">{$op.option}</label>
                                                <else />
                                                <input type="radio" value="{$op.id}" class="mr5" name="attr[{$attr.id}]">{$op.option}</label>
                                            </if>
                                        </volist>
                                        </div>
                                    <elseif condition="$attr.type eq 'checkbox'"/>
                                        <div style="width: 80%; float: left">
                                        <volist name="attr.options" id="op">
                                            <label class="dlb mr20">
                                                <input type="checkbox" <volist name="attr.value" id="v"><if condition="$v eq $op['id']">checked="checked"</if></volist> value="{$op.id}" class="mr5" name="attr[{$attr.id}][]">
                                                {$op.option}
                                            </label>
                                        </volist>
                                        </div>
                                    <elseif condition="$attr.type eq 'select'"/>
                                        <select class="i-select i-w-short" name="attr[{$attr.id}]">
                                            <volist name="attr.options" id="op">
                                                <if condition="$attr.value eq $op['id']">
                                                    <option value="{$op.id}" selected="selected">{$op.option}</option>
                                                <else />
                                                    <option value="{$op.id}">{$op.option}</option>
                                                </if>
                                            </volist>
                                        </select>
                                    </if>
                                </div>
                            </volist>
                        </section>
                    </td>
                </tr>
                <tr>
                    <td>服务项关键字(搜索引擎优化)</td>
                    <td><input class="i-input i-w-long" name="seo_keywords" type="text" placeholder="文章关键字，用于搜索引擎" value="{$proData.seo_keywords}"/></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>服务项描述(搜索引擎优化)</td>
                    <td><input class="i-input i-w-long" name="seo_description" type="text" placeholder="文章描述，用于搜索引擎" value="{$proData.seo_description}"/></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>场地经纬度</td>
                    <td>
                        <input class="i-input i-w-long" name="longitude" type="text" placeholder="经度" value="{$proData.longitude}"/>
                    </td>
                    <td>
                        <input class="i-input i-w-long" name="latitude" type="text" placeholder="纬度" value="{$proData.latitude}"/>
                    </td>
                </tr>
                <tr>
                    <td>服务项描述</td>
                    <td>
                        <textarea class="edit-dom i-textarea i-w-long" placeholder="服务项中文描述" name="description">
                            {$proData.description}
                        </textarea>
                    </td>
                    <td>
                        <textarea class="edit-dom i-textarea i-w-long" placeholder="服务项英文描述" name="description_en">
                            {$proData.description_en}
                        </textarea>
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