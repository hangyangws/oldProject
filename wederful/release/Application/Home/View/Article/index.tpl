<extend name="Public/base" />

<block name="meta">
	<title>我们的故事 - wederful</title>
	<meta name="author" content="wederfull" />
    <meta name="keywords" content="Wederful,海外婚礼,海外婚礼场地,海外婚礼旅拍" />
    <meta name="Copyright" content="wederful.com &copy;" />
    <meta name="description" content="国内首家海外婚礼垂直电商,提供海外婚礼场地、全球知名婚礼及旅拍摄影师、海外婚礼团队住宿、交通服务、当地游活动及婚礼装扮等服务预定。DIY 海外婚礼,从此变得很简单。" />
</block>

<block name="global">
    <script>
        var global = {
            baseUrl:'{:U("Article/index")}'
        };
    </script>
</block>

<block name="css">
    <link rel="stylesheet" href="__PUBLIC__/Home/css/article.css?20151230" />
</block>

<block name="body">
    <body id="body" class="body">
</block>

<block name="main">
    <main id="main" class="main">
        <section class="article-all-wrap bc">
            <h1 class="lovey-planet text-hide">爱星人的故事都在这儿</h1>
            <nav class="type-nav i-b-t tac">
                <volist name="categorys" id="category">
                    <if condition="$category.id eq '4'">
                        <a href="__ROOT__/lovelyplanet/lgbt" class="header-top-line lgbt text-hide <if condition='$currenCategory eq lgbt'>active</if>">{$category.name}</a>
                    <elseif condition="$category.id eq '3'"/>
                        <a href="__ROOT__/lovelyplanet/guru" class="header-top-line <if condition='$currenCategory eq guru'>active</if>">{$category.name}</a>
                    <elseif condition="$category.id eq '2'"/>
                        <a href="__ROOT__/lovelyplanet/story" class="header-top-line <if condition='$currenCategory eq story'>active</if>">{$category.name}</a>
                    <elseif condition="$category.id eq '1'"/>
                        <a href="__ROOT__/lovelyplanet/inspired" class="header-top-line <if condition='$currenCategory eq inspired'>active</if>">{$category.name}</a>
                    </if>
                </volist>
            </nav>
            <section class="mt30 c">
                <div class="article-wrap fl">
                    <volist name="list" id="li">
                        <if condition="$li.is_top eq 1">
                            <!-- 推荐文章 -->
                            <article class="top-article pr fs0">
                                <img draggable="false" class="w1" src="{$li.bigpic}" />
                                <section class="pa t0 l0 w1 h1 fs14">
                                    <div class="top-art-con bc pr fcf tac">
                                        <time class="dlb mb20">{$li.createtime|substr=0,10}</time>
                                        <h2 class="fs22 mb5">{$li.title}</h2>
                                        <h3 class="mb20">{$li.subtitle}</h3>
                                        <a href="__ROOT__/lovelyplanet/id/{$li.id}" class="bct">阅读全文</a>
                                    </div>
                                </section>
                            </article>
                        <else />
                            <!-- 文章列表 -->
                            <article class="article-item i-b-t mt20 pt20 c">
                                <a href="__ROOT__/lovelyplanet/id/{$li.id}" class="art-img-wrap ofh fl">
                                    <img draggable="false" class="db" src="{$li.bigpic}" />
                                </a>
                                <section class="w400 bb pr20 fr">
                                    <time class="dlb fc9">{$li.createtime|substr=0,10}</time>
                                    <h2 class="fs22 fc3 mb30 mt15"><a class="w1 ofh dlb" href="__ROOT__/lovelyplanet/id/{$li.id}">{$li.title}</a></h2>
                                    <notempty name="li.author">
                                        <dl class="mb15 fc9">
                                            <dt class="dlb"><if condition="$li.source eq '0'">作者：<else />转载：</if></dt>
                                            <dd class="dlb">{$li.author}</dd>
                                        </dl>
                                    </notempty>
                                    <h3>{$li.subtitle}</h3>
                                </section>
                            </article>
                        </if>
                    </volist>
                    <!-- 分页 -->
                    <div id="paging" class="paging tac fs18 bcf mt20">
                        {$page}
                    </div>
                </div>
                <aside id="artSide" class="article-side bcf fr">
                    <!-- tags -->
                    <!-- <section class="side-tag pb30">
                        <h4 class="fs20 fc3 tac">TAGS</h4>
                        <div>
                            <a>攻略</a>
                            <a>海外</a>
                            <a>场地</a>
                        </div>
                    </section> -->
                    <!-- 宣传 -->
                    <section class="i-b-t pt30 pb30">
                        <figure>
                            <img draggable="false" class="w1" src="http://7xo7hn.com1.z0.glb.clouddn.com/129_thumbnail_1448261362423" />
                        </figure>
                    </section>
                    <!-- 热门文章 -->
                    <section class="side-hot-art i-b-t pt20">
                        <h4 class="fs16 fc3 tac mb10">热门文章</h4>
                        <div>
                            <volist name="listHot" id="hot">
                                <section>
                                    <time class="fc9">{$hot.createtime|substr=0,10}</time>
                                    <h2><a href="__ROOT__/lovelyplanet/id/{$hot.id}">{$hot.title}</a></h2>
                                    <h3 class="fc9">{$hot.subtitle}</h3>
                                </section>
                            </volist>
                        </div>
                    </section>
                    <!-- 分享我的故事 -->
                    <!-- <button class="share-you db bc mt20 fcm bcf ts4" type="button">分享我的故事</button> -->
                </aside>
            </section>
        </section>
    </main>
</block>

<block name="footer-js">
    <script src="__PUBLIC__/Home/js/article.js?20151230"></script>
</block>