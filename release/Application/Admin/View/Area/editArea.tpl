<extend name="Public/base" />
<block name="title">地区编辑 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            qiniuUploadTokenUrl:'{:U("Product/qiniuUploadToken")}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_area">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Area/index/')}">地区管理</a>
            <a href="{:U('Area/editArea/')}">地区编辑</a>
        </nav>
    </div>
    <!-- ************************************ -->
    <div id="addDom" class="none">
        <div class="mb10">
            <!-- 这个name要随着点击按钮的不同而变化 -->
            <textarea class="{{edit-dom}} i-textarea" name="{{content}}"></textarea>
            <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                <!-- 这个name要随着点击按钮的不同而变化 -->
                <input type="hidden" name="{{icon}}" />
                <img class="icon_id pr z1" class="db" src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" />
                <ul class="aera-icon-wrap pa l0 bcf none z2">
                    <!-- 这个 data-id 表示 图标的id -->
                    <volist name="icons" id="icon">
                        <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                    </volist>
                    <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                </ul>
            </div>
            <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
        </div>
    </div>
    <!-- ************************************ -->
    <form action="{:U('Area/editAreaMethod')}" method="POST">
        <table class="con-show area-add-table w1">
            <tbody>
                <tr>
                    <td>地区名称</td>
                    <input type="hidden" value="{$id}" name="id"/>
                    <td><input class="i-input" type="text" placeholder="中文名" name="name" value="{$data.name}"/></td>
                    <td><input class="i-input" type="text" placeholder="英文名" name="name_en" value="{$data.name_en}"/></td>
                </tr>
                <tr>
                    <td>背景大图</td>
                    <td colspan="2">
                        <if condition="$data.bigpic neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$data.bigpic}">
                                <input type="hidden" value="{$data.bigpic}" name="bigpic" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="bigpic" style="display:none"></span>
                        <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="bigpic"></span>
                        </if>
                    </td>
                </tr>
                <tr>
                    <td>背景小图</td>
                    <td colspan="2">
                        <if condition="$data.smallpic  neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$data.smallpic}">
                                <input type="hidden" value="{$data.smallpic}" name="smallpic" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="smallpic" style="display:none"></span>
                        <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="smallpic"></span>
                        </if>
                    </td>
                </tr>
                <tr>
                    <td>签证信息</td>
                    <td>
                        <input class="i-input db mb10" type="text" placeholder="图片标题" name="visa_pic_title" value="{$data.visa_pic_title}" />
                        <if condition="$data.visa_pic  neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$data.visa_pic}">
                                <input type="hidden" value="{$data.visa_pic}" name="visa_pic" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="visa_pic" style="display:none"></span>
                        <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="visa_pic"></span>
                        </if>
                    </td>
                    <td>
                        <section>
                            <if condition="$visaData">
                            <volist name="visaData" id="visa">
                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['visa'][]">{$visa.content}</textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['visa'][]" value="{$visa.icon_area_id}"/>
                                        <ExtendsTags:geticonurl iconid="visa.icon_area_id"/>
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>
                            </volist>
                            <else / >

                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['visa'][]"></textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['visa'][]" />
                                        <img class="icon_id pr z1" class="db" src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" />
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>

                            </if>

                        </section>
                        <button data-con="content['visa'][]" data-icon="iconId['visa'][]" type="button" class="area-add-dom i-button i-b-mw">添加</button>
                    </td>
                </tr>
                <tr>
                    <td>交通信息</td>
                    <td>
                        <input class="i-input db mb10" type="text" placeholder="图片标题" name="traffic_pic_title" value="{$data.traffic_pic_title}"/>
                        <if condition="$data.traffic_pic  neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$data.traffic_pic}">
                                <input type="hidden" value="{$data.traffic_pic}" name="traffic_pic" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="traffic_pic" style="display:none"></span>
                        <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="traffic_pic"></span>
                        </if>
                    </td>
                    <td>
                        <section>
                            <if condition="$trafficData">
                            <volist name="trafficData" id="traffic">
                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['traffic'][]">{$traffic.content}</textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['traffic'][]" value="{$traffic.icon_area_id}"/>
                                        <ExtendsTags:geticonurl iconid="traffic.icon_area_id"/>
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>
                            </volist>
                            <else />
                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['traffic'][]"></textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['traffic'][]" />
                                        <img class="icon_id pr z1" class="db" src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" />
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>
                            </if>
                        </section>
                        <button data-con="content['traffic'][]" data-icon="iconId['traffic'][]" type="button" class="area-add-dom i-button i-b-mw">添加</button>
                    </td>
                </tr>
                <tr>
                    <td>住宿信息</td>
                    <td>
                        <input class="i-input db mb10" type="text" placeholder="图片标题" name="stay_pic_title" value="{$data.stay_pic_title}"/>
                        <if condition="$data.stay_pic  neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$data.stay_pic}">
                                <input type="hidden" value="{$data.stay_pic}" name="stay_pic" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="stay_pic" style="display:none"></span>
                        <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="stay_pic"></span>
                        </if>
                    </td>
                    <td>
                        <section>
                            <if condition="$stayData">
                            <volist name="stayData" id="stay">
                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['stay'][]">{$stay.content}</textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['stay'][]" value="{$stay.icon_area_id}"/>
                                        <ExtendsTags:geticonurl iconid="stay.icon_area_id"/>
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>
                            </volist>
                            <else />
                                <div class="mb10">
                                <textarea class="edit-dom i-textarea" name="content['stay'][]"></textarea>
                                <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                    <input type="hidden" name="iconId['stay'][]" />
                                    <img class="icon_id pr z1" class="db" src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" />
                                    <ul class="aera-icon-wrap pa l0 bcf none z2">
                                        <volist name="icons" id="icon">
                                            <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                        </volist>
                                        <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                    </ul>
                                </div>
                                <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                            </div>
                        </if>
                        </section>
                        <button data-con="content['stay'][]" data-icon="iconId['stay'][]" type="button" class="area-add-dom i-button i-b-mw">添加</button>
                    </td>
                </tr>
                <tr>
                    <td>消费信息</td>
                    <td>
                        <input class="i-input db mb10" type="text" placeholder="图片标题" name="consumption_pic_title" value="{$data.consumption_pic_title}"/>
                        <if condition="$data.consumption_pic  neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$data.consumption_pic}">
                                <input type="hidden" value="{$data.consumption_pic}" name="consumption_pic" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="consumption_pic" style="display:none"></span>
                         <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="consumption_pic"></span>
                         </if>
                    </td>
                    <td>
                        <section>
                            <if condition="$consumptionData">
                            <volist name="consumptionData" id="consumption">
                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['consumption'][]">{$consumption.content}</textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['consumption'][]" value="{$consumption.icon_area_id}"/>
                                        <ExtendsTags:geticonurl iconid="consumption.icon_area_id"/>
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>
                            </volist>
                            <else />
                            <div class="mb10">
                                <textarea class="edit-dom i-textarea" name="content['consumption'][]"></textarea>
                                <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                    <input type="hidden" name="iconId['consumption'][]" />
                                    <img class="icon_id pr z1" class="db" src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" />
                                    <ul class="aera-icon-wrap pa l0 bcf none z2">
                                        <volist name="icons" id="icon">
                                            <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                        </volist>
                                        <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                    </ul>
                                </div>
                                <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                            </div>
                        </if>

                        </section>
                        <button data-con="content['consumption'][]" data-icon="iconId['consumption'][]" type="button" class="area-add-dom i-button i-b-mw">添加</button>
                    </td>
                </tr>
                <tr>
                    <td>气候信息</td>
                    <td>
                        <input class="i-input db mb10" type="text" placeholder="图片标题" name="climate_pic_title" value="{$data.climate_pic_title}"/>
                        <if condition="$data.climate_pic  neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$data.climate_pic}">
                                <input type="hidden" value="{$data.climate_pic}" name="climate_pic" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="climate_pic" style="display:none"></span>
                        <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="climate_pic"></span>
                        </if>
                    </td>
                    <td>
                        <section>
                            <if condition="$climateData">
                            <volist name="climateData" id="climate">
                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['climate'][]">{$climate.content}</textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['climate'][]" value="{$climate.icon_area_id}"/>
                                        <ExtendsTags:geticonurl iconid="climate.icon_area_id"/>
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>
                            </volist>
                            <else />
                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['climate'][]"></textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['climate'][]" />
                                        <img class="icon_id pr z1" class="db" src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" />
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>
                        </if>
                        </section>
                        <button data-con="content['climate'][]" data-icon="iconId['climate'][]" type="button" class="area-add-dom i-button i-b-mw">添加</button>
                    </td>
                </tr>
                <tr>
                    <td>其他信息</td>
                    <td>
                        <input class="i-input db mb10" type="text" placeholder="图片标题" name="other_pic_title" value="{$data.other_pic_title}"/>
                        <if condition="$data.climate_pic  neq ''">
                            <figure class="load-img-wrap">
                                <img src="{$data.other_pic}">
                                <input type="hidden" value="{$data.other_pic}" name="other_pic" class="save-item" />
                                <span class="qiniu-img-del">x</span>
                            </figure>
                            <span class="add-img" data-rule="random" data-num="1" data-name="other_pic" style="display:none"></span>
                        <else />
                            <span class="add-img" data-rule="random" data-num="1" data-name="other_pic"></span>
                        </if>
                    </td>
                    <td>
                        <section>
                             <if condition="$climateData">
                            <volist name="otherData" id="other">
                                <div class="mb10">
                                    <textarea class="edit-dom i-textarea" name="content['other'][]">{$other.content}</textarea>
                                    <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                        <input type="hidden" name="iconId['other'][]" value="{$other.icon_area_id}"/>
                                        <ExtendsTags:geticonurl iconid="other.icon_area_id"/>
                                        <ul class="aera-icon-wrap pa l0 bcf none z2">
                                            <volist name="icons" id="icon">
                                                <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                            </volist>
                                            <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                                </div>
                            </volist>
                            <else />
                                <div class="mb10">
                                <textarea class="edit-dom i-textarea" name="content['other'][]"></textarea>
                                <div class="area_icon type_icon w30 h30 dlb vam cp pr ml10" title="选择图标">
                                    <input type="hidden" name="iconId['other'][]" />
                                    <img class="icon_id pr z1" class="db" src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" />
                                    <ul class="aera-icon-wrap pa l0 bcf none z2">
                                        <volist name="icons" id="icon">
                                            <li data-id="{$icon.id}"><img src="__PUBLIC__/Admin/images/icon_area/{$icon.icon_url}" /></li>
                                        </volist>
                                        <li data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon_area/choice_photo.png" /></li>
                                    </ul>
                                </div>
                                <button type="button" class="del-temp-dom i-button i-b-w ml10">删除</button>
                            </div>

                            </if>
                        </section>
                        <button data-con="content['other'][]" data-icon="iconId['other'][]" type="button" class="area-add-dom i-button i-b-mw">添加</button>
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
    <script src="__PUBLIC__/Admin/js/area.js"></script>
</block>