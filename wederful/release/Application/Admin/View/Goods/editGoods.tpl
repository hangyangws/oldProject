<extend name="Public/base" />
<block name="title">新增服务项 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            qiniuUploadTokenUrl:'{:U("Product/qiniuUploadToken")}',
            uploadUrl:'{:U("Index/uploadImg")}',
            getVendorsUrl:'{:U("Goods/getVendors")}',
            getServicesUrl:'{:U("Goods/getServices")}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_goods">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Goods/index/')}">商品管理</a>
            <a class="cd">编辑商品</a>
        </nav>
    </div>
    <!-- ************************************ -->
    <div id="unDayDom" class="none">
        <div class="mb10">
            <input name="no_provide_date_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" />
            到&ensp;
            <input name="no_provide_date_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" />
            <button type="button" class="del-temp-dom i-button i-b-w mr10">删除</button>
        </div>
    </div>
    <div id="dayPriceDom" class="none">
        <div>
            <input name="package_date_price_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" />
            到&ensp;
            <input name="package_date_price_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" />
            <input name="package_date_price[]" class="i-input i-max-width mr10 mb10" type="text" placeholder="价格" />
            <button type="button" class="del-temp-dom i-button i-b-w mr10 mb5">删除</button>
        </div>
    </div>
    <div id="goodsPromotDom" class="none">
        <div>
            <input name="package_promotion_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" />
            到&ensp;
            <input name="package_promotion_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" />
            <select class="i-select mr10 mb10" name="promotion[]">
                <volist name="promotionData" id="promotion">
                    <option value="{$promotion.id}">{$promotion.value}</option>
                </volist>
            </select>
            <button type="button" class="del-temp-dom i-button i-b-w mr10 mb5">删除</button>
        </div>
    </div>

    <div id="exPriceDom" class="none">
        <div class="mb10">
            <input name="add_value_name[]" class="i-input mr10 mb5" type="text" placeholder="增值服务中文" />
            <input name="add_value_name_en[]" class="i-input mr10" type="text" placeholder="增值服务英文" />
            <input name="add_value_price[]" class="i-input mr30 i-max-width" type="text" placeholder="价格" />
            <input class="i-input i-max-width" type="number" data-name="min_num[]" name="min_num[]" placeholder="最少" />
            &ensp;-&ensp;
            <input class="i-input i-max-width mr10" type="number" data-name="max_num[]" name="max_num[]" placeholder="最多" />
            <button type="button" class="del-temp-dom i-button i-b-w mr10">删除</button>
        </div>
    </div>
    <!-- ************************************ -->
    <form class="package-form" action="{:U('Goods/editGoodsMethod')}" method="POST" autocomplete="off">
        <input type="hidden" name="packageid" value="{$packgeid}">
        <table class="con-show w1">
            <tbody>
                <tr>
                    <td>商品大类</td>
                    <td>
                        <select data-type="category" class="category-type i-select i-w-long" name="categoryid">
                            <option value="null">选择类型</option>
                            <volist name="categorys" id="category">
                                <if condition="$category.id eq $proData['category_id']">
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
                        <select class="provider-type i-select i-w-long">
                            <option value="null">选择服务商</option>
                            <volist name="vendors" id="vendor">
                                <if condition="$vendor.id eq $proData['vendors_id']">
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
                    <td>服务项</td>
                    <td>
                        <select class="service-type i-select i-w-long" name="product_id">
                            <option value="null">选择服务项</option>
                            <volist name="services" id="service" >
                                <if condition="$service.id eq $packData['product_id']">
                                    <option value="{$service.id}" selected="selected">{$service.name}</option>
                                <else />
                                    <option value="{$service.id}">{$service.name}</option>
                                </if>
                            </volist>
                        </select>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>服务地区</td>
                    <td>
                        <select class="area-type i-select i-w-long" name="area_id">
                            <option value="null">选择地区</option>
                            <volist name="destinations" id="destination">

                                <if condition="$destination.id eq $packData['area_id']">
                                    <option value="{$destination.id}" selected="selected">{$destination.name}</option>
                                <else />
                                    <option value="{$destination.id}">{$destination.name}</option>
                                </if>
                            </volist>
                        </select>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>套餐编号</td>
                    <td>
                        <select class="i-select i-w-long" name="package_no">
                            <option value="1" <if condition="'1' eq $packData['package_no']">selected="selected"</if>>套餐A</option>
                            <option value="2" <if condition="'2' eq $packData['package_no']">selected="selected"</if>>套餐B</option>
                            <option value="3" <if condition="'3' eq $packData['package_no']">selected="selected"</if>>套餐C</option>
                            <option value="4" <if condition="'4' eq $packData['package_no']">selected="selected"</if>>套餐D</option>
                            <option value="5" <if condition="'5' eq $packData['package_no']">selected="selected"</if>>套餐E</option>
                            <option value="6" <if condition="'6' eq $packData['package_no']">selected="selected"</if>>套餐F</option>
                            <option value="7" <if condition="'7' eq $packData['package_no']">selected="selected"</if>>套餐G</option>
                            <option value="8" <if condition="'8' eq $packData['package_no']">selected="selected"</if>>套餐H</option>
                            <option value="9" <if condition="'9' eq $packData['package_no']">selected="selected"</if>>套餐I</option>
                            <option value="10" <if condition="'10' eq $packData['package_no']">selected="selected"</if>>套餐J</option>
                        </select>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>基本价格</td>
                    <td>
                        <input class="i-input i-w-long" name="price" type="number" placeholder="基本价格" value="{$packData['price']}"/>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <tr>
                    <td>商品名称</td>
                    <td>
                        <input class="i-input i-w-long" name="name" type="text" placeholder="中文名" value="{$packData['name']}"/>
                    </td>
                    <td>
                        <input class="i-input i-w-long" name="name_en" type="text" placeholder="英文名" value="{$packData['name_en']}"/>
                    </td>
                </tr>
                <tr>
                    <td>不可提供日期</td>
                    <td colspan="2" class="fs0">
                        <section class="dlb fs14">
                            <notempty name="noProvideData">
                                <volist name="noProvideData" id="provide">
                                    <div class="mb10">
                                        <input name="no_provide_date_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" value="{$provide.startdate|substr=0,10}" />
                                        到&ensp;
                                        <input name="no_provide_date_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" value="{$provide.enddate|substr=0,10}" />
                                        <button type="button" class="del-temp-dom i-button i-b-w mr10">删除</button>
                                    </div>
                                </volist>
                            <else />
                                <div class="mb10">
                                    <input name="no_provide_date_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" />
                                    到&ensp;
                                    <input name="no_provide_date_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" />
                                    <button type="button" class="del-temp-dom i-button i-b-w mr10">删除</button>
                                </div>
                            </notempty>
                        </section>
                        <button data-type="restart"  data-html="unDayDom" class="add-dom i-button i-b-w fs14 mr10" type="button">+</button>
                    </td>
                </tr>
                <tr>
                    <td>日期/价格</td>
                    <td colspan="2" class="fs0">
                        <section class="dlb fs14">
                            <notempty name="datePriceData">
                                <volist name="datePriceData" id="priceData">
                                    <div>
                                        <input name="package_date_price_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" value="{$priceData.startdate|substr=0,10}"/>
                                        到&ensp;
                                        <input name="package_date_price_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" value="{$priceData.enddate|substr=0,10}"/>
                                        <input name="package_date_price[]" class="i-input i-max-width mr10 mb10" type="text" placeholder="价格" value="{$priceData.price}"/>
                                        <button type="button" class="del-temp-dom i-button i-b-w mr10 mb5">删除</button>
                                    </div>
                                </volist>
                            <else />
                                <div>
                                    <input name="package_date_price_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" />
                                    到&ensp;
                                    <input name="package_date_price_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" />
                                    <input name="package_date_price[]" class="i-input i-max-width mr10 mb10" type="text" placeholder="价格" />
                                    <button type="button" class="del-temp-dom i-button i-b-w mr10 mb5">删除</button>
                                </div>
                            </notempty>
                        </section>
                        <button data-type="restart" data-html="dayPriceDom" class="add-dom i-button fs14 i-b-w mr10" type="button">+</button>
                    </td>
                </tr>
                <tr>
                    <td>商品促销</td>
                    <td colspan="2" class="fs0">
                        <section class="dlb fs14">
                            <notempty name="promotionDateData">
                                <volist name="promotionDateData" id="promotionDa">
                                    <div>
                                        <input name="package_promotion_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" value="{$promotionDa.startdate|substr=0,10}"/>
                                        到&ensp;
                                        <input name="package_promotion_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" value="{$promotionDa.enddate|substr=0,10}"/>
                                        <select class="i-select mr10 mb10" name="promotion[]">
                                            <volist name="promotionData" id="promotion">
                                                <option value="{$promotion.id}" <if condition="$promotion.id eq $promotionDa['promotion_id']">selected="selected"</if>>{$promotion.value}</option>
                                            </volist>
                                        </select>
                                        <button type="button" class="del-temp-dom i-button i-b-w mr10 mb5">删除</button>
                                    </div>
                                </volist>
                            <else />
                                <!-- 王总要求默认不需要 -->
                                <!-- <div>
                                    <input name="package_promotion_startdate[]" class="input-date i-input mr10 mb10" type="text" placeholder="选择开始日期" />
                                    到&ensp;
                                    <input name="package_promotion_enddate[]" class="input-date i-input mr10" type="text" placeholder="选择结束日期" />
                                    <select class="i-select mr10 mb10" name="promotion[]">
                                        <volist name="promotionData" id="promotion">
                                            <option value="{$promotion.id}">{$promotion.value}</option>
                                        </volist>
                                    </select>
                                    <button type="button" class="del-temp-dom i-button i-b-w mr10 mb5">删除</button>
                                </div> -->
                            </notempty>
                        </section>
                        <button data-type="restart" data-html="goodsPromotDom" class="add-dom i-button i-b-w mr10 fs14" type="button">+</button>
                    </td>
                </tr>
                <tr class="site-only">
                    <td>人数范围</td>
                    <td colspan="2">
                        <input class="i-input i-max-width mr10" type="number" data-name="number_range_min" name="number_range_min" placeholder="最少" value="{$packData['number_range_min']}"/>
                        -
                        <input class="i-input i-max-width ml10 mr10" type="number" data-name="number_range_max" name="number_range_max" placeholder="最多" value="{$packData['number_range_max']}"/>
                    </td>
                </tr>
                <tr class="site-only">
                    <td>超出人数</td>
                    <td colspan="2">
                        <input class="i-input i-max-width mr10" type="text" data-name="out_charge" name="out_charge" placeholder="价格" value="{$packData['out_charge']}"/>
                        $&ensp;/&ensp;人
                    </td>
                </tr>
                <tr>
                    <td>套餐内容</td>
                    <td>
                        <textarea name="content" class="edit-dom i-textarea i-w-long" placeholder="套餐内容中文描述">{$packData['content']}</textarea>
                    </td>
                    <td>
                        <textarea name="content_en" class="edit-dom i-textarea i-w-long" placeholder="套餐内容英文描述">{$packData['content_en']}</textarea>
                    </td>
                </tr>
                <tr>
                    <td>赠送服务</td>
                    <td>
                        <textarea name="gift_service" class="edit-dom i-textarea i-w-long" placeholder="赠送服务中文描述">{$packData['gift_service']}</textarea>
                    </td>
                    <td>
                        <textarea name="gift_service_en" class="edit-dom i-textarea i-w-long" placeholder="赠送服务英文描述">{$packData['gift_service_en']}</textarea>
                    </td>
                </tr>
                <tr>
                    <td>增值服务/价格</td>
                    <td colspan="2">
                        <section class="dlb">
                            <notempty name="addValueServiceData">
                                    <volist name="addValueServiceData" id="addValue">
                                        <div class="mb10">
                                            <input name="add_value_name[]" class="i-input mr10 mb5" type="text" placeholder="增值服务中文" value="{$addValue.name}"/>
                                            <input name="add_value_name_en[]" class="i-input mr10" type="text" placeholder="增值服务英文" value="{$addValue.name_en}"/>
                                            <input name="add_value_price[]" class="i-input mr30 i-max-width" type="text" placeholder="价格" value="{$addValue.price}"/>
                                            <input class="i-input i-max-width" type="number" data-name="min_num[]" name="min_num[]" placeholder="最少" value="{$addValue.min_num}"/>
                                            &ensp;-&ensp;
                                            <input class="i-input i-max-width mr10" type="number" data-name="max_num[]" name="max_num[]" placeholder="最多" value="{$addValue.max_num}"/>
                                            <button type="button" class="del-temp-dom i-button i-b-w mr10">删除</button>
                                        </div>
                                    </volist>
                                <else />
                                    <div class="mb10">
                                        <input name="add_value_name[]" class="i-input mr10 mb5" type="text" placeholder="增值服务中文" />
                                        <input name="add_value_name_en[]" class="i-input mr10" type="text" placeholder="增值服务英文" />
                                        <input name="add_value_price[]" class="i-input mr30 i-max-width" type="text" placeholder="价格" />
                                        <input class="i-input i-max-width" type="number" data-name="min_num[]" name="min_num[]" placeholder="最少" />
                                        &ensp;-&ensp;
                                        <input class="i-input i-max-width mr10" type="number" data-name="max_num[]" name="max_num[]" placeholder="最多" />
                                        <button type="button" class="del-temp-dom i-button i-b-w mr10">删除</button>
                                    </div>
                            </notempty>
                        </section>
                        <button data-html="exPriceDom" class="add-dom i-button i-b-w mr10" type="button">+</button>
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
    <!-- 日期选择 -->
    <link href="__PUBLIC__/Admin/css/inputdate.css" rel="stylesheet" />
    <script src="__PUBLIC__/Admin/js/inputdate.js"></script>
    <!-- this -->
    <script src="__PUBLIC__/Admin/js/goods.js"></script>
</block>