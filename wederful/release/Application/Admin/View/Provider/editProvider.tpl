<extend name="Public/base" />
<block name="title">服务商编辑 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            qiniuUploadTokenUrl:'{:U("Product/qiniuUploadToken")}',
            uploadUrl:'{:U("Index/uploadImg")}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_provider">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Provider/index/')}">服务商管理</a>
            <a href="{:U('Provider/editProvider/')}">服务商编辑</a>
        </nav>
    </div>
    <!-- ************************************ -->
    <div id="addDom" class="none">
        <div>
            <input class="i-input mb10" type="text" placeholder="姓名" name="contacts[]" />
            <input class="i-input ml10 mr10" type="text" placeholder="电话" name="mobile[]" />
            <input class="i-input mr10 mb10" type="text" placeholder="邮箱" name="email[]" />
            <button type="button" class="del-temp-dom i-button i-b-w mb10 mr10">删除</button>
        </div>
    </div>
    <!-- ************************************ -->
    <form class="package-form" action="{:U('Provider/editProviderMethod')}" method="POST">
        <input type="hidden" value="{$vendorsid}" name="id" />
        <table class="con-show w1">
            <tbody>
                <tr>
                    <td>服务商名称</td>
                    <td colspan="2">
                        <input class="i-input  i-w-short i-mr10" type="text" placeholder="中文名" name="name" value="{$vendorData.name}"/>
                        <input class="i-input i-w-short " type="text" placeholder="英文名" name="name_en" value="{$vendorData.name_en}"/>
                    </td>
                </tr>
                <tr>
                    <td>合约到期日</td>
                    <td>
                        <input class="input-date i-input mr10" name="contract_expires" type="text" placeholder="选择日期" value="{$vendorData.contract_expires|substr=0,10}"/>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>服务商LOGO</td>
                    <td colspan="2">

                        <if condition="$vendorData.icon neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$vendorData.icon}">
                                <input type="hidden" value="{$vendorData.icon}" name="icon" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="icon" style="display:none"></span>
                        <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="icon"></span>
                        </if>
                    </td>

                </tr>
                <tr>
                    <td>服务类型</td>
                    <td colspan="2">
                        <!-- <volist name="attr.value" id="v"><if condition="$v eq $op['id']">checked="checked"</if></volist> -->
                        <volist name="categorys" id="category">
                            <label class="dlb mr20"><input class="mr5" <volist name="relationData" id="relat"><if condition="$category['id'] eq $relat['category_id']">checked="checked"</if></volist> type="checkbox" value="{$category.id}" name="product_category_id[]" />{$category.name}</label>
                        </volist>
                    </td>
                </tr>
                <tr>
                    <td>服务商地址</td>
                    <td><input class="i-input i-w-long" type="text" placeholder="服务商地址" name="address" value="{$vendorData.address}"/></td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>服务商联系人</td>
                    <td colspan="2">
                        <section>
                            <volist name="contactData" id="contact">
                                <div>
                                    <input class="i-input mb10" type="text" placeholder="姓名" name="contacts[]" value="{$contact.contacts}"/>
                                    <input class="i-input ml10 mr10" type="text" placeholder="电话" name="mobile[]" value="{$contact.mobile}"/>
                                    <input class="i-input mr10 mb10" type="text" placeholder="邮箱" name="email[]" value="{$contact.email}"/>
                                    <button type="button" class="del-temp-dom i-button i-b-w mb10 mr10">删除</button>
                                </div>
                            </volist>
                        </section>
                        <button type="button" class="provider-add-dom i-button i-b-mw">添加</button>
                    </td>
                </tr>
                <tr>
                    <td>其他信息</td>
                    <td colspan="2">
                        <textarea class="edit-dom i-textarea i-w-long" name="other">{$vendorData.other}</textarea>
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
    <!-- 日期选择 -->
    <link href="__PUBLIC__/Admin/css/inputdate.css" rel="stylesheet" />
    <script src="__PUBLIC__/Admin/js/inputdate.js"></script>
    <!-- this -->
    <script src="__PUBLIC__/Admin/js/provider.js"></script>
</block>