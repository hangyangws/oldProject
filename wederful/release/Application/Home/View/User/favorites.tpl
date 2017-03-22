<extend name="Public/base" />

<block name="meta">
    <title>个人中心 - wederful</title>
    <meta name="author" content="wederfull" />
    <meta name="keywords" content="Wederful,海外婚礼,海外婚礼场地,海外婚礼旅拍" />
    <meta name="Copyright" content="wederful.com &copy;" />
    <meta name="description" content="国内首家海外婚礼垂直电商,提供海外婚礼场地、全球知名婚礼及旅拍摄影师、海外婚礼团队住宿、交通服务、当地游活动及婚礼装扮等服务预定。DIY 海外婚礼,从此变得很简单。" />
</block>

<block name="global">
    <script>
        var global = {
            baseUrl:'{:U("User/favorites")}',
            collectionPackage: "{:U('User/collectionPackage')}",
            delCollectionPackage:"{:U('User/delCollectionPackage')}"
        };
    </script>
</block>

<block name="css">
    <link rel="stylesheet" href="__PUBLIC__/Home/css/user.css?20151230" />
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
                <h2>收藏夹</h2>
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
            <div id="goodsWrap" class="con-main fr">
                <ul class="main-nav-fav i-bc mb20">
                    <li class="dlb mr20 ts4 cp">
                        <label>
                            <input class="all-checked" type="checkbox" />
                            &ensp;全选
                        </label>
                    </li>
                    <li class="mul-cancel dlb ts4 cp ml10">删除</li>
                </ul>
                <volist name="data" id="d">
                    <section class="goods-item i-bc fs0 pt20 pb20 mb10" data-id="{$d.package_id}">
                        <input class="fav-choice dlb vam cp" type="checkbox" />
                        <div class="fav-wrap dlb ofh vam fs14 pr">
                            <img class="db middle vam w1 z1" draggable="false" src="{$d.pic}" />
                            <!-- 内容信息 -->
                            <div class="fav-con pa w1 h1 t0 l0 z2 c fcf ts4">
                                <section class="fav-name ml20 fs16 fl lh150">
                                    <h3 class="fs22 to">{$d.name}</h3>
                                    <h3 class="to">{$d.name_en}</h3>
                                    <span>￥{$d.price}</span>
                                </section>
                                <ul class="fav-icon fr tac">
                                    <volist name="d.pro" id="attIcon">
                                        <li class="fl mr20">
                                            <empty name="attIcon.icon.icon_url">
                                                    <img draggable="false" src="__PUBLIC__/Admin/images/icon/white/choice_photo.png" />
                                                <else />
                                                    <img draggable="false" src="__PUBLIC__/Admin/images/icon/white/{$attIcon.icon.icon_url}" />
                                            </empty >
                                            <if condition="$attIcon.name eq '包含住宿'">
                                                    <span  class="db">{$attIcon.icon.option}</span>
                                                <elseif condition="$attIcon.name eq '最大人数'"/>
                                                    <span  class="db">最大人数:{$attIcon.value}人</span>
                                                <elseif condition="$attIcon.name eq '场地类型'"/>
                                                    <span  class="db">{$attIcon.icon.option}</span>
                                                <elseif condition="$attIcon.name eq '所在地区'"/>
                                                    <span  class="db">{$attIcon.value}</span>
                                                <else />
                                                    <span>{$attIcon.name}</span>
                                            </if>
                                        </li>
                                    </volist>
                                </ul>
                            </div>
                            <div class="fav-operation pa w1 h1 t0 l0 z2 tac ts4">
                                <a target="_blank" class="fav-btn bcf r4 dlb mr30 ts4" href="{:U('Service/serviceDetail')}/id/{$d.pid}/area/{$d.areaid}">进入详情</a>
                                <button class="fav-cancel fav-btn bcf r4 dlb ts4" type="button">删除收藏</button>
                            </div>
                        </div>
                    </section>
                 </volist>
                <!-- 分页 -->
                <div id="paging" class="paging tac fs18 bcf mt20">
                    {$page}
                </div>
            </div>
        </section>
    </main>
</block>

<block name="footer-js">
    <script src="__PUBLIC__/Home/js/favorites.js?20151230"></script>
</block>
</div>