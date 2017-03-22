<extend name="Public/base" />

<block name="meta">
    <title>{$title}</title>
    <meta name="author" content="wederfull" />
    <meta name="keywords" content="{$keywords}" />
    <meta name="Copyright" content="wederful.com &copy;" />
    <meta name="description" content="{$description}" />
</block>

<block name="global">
    <script>
        var global = {
            type: '{$categoryName}',
            baseUrl:'__ROOT__/{$area}/'
        };
    </script>
</block>

<block name="css">
    <link rel="stylesheet" href="__PUBLIC__/Home/css/list.css?20151230" />
</block>

<block name="body">
    <body id="body" class="body">
</block>

<block name="main">
    <main class="main mw c">
        <!-- 封面 -->
        <div class="fs0 pr">
            <section class="w1 bc fcf fs14 pa t0 r0 none">
                <div class="list-weather bc c tac">
                    <dl class="fr ml30">
                        <dt>15:00</dt>
                        <dd>当地时间</dd>
                    </dl>
                    <dl class="fr">
                        <dt class="c">
                            <i class="fl weather-icon">图标</i>
                            33 &#176;C&ensp;99 &#176;F
                        </dt>
                        <dd>当地天气</dd>
                    </dl>
                </div>
            </section>
            <img draggable="false" class="fs14 w1" src="{$destinationData.bigpic}" alt="{$destinationData.name}" />
            <img draggable="false" class="middle" src="{$destinationData.smallpic}" alt="{$destinationData.name}" />
        </div>
        <!-- 导航 -->
        <nav id="listNav" class="list-nav mb10 bcf">
            <ul class="wm bc c tac fs16">
                <volist name="ProductCategoryData" id="data">
                    <if condition="$data.is_show eq '1'">
                        <li data-name="category" data-id="{$data.id}" class="ts4 dlb pl15 pr15 ts4 cp <if condition='$data.id eq $categoryId'>active</if>">
                            <if condition="$data.id eq '55'">
                                <a href="__ROOT__/{$area}/venue" class="dlb">{$data.name}</a>
                            <elseif condition="$data.id eq '56'"/>
                                <a href="__ROOT__/{$area}/prewedding" class="dlb">{$data.name}</a>
                            <elseif condition="$data.id eq '56'"/>
                                <a href="__ROOT__/{$area}/wedding" class="dlb">{$data.name}</a>
                            </if>
                        </li>
                    </if>
                </volist>
            </ul>
        </nav>
        <!-- 类型选择 -->
        <!--<div class="list-sel wm bc pb10">
            <div id="listSel" class="bcf pl15 pr15">
                <section class="pt5 c">
                    <h4 class="dlb mr20 fl">特色：</h4>
                    <label class="sel-no active mr30 fl cp">不限</label>
                    <div class="sel-con dlb fl">
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂教</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                    </div>
                    <span class="opt-more fr cp fcm" data-role="open"><span>更多</span><i class="i-arrow i-arr-b ts4 pr"></i></span>
                </section>
                <section class="pt5 c">
                    <h4 class="dlb mr20 fl">特色：</h4>
                    <label class="sel-no active mr30 fl cp">不限</label>
                    <div class="sel-con dlb fl">
                        <label><span><i class="i-arrow i-choice-n pr"></i>5万-10万</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                    </div>
                    <span class="opt-more fr cp fcm" data-role="open"><span>更多</span><i class="i-arrow i-arr-b ts4 pr"></i></span>
                </section>
                <section class="pt5 c">
                    <h4 class="dlb mr20 fl">特色：</h4>
                    <label class="sel-no active mr30 fl cp">不限</label>
                    <div class="sel-con dlb fl">
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                    </div>
                    <span class="opt-more fr cp fcm" data-role="open"><span>更多</span><i class="i-arrow i-arr-b ts4 pr"></i></span>
                </section>
                <section class="pt5 c">
                    <h4 class="dlb mr20 fl">特色：</h4>
                    <label class="sel-no active mr30 fl cp">不限</label>
                    <div class="sel-con dlb fl">
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                        <label><span><i class="i-arrow i-choice-n pr"></i>教堂</span></label>
                    </div>
                    <span class="opt-more fr cp fcm" data-role="open"><span>更多</span><i class="i-arrow i-arr-b ts4 pr"></i></span>
                </section>
            </div>
            <span id="toggleList" data-role="open" class="type-more w80 db pl10 pr10 bc tc bcf fcm lh150 cp"><span>更多条件</span><i class="i-arrow i-arr-b ts4 pr"></i></span>
        </div> -->
        <!-- 选择类型结果 -->
            <!--<div id="filter" class="list-filter active wm bcf bc mb10">
            <div class="ml15 mr15 pt10 c">
                <h4 class="dlb mr20 fl">条件：</h4>
                <ul class="fcf fl">
                    <li class="bcm fl">5-10万<i class="i-arrow i-close pr cp"></i></li>
                </ul>
                <span id="clear" class="clear mb10 fcm cp fl">清除</span>
            </div>
        </div> -->
        <!-- 结果展示 （图片） -->
        <div class="wm bc pt10">
            <!--<div class="fcg mb10">
                <div class="c">
                    <div class="fl">仪式场地：<span>100个</span></div>
                    <div class="fr">
                        排序方式：
                        <ul class="sort dlb">
                            <li class="dlb cp mr10">热门度<i class="i-arrow i-point-t pr"></i></li>
                            <li class="active dlb cp">价格<i class="i-arrow i-poi-b pr"></i></li>
                        </ul>
                    </div>
                </div>
            </div> -->
            <!-- 图片内容 -->
            <div class="c">
                <volist name="productData" id="prodata">
                    <div class="each fl mb20 mr20">
                        <a title="{$prodata.name}" class="img-wrap db ofh pr" href="__ROOT__/{$area}/{$prodata.id}" target="_blank">
                            <img class="h1 ts4" src="{$prodata.thumbnail}" alt="{$prodata.name}" />
                            <div class="pa b0 l0 w1 c fcf fs18">
                                <span class="each-name fl to ml20">{$prodata.name}</span>
                                <span class="fr mr20">￥{$prodata.startPrice}起</span>
                            </div>
                        </a>
                        <div class="img-tip bcf c">
                            <span class="fl ml20 fc3">{$prodata.option}</span>
                            <span class="fr mr20 fcg">{$prodata.vendor.name}</span>
                        </div>
                    </div>
            </volist>
            </div>
        </div>
        <!-- 分页 -->
        <div id="paging" class="paging tac fs18 bcf mt20">
            {$page}
        </div>
    </main>
</block>

<block name="footer-js">
    <script src="__PUBLIC__/Home/js/list-controler.js?20151230"></script>
</block>