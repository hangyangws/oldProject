<extend name="Public/base" />

<block name="meta">
    <title>Wederful海外婚礼_婚纱摄影_蜜月旅行网站</title>
    <meta name="author" content="wederfull" />
    <meta name="keywords" content="wederful,海外婚礼,旅行结婚,蜜月旅行,国外婚礼,海外婚纱摄影" />
    <meta name="Copyright" content="wederful.com &copy;" />
    <meta name="description" content="Wederful.com-最专业的海外婚礼定制平台,发现并预定全世界独一无二的婚礼场地、教堂、海岛、婚礼拍摄、婚纱照拍摄、化妆造型、旅拍、航拍、蜜月、纪念日等多种服务，专业的婚嫁社区为您的决策提供帮服务热线：400-070-2080" />
</block>

<block name="css">
    <link rel="stylesheet" href="__PUBLIC__/Home/css/index.css?20151230" />
</block>

<block name="body">
    <body id="body" class="body">
</block>

<block name="main">
    <main id="main" class="main">
        <!-- 首图轮播 -->
        <section id="hyRoll" class="hy-roll w1 pr ofh">
            <ul class="hy-roll-wrap db w1 h1 pr">
                <!-- roll-0 的数字要有规律 默认第一个为active -->
                <li class="roll-0 w1 h1 pa t0 l0 ts8 active">
                    <hgroup class="ts4 tac">
                        <h2 class="font-married text-hide mb15">走，去结婚 重新定义婚礼体验</h2>
                        <a href="{:U('Home/Index/fullpage')}" target="_blank" class="fc6 fs18">查看详情<span class="arial dlb ml10">&gt;</span></a>
                    </hgroup>
                </li>
            </ul>
            <nav class="hy-roll-nav w1 pa l0 b0 tac pt30 pb10 z3">
                <!-- data-i 应 hy-roll-wrap的li 数组下标 默认第一个为active -->
                <a class="ts4 active" data-i="0"></a>
            </nav>
            <span class="roll-nav-prev ts4 l0 z3 cp"></span>
            <span class="roll-nav-next ts4 r0 z3 cp"></span>
        </section>
        <!-- 基本概况 -->
        <section class="i-bcm">
            <div class="i-wm bc tac">
                <ul class="base-tag pt20 pb20 c">
                    <li class="fl">
                        <i class="i-mainIcon i-m-camera"></i>
                        <span>
                            全球婚礼元素自由结合
                        </span>
                    </li>
                    <li class="fl">
                        <i class="i-mainIcon i-m-heart"></i>
                        <span>
                            直采优选，拒绝低俗
                        </span>
                    </li>
                    <li class="fl">
                        <i class="i-mainIcon i-m-price"></i>
                        <span>
                            绕开中介，最低价格保证
                        </span>
                    </li>
                    <li class="fl">
                        <i class="i-mainIcon i-m-user"></i>
                        <span>
                            垂直社群，用户点评，真实客片
                        </span>
                    </li>
                </ul>
                <!-- 纯数字 -->
                <!-- <ul class="base-num pt20 pb20 c">
                    <li class="fl">
                        <em class="font-light">380</em>
                        个海外场地
                    </li>
                    <li class="fl">
                        <em class="font-light">293</em>
                        个服务商
                    </li>
                    <li class="fl">
                        <em class="font-light">429</em>
                        对新人
                    </li>
                </ul> -->
                <div class="people-num"></div>
            </div>
        </section>
        <!-- 地区入口 -->
        <section class="each-item">
            <h2 class="font-choice text-hide">甄选，精选，只为动情时刻 选择心仪婚礼地区</h2>
            <figure class="each-wrap area-enter c">
                <a href="{:U('/bali')}" data-w="3">
                    <img src="__PUBLIC__/Home/images/area/Bali.jpg" alt="巴厘岛 BALI" />
                    <div class="ts4">
                        <hgroup>
                            <h3 class="ts4">巴厘岛</h3>
                            <h3 class="ts4 fs20">BALI</h3>
                        </hgroup>
                    </div>
                </a>
                <a href="{:U('/maldive')}" data-w="1">
                    <img src="__PUBLIC__/Home/images/area/Maldives.jpg" alt="马尔代夫 MALDIVES" />
                    <div class="ts4">
                        <hgroup>
                            <h3 class="ts4">马尔代夫</h3>
                            <h3 class="ts4 fs20">MALDIVES</h3>
                        </hgroup>
                    </div>
                </a>
                <a href="{:U('/australia')}" data-w="1" data-dir="center">
                    <img src="__PUBLIC__/Home/images/area/Australia.jpg" alt="澳大利亚 AUSTRALIA" />
                    <div class="ts4">
                        <hgroup>
                            <h3 class="ts4">澳大利亚</h3>
                            <h3 class="ts4 fs20">AUSTRALIA</h3>
                        </hgroup>
                    </div>
                </a>
                <a href="{:U('/thailand')}" data-w="1">
                    <img src="__PUBLIC__/Home/images/area/Thailand.jpg" alt="泰国 THAILAND" />
                    <div class="ts4">
                        <hgroup>
                            <h3 class="ts4">泰国</h3>
                            <h3 class="ts4 fs20">THAILAND</h3>
                        </hgroup>
                    </div>
                </a>
                <a href="{:U('/japan')}" data-w="1">
                    <img src="__PUBLIC__/Home/images/area/Japan.jpg" alt="日本 JAPAN" />
                    <div class="ts4">
                        <hgroup>
                            <h3 class="ts4">日本</h3>
                            <h3 class="ts4 fs20">JAPAN</h3>
                        </hgroup>
                    </div>
                </a>
                <a href="{:U('/unitedkingdom')}" data-w="2" data-dir="right">
                    <img src="__PUBLIC__/Home/images/area/Unitedkingdom.jpg" alt="英国 UNITED KINGDOM" />
                    <div class="ts4">
                        <hgroup>
                            <h3 class="ts4">英国</h3>
                            <h3 class="ts4 fs20">UNITED KINGDOM</h3>
                        </hgroup>
                    </div>
                </a>
            </figure>
        </section>
        <!-- 促销 -->

        <!-- 用户反馈 -->
        <section class="each-item item-nav user-feedback">
            <h2 class="font-feedback text-hide">真实用户反馈</h2>
            <div class="each-wrap ofh">
                <section class="feedback-wrap roll-nav-wrap fcf c" data-min="2">
                    <article>
                        <a>
                            <img draggable="false" src="__PUBLIC__/Home/images/user/1.jpg" />
                            <span>天山派的小师姐</span>
                        </a>
                        <p>当和老公决定去巴厘岛结婚之后，看了不少婚礼攻略，也咨询了几家婚庆公司，总觉得大同小异，朋友介绍了Wederful，没想到这个平台有这么多类型的场地，而且价格很合理，毫不犹豫的就定了今年年底的婚礼。这个过程中，客服MM一直很耐心的解答我的问题，给我们很踏实的感觉。</p>
                    </article>
                    <article>
                        <a>
                            <img draggable="false" src="__PUBLIC__/Home/images/user/3.jpg" />
                            <span>使街Joan</span>
                        </a>
                        <p>看了周董在塞尔比教堂的婚礼，彻底不淡定了。随即开始在网上找合适的婚庆公司，结果兜了一圈发现，国内90%都是跑巴厘岛，英国的非常少。好不容易找到一家，结果报价贵的离谱，实在不能接受，没想到Wederful居然可以直接预订，而且价格很划算，婚礼+拍摄办下来只要3万多。已经和老公预订了11月的婚礼，现在就等签证了。</p>
                    </article>
                    <article>
                        <a>
                            <img draggable="false" src="__PUBLIC__/Home/images/user/4.jpg" />
                            <span>Katherine_Zhang</span>
                        </a>
                        <p>Wederful的同学真的太敬业了，之前定了马尔代夫香格里拉的婚礼和摄影，但后来临时改成我们的摄影师好友随行一起去马代帮我们拍婚纱照，眼看着免费取消时间就要到了，客服却加班帮我们改了订单，不仅节约了一大笔违约费用，还免费提供了2个拍摄场地给我们。太赞啦</p>
                    </article>
                    <article>
                        <a>
                            <img draggable="false" src="__PUBLIC__/Home/images/user/2.jpg" />
                            <span>利全先生</span>
                        </a>
                        <p>在Zank看到Wederful的海外婚姻注册服务，这应该是国内第一家提供同志婚礼的平台吧。抱着试一试的态度与客服取得联系，没想到客服非常耐心的帮我们解答了很多问题，还提供了两个方案选择。我们预定了明年新西兰的婚礼仪式，Wederful确实是一个非常多元化和人性化的婚礼品牌。</p>
                    </article>
                </section>
            </div>
            <nav class="roll-nav nav-white">
                <a data-i="0" class="ts4 active"></a>
                <a data-i="1" class="ts4"></a>
            </nav>
        </section>
        <!-- 媒体报道 -->
        <section class="each-item item-nav i-bcm">
            <h2 class="font-media text-hide">媒体报道</h2>
            <div class="each-wrap ofh">
                <section class="media-reports roll-nav-wrap c" data-min="2">
                    <article>
                        <a>
                            <img draggable="false" src="__PUBLIC__/Home/images/media/lieyun.png" />
                        </a>
                        <p>结婚对于中国人来说向来是件大事，大大小小的婚庆公司从来不缺，婚庆O2O也已经兴起一段时间。随着海外婚礼逐渐进入公众视线，一个名为Wederful的境外旅行+婚庆的垂直产品诞生了。创始人王颜告诉猎云网：“几年前就很流行在国外拍摄婚纱照，但用户获得这些婚礼服务只能通过国内中介公司，而传统婚庆行业的问题有两个，一是套餐打包售价，比如用户无法自带摄像师，二是暴利，这主要是由于信息不对称，用户很难获知国外婚庆服务的相关资费，只能任由中介公司宰割。</p>
                    </article>
                    <article>
                        <a>
                            <img draggable="false" src="__PUBLIC__/Home/images/media/xinming.png" />
                        </a>
                        <p>Wederful平台汇聚全球优质婚礼场地、摄影师、造型师，以及用户所需的相关婚礼服务产品。用户可根据清晰详尽的商品信息，方便快捷的进行海外婚礼各环节的在线预订及支付。与传统婚庆不同，Wederful坚持直采全球资源、去掉中间环节、不设传统线下形象店，把以往附加在用户身上的隐形消费彻底释放，以最直接、最透明、最高效的方式服务用户。</p>
                    </article>
                </section>
            </div>
            <nav class="roll-nav">
                <a data-i="0" class="ts4 active"></a>
            </nav>
        </section>
        <!-- 合作伙伴 -->
        <section class="each-item">
            <h2 class="font-cooperation text-hide">我们的合作伙伴</h2>
            <div class="each-wrap partners c">
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/01.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/02.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/03.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/04.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/05.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/06.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/07.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/08.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/09.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/10.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/11.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/12.jpg" /></a>
                <a><img draggable="false" src="__PUBLIC__/Home/images/cooperation/13.jpg" /></a>
            </div>
        </section>
    </main>
</block>

<block name="footer-js">
    <script src="__PUBLIC__/Home/js/index-controler.js?20151230"></script>
</block>