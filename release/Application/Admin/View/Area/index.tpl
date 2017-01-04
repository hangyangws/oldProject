<extend name="Public/base" />
<block name="title">地区管理 - wederful后台管理系统</block>
<block name="global">
    <script>
        var global = {
            localUrl: '{:U("Area/index/")}',
            delAreaUrl:'{:U("Area/delArea")}',
            copyAreaUrl:'{:U("Area/copyArea")}'
        };
    </script>
</block>

<block name="main-class">
    <main class="main bb pr page_area">
</block>

<block name="main">
    <!-- 导航栏 -->
    <div class="con-nav i-lh30 i-bcm h30 p10 mb20 c">
        <nav class="fl">
            <a href="{:U('Area/index/')}">地区管理</a>
        </nav>
        <div class="fr c">
            <!-- 第一个不需要 class ml20 -->
            <a href="{:U('Area/addArea/')}" class="i-button i-b-mw fl">新增地区</a>
        </div>
    </div>
    <!-- 结果展示区域 table -->
    <table class="i-table mb20 w1">
        <thead>
            <tr>
                <th>地区</th>
                <th>上传时间</th>
                <th>上传者</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <volist name="result" id="re">
                <tr data-id="{$re.id}" data-name="{$re.name}">
                    <td>{$re.name}</td>
                    <td class="createtime">{$re.createtime}</td>
                    <td class="upname"><ExtendsTags:getusername uid="re.uid"/></td>
                    <td>
                        <a class="edit-this dlb mr20" href="{:U('Area/editArea')}/destid/{$re.id}">编辑</a>
                        <a class="area-copy dlb mr20 cp">复制</a>
                        <a class="area-del dlb cp">删除</a>
                    </td>
                </tr>
            </volist>
        </tbody>
    </table>
    <!-- 分页 paging -->
    <section class="paging">
        <dl class="dlb mr20">
            <dt class="dlb">地区数：</dt>
            <dd class="dlb">{$totalSize}</dd>
        </dl>
        {$page}
    </section>
</block>

<block name="script">
    <!-- this -->
    <script src="__PUBLIC__/Admin/js/area.js"></script>
</block>