<extend name="Public/base" />
<block name="title">类别属性 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            categoryMdUrl:'{:U("Attribute/categoryMd")}', // 保存增加品类路径
            addAttributeUrl:'{:U("Attribute/addAttribute")}',
            delCategoryUrl:'{:U("Attribute/delCategory")}', // 传需要删除的post id（id:11）
            delAttributeUrl:'{:U("Attribute/delAttribute")}', // 删除属性
            getAttributeUrl:'{:U("Attribute/getAttribute")}', // 查看属性
            editAttributeUrl:'{:U("Attribute/editAttribute")}', // 编辑属性
            delOptionUrl:'{:U("Attribute/delOption")}', // 删除选项
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_attribute">
</block>
<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm h30 p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Index/goodsManage/')}">商品管理</a>
            <a href="{:U('Attribute/index/')}">属性类别</a>
        </nav>
    </div>
    <!-- h4 二级标题 -->
    <div class="mb20">
        <h4 class="fs20 fc3 dlb mr30">品类管理</h4>
        <button class="add-category i-button i-b-mw" type="button">增加品类</button>
    </div>
    <!-- ************************************ -->
    <!-- 删除按钮 -->
    <div id="delDom" class="none">
        <button type="button" class="del-temp-dom i-button i-b-w ml10 mr10">删除</button>
    </div>
    <!-- 图标 -->
    <div id="iconDom" class="none">
        <div class="type_icon ml5 w30 h30 dlb vam cp pr" title="选择图标">
            <img class="icon_id pr z1" data-pic="null" class="db" src="__PUBLIC__/Admin/images/icon/choice_photo.png" />
            <ul class="pa l0 bcf none z2">
                <!-- 循环图标 -->
                <volist name="iconManagerData" id="data">
                    <li class="atrr_icon" data-id="{$data.id}"><img src="__PUBLIC__/Admin/images/icon/{$data.icon_url}" /></li>
                </volist>
                <li class="atrr_icon" data-id="null" title="取消图标"><img src="__PUBLIC__/Admin/images/icon/choice_photo.png" /></li>
            </ul>
        </div>
    </div>
    <!-- 增加品类 -->
    <div id="addCategory" class="none">
        <div class="m-add-category m-add-box dlb r4 bcf">
            <label class="db mb10">
                <span>品类名称</span>
                <input name="name" class="save-item i-input" type="text" />
            </label>
            <label class="db mb10">
                <span>&emsp;</span>
                <span class="i-error">&emsp;</span>
            </label>
            <div class="db mb10">
                <span>&emsp;</span>
                <div class="dlb">
                    <!-- 添加子类 class 为 save-category-s -->
                    <button class="save-category i-button i-b-mw mr20" type="bubtton">保存</button>
                    <button class="close-mask i-button i-b-mw" type="bubtton">关闭</button>
                </div>
            </div>
        </div>
    </div>
    <!-- 添加属性 -->
    <div id="addAttr" class="none">
        <div class="m-add-attribute m-add-box dlb r4 bcf">
            <label class="db mb10">
                <span>属性类型</span>
                <select class="attribute-type i-select">
                    <option value="input">文本框</option>
                    <option value="textarea">文本域</option>
                    <option value="select">下拉框</option>
                    <option value="radio">单选框</option>
                    <option value="checkbox">多选框</option>
                </select>
            </label>
            <div class="attribute-type-wrap c">
                <label class="db fl">
                    <span>属性名</span>
                    <input type="text" class="attribute-name i-input" />
                    {{iconDom}}
                </label>
            </div>
            <label class="db mb10">
                <span>&emsp;</span>
                <span class="i-error">&emsp;</span>
            </label>
            <div class="db mb10">
                <span>&emsp;</span>
                <div class="dlb">
                    <button class="save-attribute i-button i-b-mw mr20" type="bubtton">保存</button>
                    <button class="close-mask i-button i-b-mw" type="bubtton">关闭</button>
                </div>
            </div>
        </div>
    </div>
    <!-- 单值属性 -->
    <div id="valSingle" class="none">
        <label class="db fl">
            <span>属性名</span>
            <input type="text" class="attribute-name i-input" />
            {{iconDom}}
        </label>
    </div>
    <!-- 多值属性 -->
    <div id="valMulti" class="none">
        <label class="db mr20 fl">
            <span>属性名</span>
            <input type="text" class="attribute-name i-input i-text-s" />
        </label>
        <section class="attr-val-wrap bcf pr pl20 fr">
        <div class="dlb">
            <label class="db mb10"><span>候选值</span><input type="text" class="save-item i-input i-text-s" />
                {{iconDom}}
                {{delDom}}
            </label>
        </div>
        <button type="button" class="attr-val-add ml10 i-button i-b-mw">新增值</button>
        </section>
    </div>
    <div id="valMultiTwo" class="none">
        <label class="db mb10"><span>候选值</span><input type="text" class="save-item i-input i-text-s" />
            {{iconDom}}
            {{delDom}}
        </label>
    </div>
    <!-- ************************************ -->
    <!-- 折叠导航 -->
    <ul class="fold-nav mb20 i-lh30">
        <!-- 给 li 加上 active 类表示展开 li放相应的 class -->
        <volist name="result" id="data">
            <!-- 一级分类 -->
            <li data-id="{$data.id}" class="active pb20 mb20">
                <div class="c mb15">
                    <button class="fold-nav-open mr5 bct fl"></button>
                    <span class="fl">{$data.name}</span>
                    <button data-i="一级分类：{$data.name}" type="button" class="del-category i-button i-b-mw fr ml20">删除</button>
                    <!-- <button type="button" class="add-category-sub i-button i-b-mw ml20 fr">添加子类</button> -->
                    <button type="button" class="add-attribute i-button i-b-mw fr">添加属性</button>
                </div>
                <ul class="fold-nav-third none i-bcm pt10 c">
                    <!-- 一级分类的属性 -->
                    <volist name="data.attrs" id="attr">
                        <li data-id="{$attr.id}">
                            <div class="c">
                                <button class="fold-nav-close mr5 ml5 r50 pr fl"></button>
                                <span class="fl">{$attr.name}</span>
                                <button data-i="属性：{$attr.name}" type="button" class="del-attr i-button i-b-mw fr ml20">删除</button>
                                <button type="button" class="edit-attr i-button i-b-mw fr">编辑</button>
                            </div>
                        </li>
                     </volist>
                </ul>
            </li>
        </volist>
    </ul>
</block>

<block name="script">
    <!-- this -->
    <script src="__PUBLIC__/Admin/js/attribute.js"></script>
</block>