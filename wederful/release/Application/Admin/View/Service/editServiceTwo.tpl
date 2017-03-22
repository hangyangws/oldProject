<extend name="Public/base" />
<block name="title">编辑服务项 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            qiniuUploadTokenUrl:'{:U("Product/qiniuUploadToken")}',
            uploadUrl:'{:U("Index/uploadImg")}'
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
            <a href="{:U('Service/addSercerTwo/')}">编辑服务项条款即图片</a>
        </nav>
    </div>
    <!-- ************************************ -->
    <div id="addDom" class="none">
        <div class="mb10">
            在婚礼日期前
            <input name="deduct_fine_date[]" class="i-input i-max-width ml10 mr10" type="text" />
            天取消，扣除定金比例
            <input name="deduct_fine_value[]" class="i-input i-max-width ml10 mr10" type="text" />
            %
            <button type="button" class="del-temp-dom i-button i-b-w ml10 mr10">删除</button>
        </div>
    </div>
    <!-- ************************************ -->
    <form class="package-form" action='{:U("Service/editServiceTwoMethod")}' method="POST">
        <input name="pid" type="hidden" value='{$pid}'/>
        <table class="con-show w1">
            <tbody>
                <!-- 图片管理 -->
                <tr>
                    <td colspan="3" class="mb10 fs20 fc3 mr30">图片管理</td>
                </tr>
                <tr class="goods-img">
                    <td>大图</td>
                    <td colspan="2">
                        <if condition="$proData.large_img neq ''">
                            <figure>
                                <img src="{$proData.large_img}">
                                <input type="hidden" value="{$proData.large_img}" name="large" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span data-num="1" data-name="large" class="add-img" style="display: none;"></span>
                        <else />
                            <span data-num="1" data-name="large" class="add-img"></span>
                        </if>
                    </td>
                </tr>
                <tr class="goods-img">
                    <td>缩略图</td>
                    <td colspan="2">
                        <if condition="$proData.thumbnail neq ''">
                            <figure>
                                <img src="{$proData.thumbnail}">
                                <input type="hidden" value="{$proData.thumbnail}" name="thumbnail" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-num="1" data-name="thumbnail" style="display: none;"></span>
                        <else />
                            <span class="add-img" data-num="1" data-name="thumbnail"></span>
                        </if>

                    </td>
                </tr>
                <tr class="goods-img">
                    <td>详情图</td>
                    <td colspan="2">
                        <if condition="$detailImg neq ''">
                            <volist name="detailImg" id="img">
                                <figure>
                                    <img src="{$img.img}">
                                    <input type="hidden" value="{$img.img}" name="details[]" />
                                    <span class="qiniu-img-del">x</span>
                                </figure>
                            </volist>
                        </if>
                        <span data-num="infinity" data-name="details" class="add-img"></span>
                    </td>
                </tr>
                <!-- 预定须知 -->
                <tr>
                    <td>预订须知</td>
                    <td>
                        <textarea name="booking_notice" class="edit-dom i-textarea i-w-long">
                            {$noticeData.booking_notice}
                        </textarea>
                    </td>
                    <td>&emsp;</td>
                </tr>
                <!-- 费用说明 -->
                <tr>
                    <td colspan="3" class="mb10 fs20 fc3 mr30">费用说明</td>
                </tr>
                <tr>
                    <td>定金比例</td>
                    <td>
                        <select name="deposit_ratio" class="i-select i-w-short">
                            <option value="null">选择定金比例</option>
                            <volist name="depositRatio" id="ratio">
                                <if condition="$costData.deposit_ratio eq $ratio">
                                    <option value="{$ratio}" selected="selected">{$ratio}%</option>
                                    <else />
                                    <option value="{$ratio}">{$ratio}%</option>
                                </if>
                            </volist>
                        </select>
                    </td>
                    <td>&ensp;</td>
                </tr>
                <tr>
                    <td>余款日期</td>
                    <td colspan="2">
                        <section class="dlb">
                            <div>在婚礼日期前<input name="balance_date_num" class="i-input i-max-width ml10 mr10" type="text" value="{$costData.balance_date_num}"/>天需支付余款</div>
                        </section>
                    </td>
                </tr>
                <tr>
                    <td>取消费用</td>
                    <td colspan="2">
                        <section class="cancel-fee-wrap dlb">
                            <div class="mb10">在婚礼日期前<input name="no_fine_date_num" class="i-input i-max-width ml10 mr10" type="text" value="{$costData.no_fine_date_num}"/>天取消，不罚款</div>
                            <volist name="deList" id="de">
                                <div class="mb10">在婚礼日期前<input name="deduct_fine_date[]" class="i-input i-max-width ml10 mr10" type="text" value="{$de.date_num}"/>天取消，扣除定金比例<input name="deduct_fine_value[]" class="i-input i-max-width ml10 mr10" type="text" value="{$de.fine_ratio}"/>% <button type="button" class="del-temp-dom i-button i-b-w ml10 mr10">删除</button></div>
                            </volist>
                        </section>
                        <button class="add-cancel-fee i-button i-b-w ml10 mr10" type="button">+</button>
                    </td>
                </tr>
                <tr>
                    <td>&emsp;</td>
                    <td>
                        <span class="db mb5">费用包含:</span>
                        <textarea name="cost_include" class="edit-dom i-textarea i-w-long" placeholder="费用包含">
                            {$noticeData.cost_include}
                        </textarea>
                    </td>
                    <td>
                        <span class="db mb5">费用不包含:</span>
                        <textarea name="cost_not_include" class="edit-dom i-textarea i-w-long" placeholder="费用不包含">
                            {$noticeData.cost_not_include}
                        </textarea>
                    </td>
                </tr>
                <tr>
                    <td>&emsp;</td>
                    <td>
                        <span class="db mb5">费用其他:</span>
                        <textarea class="edit-dom i-textarea i-w-long" placeholder="费用其他" name="other_cost">
                            {$noticeData.other_cost}
                        </textarea>
                    </td>
                    <td>
                        &emsp;
                    </td>
                </tr>
                <tr>
                    <td>政策说明</td>
                    <td>
                        <span class="db mb5">取消政策:</span>
                        <textarea class="edit-dom i-textarea i-w-long" placeholder="取消政策" name="cancel_policy">
                            {$noticeData.cancel_policy}
                        </textarea>
                    </td>
                    <td>
                        <span class="db mb5">修改政策:</span>
                        <textarea name="change_policy" class="edit-dom i-textarea i-w-long" placeholder="修改政策">
                            {$noticeData.change_policy}
                        </textarea>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="con-operation tac pt20 mb30">
            <a class="dlb i-button bb lh200 vat i-b-mw mr30" href='{:U("Service/editServiceOne")}/pid/{$pid}'>上一步</a>
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
    <script src="__PUBLIC__/Admin/js/service.js"></script>
</block>