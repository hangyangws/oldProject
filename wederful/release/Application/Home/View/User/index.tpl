<extend name="Public/base" />

<block name="meta">
	<title>个人中心 - wederful</title>
	<meta name="author" content="wederfull" />
    <meta name="keywords" content="Wederful,海外婚礼,海外婚礼场地,海外婚礼旅拍" />
    <meta name="Copyright" content="wederful.com &copy;" />
    <meta name="description" content="国内首家海外婚礼垂直电商,提供海外婚礼场地、全球知名婚礼及旅拍摄影师、海外婚礼团队住宿、交通服务、当地游活动及婚礼装扮等服务预定。DIY 海外婚礼,从此变得很简单。" />
</block>

<block name="css">
    <link rel="stylesheet" href="__PUBLIC__/Home/css/user.css?20151230" />
</block>

<block name="global">
    <script>
        var global = {
            jsonUrl: '__PUBLIC__/Home/js/',
            reset: "{:U('Login/reset')}",
            checkNikeName: "{:U('Login/checkNikeName')}"
        };
    </script>
</block>

<block name="body">
    <body id="body" class="body">
</block>

<block name="main">
    <main id="main" class="main">
        <section class="title-wrap i-mw pr fs0">
            <img class="w1 fs16" draggable="false" src="http://7xo7hn.com1.z0.glb.clouddn.com/1450075236180" alt="个人中心" />
            <div class="title-text w1 fcf fs22 tac pa t0">
                <h2>WEDERFUL</h2>
                <h2>个人中心</h2>
            </div>
        </section>
        <section class="con-wrap w1000 bc p c">
            <aside class="aside tac fl">
                <figure class="fs0 pr mb20">
                    <img class="r50" draggable="false" src="http://7xo7hn.com1.z0.glb.clouddn.com/head-default.png" alt="用户名" />
                    <!-- <button class="fs22 bct pa t0" type="button" title="删除头像">×</button> -->
                </figure>
                <!-- <button class="portrait-btn bcf r4 ts4" type="button">上传头像</button> -->
                <nav class="aside-nav mt30 pt30 pb30">
                    <!-- 加上active 高亮 -->
                    <a href="__ROOT__/account" class="icon-data db mb10 active">
                        <i class="i-icon i-icon-data"></i>
                        个人资料
                    </a>
                    <a href="__ROOT__/favor" class="icon-fav db mb10">
                        <i class="i-icon i-icon-fav"></i>
                        收藏夹&emsp;
                    </a>
                    <!-- <a href="{:U('Home/User/orders/')}" class="icon-mes db">
                        <i class="i-icon i-icon-mes"></i>
                        订单信息
                    </a> -->
                </nav>
            </aside>
            <div class="con-main fr">
                <ul id="tabIndex" class="main-nav i-bc mb20">
                    <li data-to="msg" class="dlb mr20 ts4 cp active">基本信息</li>
                    <li data-to="pass" class="dlb ts4 cp">修改密码</li>
                </ul>
                <div id="tab" class="main-con i-bc pr">
                    <section class="sub-wrap msg">
                        <form id="userInfo" method="POST" autocomplete="off">
                            <label class="label-item">
                                <span class="item-tip">昵称</span>
                                <input class="nickname ipt-trigger" name="nickname" type="text" value="{$data.nickname}"/>
                            </label>
                            <label class="label-item">
                                <span class="item-tip">邮箱</span>
                                <input class="ipt-email ipt-trigger" name="email" type="email" value="{$data.email}" />
                            </label>
                            <section class="label-tel c">
                                <div class="dlb">
                                    <span class="item-tip">手机</span>
                                    <label class="tel-wrap bcf dlb">
                                        <span>+86</span>
                                        <input class="ipt-trigger" name="mobile" id="tel" readonly="readonly" value="{$data.mobile}"/>
                                    </label>
                                </div>
                                <div class="tel-func dlb fr">
                                    <!-- <span class="status-tel true dlb mr10">已验证</span> -->
                                    <button type="button" class="send-code bct ts4 r4 none">发送验证码</button>
                                    <span>&emsp;</span>
                                    <button type="button" class="modify-tel bct fr ts4 none">修改</button>
                                </div>
                            </section>
                            <label class="label-item">
                                <span class="item-tip">性别</span>
                                <select name="sex">
                                    <option value="0" <if condition="$data.sex eq '0'">selected="selected"</if>>保密</option>
                                    <option value="1" <if condition="$data.sex eq '1'">selected="selected"</if>>男</option>
                                    <option value="2" <if condition="$data.sex eq '2'">selected="selected"</if>>女</option>
                                    <option value="3" <if condition="$data.sex eq '3'">selected="selected"</if>>其他</option>
                                </select>
                            </label>
                            <label class="label-item">
                                <span class="item-tip">期望的目的地</span>
                                <input class="ipt-trigger" name="wedding_location" type="text" value="{$data.wedding_location}"/>
                            </label>
                            <section class="label-item">
                                <label class="item-tip">所在地</label>
                                <select name="country_id" id="country">
                                    <empty name="data.country_id">
                                        <option value="null"></option>
                                    <else />
                                        <option value="{$data.country_id}"></option>
                                    </empty>
                                </select>
                                <select name="province_id" id="province">
                                    <empty name="data.province_id">
                                        <option value="null"></option>
                                    <else />
                                        <option value="{$data.province_id}"></option>
                                    </empty>
                                </select>
                                <select name="city_id" id="city">
                                    <empty name="data.city_id">
                                        <option value="null"></option>
                                    <else />
                                        <option value="{$data.city_id}"></option>
                                    </empty>
                                </select>
                            </section>
                            <section class="label-item" data-ooo="{$data.wedding_date}">
                                <span class="item-tip">婚期</span>
                                <empty name="data.wedding_date">
                                    <select id="year">
                                        <option value="null"></option>
                                    </select>
                                    <select id="mouth">
                                        <option value="null"></option>
                                    </select>
                                    <select id="day">
                                        <option value="null"></option>
                                    </select>
                                <else />
                                    <select id="year">
                                        <option value="{$data.wedding_date|substr=0,4}"></option>
                                    </select>
                                    <select id="mouth">
                                        <option value="{$data.wedding_date|substr=5,2}"></option>
                                    </select>
                                    <select id="day">
                                        <option value="{$data.wedding_date|substr=8,2}"></option>
                                    </select>
                                </empty>
                                <input id="YMD" name="wedding_date" type="hidden" />
                            </section>
                            <section class="save-btn">
                                <span class="item-tip">&emsp;</span>
                                <button type="button" data-role="info" class="submit-btn fcf tac ts4 r4">保存</button>
                                <span class="submit-err">&emsp;</span>
                            </section>
                        </form>
                    </section>
                    <section class="sub-wrap pass none">
                        <label class="label-item">
                            <span class="item-tip">旧密码</span>
                            <input class="old-pass ipt-trigger" type="password" />
                        </label>
                        <label class="label-item">
                            <span class="item-tip">新密码</span>
                            <input class="new-pass ipt-trigger" type="password" placeholder="输入6-20位字符密码" />
                        </label>
                        <label class="label-item">
                            <span class="item-tip">确认新密码</span>
                            <input class="re-pass ipt-trigger" type="password" placeholder="重复密码" />
                        </label>
                        <section class="save-btn">
                            <span class="item-tip">&emsp;</span>
                            <button type="button" data-role="pass" class="submit-btn fcf tac ts4 r4">保存</button>
                            <span class="submit-err">&emsp;</span>
                        </section>
                    </section>
                </div>
            </div>
        </section>
    </main>
</block>

<block name="footer-js">
    <script src="__PUBLIC__/Home/js/user.js?20151230"></script>
</block>
</div>