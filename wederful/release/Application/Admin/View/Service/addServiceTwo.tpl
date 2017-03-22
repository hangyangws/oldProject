<extend name="Public/base" />
<block name="title">新增服务项 - wederful后台管理系统</block>
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
            <a href="{:U('Service/addServiceOne/')}">新增服务项</a>
            <a href="{:U('Service/addSercerTwo/')}">新增服务项条款即图片</a>
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
    <form class="package-form" action='{:U("Service/addServiceTwoMethod")}' method="POST">
        <input name="pid" type="hidden" value='{$pid}'/>
        <table class="con-show w1">
            <tbody>
                <!-- 图片管理 -->
                <tr>
                    <td colspan="3" class="mb10 fs20 fc3 mr30">图片管理</td>
                </tr>
                <tr class="goods-img">
                    <td>大图</td>
                    <td colspan="2"><span data-num="1" data-name="large" class="add-img"></span></td>
                </tr>
                <tr class="goods-img">
                    <td>缩略图</td>
                    <td colspan="2"><span data-num="1" data-name="thumbnail" class="add-img"></span></td>
                </tr>
                <tr class="goods-img">
                    <td>详情图</td>
                    <td colspan="2"><span data-num="infinity" data-name="details" class="add-img"></span></td>
                </tr>
                <!-- 预定须知 -->
                <tr>
                    <td>预订须知</td>
                    <td>
                        <textarea name="booking_notice" class="edit-dom i-textarea i-w-long">
                            <p>预订本产品需支付总价款的50%作为定金，用于锁定婚礼日期。</p>
                            <p>本产品基价为美元计算，为避免汇率波动造成的影响，请在订单确认后的48小时内完成定金支付。</p>
                            <p>本产品余款需在婚礼日期30天前完成支付。</p>
                            <p>预订后的任何变更可能会造成相应罚金或导致婚礼日期不可用，请在预订前仔细阅览产品变更政策。</p>
                            <p>预定后如需增加服务项目，请尽早与我们的客服人员取得联系。</p>
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
                                <option value="{$ratio}">{$ratio}%</option>
                            </volist>
                        </select>
                    </td>
                    <td>&ensp;</td>
                </tr>
                <tr>
                    <td>余款日期</td>
                    <td colspan="2">
                        <section class="dlb">
                            <div>
                                在婚礼日期前
                                <input name="balance_date_num" class="i-input i-max-width ml10 mr10" type="text" />
                                天需支付余款
                            </div>
                        </section>
                    </td>
                </tr>
                <tr>
                    <td>取消费用</td>
                    <td colspan="2">
                        <section class="cancel-fee-wrap dlb">
                            <div class="mb10">
                                在婚礼日期前
                                <input name="no_fine_date_num" class="i-input i-max-width ml10 mr10" type="text" />
                                天取消，不罚款
                            </div>
                            <div class="mb10">
                                在婚礼日期前
                                <input name="deduct_fine_date[]" class="i-input i-max-width ml10 mr10" type="text" />
                                天取消，扣除定金比例
                                <input name="deduct_fine_value[]" class="i-input i-max-width ml10 mr10" type="text" />
                                %
                                <button type="button" class="del-temp-dom i-button i-b-w ml10 mr10">删除</button>
                            </div>
                        </section>
                        <button class="add-cancel-fee i-button i-b-w ml10 mr10" type="button">+</button>
                    </td>
                </tr>
                <tr>
                    <td>&emsp;</td>
                    <td>
                        <span class="db mb5">费用包含:</span>
                        <textarea name="cost_include" class="edit-dom i-textarea i-w-long" placeholder="费用包含">
                            <p>套餐所含婚礼服务内容</p>
                            <p>套餐所含婚礼服务赠送内容</p>
                            <p>用户自行选择的增值服务（如有）</p>
                            <p>包含当地服务税</p>
                        </textarea>
                    </td>
                    <td>
                        <span class="db mb5">费用不包含:</span>
                        <textarea name="cost_not_include" class="edit-dom i-textarea i-w-long" placeholder="费用不包含">
                            <p>往返机票，航程的机场税、燃油费</p>
                            <p>出入境时由于个人物品所引起的费用，如海关征税、托运费、保管费、超重行李费等</p>
                            <p>个人护照及签证费用</p>
                            <p>保险费，建议自行购买</p>
                            <p>小费</p>
                            <p>套餐中未提及的酒店住宿费用</p>
                            <p>自行安排的行程交通、观光费用或服务开</p>
                            <p>因交通阻碍、罢工、天气、飞机机器故障、航班取消或更改时间等不可抗力原因导致的费用</p>
                            个人消费及费用包含中未提及的其他费用
                        </textarea>
                    </td>
                </tr>
                <tr>
                    <td>&emsp;</td>
                    <td>
                        <span class="db mb5">费用其他:</span>
                        <textarea class="edit-dom i-textarea i-w-long" placeholder="费用其他" name="other_cost"></textarea>
                    </td>
                    <td>
                        &emsp;
                    </td>
                </tr>
                <tr>
                    <td>政策说明</td>
                    <td>
                        <span class="db mb5">取消政策:</span>
                        <textarea class="edit-dom i-textarea i-w-long" placeholder="取消政策" name="cancel_policy"></textarea>
                    </td>
                    <td>
                        <span class="db mb5">修改政策:</span>
                        <textarea name="change_policy" class="edit-dom i-textarea i-w-long" placeholder="修改政策">
                           <p>婚礼日期及当日场次只接受一次变更请求。</p>
                           <p>如在婚礼日期90天前确认变更，变更后价款高于原价款，需将定金金额补足至变更后价款的50%。</p>
                           <p>如在婚礼日期30天前确认变更，变更后价款高于原价款，需补足至变更后价款的100%。</p>
                           <p>如在婚礼日期30天前确认变更，变更后价款低于原价款，不退还高于部分，用于抵扣后面的尾款。</p>
                            除婚礼日期及当日场次之外的项目变更，包括但不限于婚礼场地布置，嘉宾人数增减，鲜花花材的变更，花童数量的增减，乐队乐手数量的增减及其他增值服务的变更，需在婚礼日期30日前提出并由酒店完成认。</p>
                           <p>为确保变更服务可用，请尽早联系我们的客服，任何变更结果，以酒店确认为准。</p>
                           <p>由于服务变更而产生的服务费，税费，手续费，违约金等费用，由用户自行承担。</p>
                        </textarea>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="con-operation tac pt20 mb30">
            <a class="dlb i-button bb lh200 vat i-b-mw mr30" href="###">上一步</a>
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