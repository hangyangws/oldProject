<extend name="Public/base" />

<block name="meta">
	<title>私人定制 - wederful</title>
	<meta name="author" content="wederfull" />
    <meta name="keywords" content="Wederful,海外婚礼,海外婚礼场地,海外婚礼旅拍" />
    <meta name="Copyright" content="wederful.com &copy;" />
    <meta name="description" content="国内首家海外婚礼垂直电商,提供海外婚礼场地、全球知名婚礼及旅拍摄影师、海外婚礼团队住宿、交通服务、当地游活动及婚礼装扮等服务预定。DIY 海外婚礼,从此变得很简单。" />
</block>

<block name="css">
    <link rel="stylesheet" href="__PUBLIC__/Home/css/custom.css?20151230" />
</block>

<block name="global">
    <script>
        var global = {
            customMessageUrl:'{:U("Index/customMessage")}',
            imgUrl: '__PUBLIC__/Home/images/'
        };
    </script>
</block>

<block name="body">
    <body id="body" class="header-fixed footer-none func-top-none body">
</block>

<block name="main">
    <main id="main" class="main db fcf tac">
        <section class="main-wrap pr">
            <!-- welcome -->
            <img src="__PUBLIC__/Home/images/WeddingPlan.png" />
            <!-- main-form -->
            <div class="form-wrap">
                <h1 class="form-title fs20">这将是美好的开始，留下你的想法吧?</h1>
                <div class="form-con bc tal">
                    <label class="form-each">
                        <span>姓名：</span>
                        <input class="input-item" data-need="true" name="name" type="text" autofocus="autofocus" />
                    </label>
                    <label class="form-each">
                        <span>目的地（如无可不填）：</span>
                        <input class="input-item" name="destination" type="text" />
                    </label>
                    <label class="form-each">
                        <span>期待婚礼类型（教堂，草坪，海边等）：</span>
                        <input class="input-item" name="type" type="text" />
                    </label>
                    <label class="form-each">
                        <span>亲友人数（如不确定可以不填）：</span>
                        <input class="input-item" name="number" type="text" />
                    </label>
                    <div class="form-each">
                        <span>希望以那种方式联系您？</span>
                        <div class="contact-wrap">
                            <div class="contact dlb cd pr">
                                <span><em class="contact-name">电话</em>&ensp;<i class="i-arrow dlb"></i>：</span>
                                <ul class="contact-choice ofh pa l0 bcf fc6 tac">
                                    <li data-name="phone" class="contact-type ts4">电话</li>
                                    <li data-name="email" class="contact-type ts4">邮箱</li>
                                    <li data-name="weixin" class="contact-type ts4">微信</li>
                                </ul>
                            </div>
                            <input class="input-item contact-input" data-need="true" name="phone" type="text" placeholder="请输入电话" />
                        </div>
                    </div>
                </div>
                <button class="form-submit ts4" type="button">提交</button>
            </div>
        </section>
    </main>
</block>

<block name="footer-js">
    <script src="__PUBLIC__/Home/js/custom-controler.js?20151230"></script>
</block>