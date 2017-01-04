"use strict";
// 场地 初始化
project.site_ini();

// 窗口大小改变事件(共用)
$(window).resize(function() {
    project.resize();
});

// 上一张
$('#miniPrev').bind('click', function() {

    project.p_img();
});
$('#mask').delegate('#miniOPrev', 'click', function() {

    project.p_img_m();
});
$(document).keyup(function(e) {
    var e = e || window.event;
    if (e.keyCode === 37) {
        project.p_img_m();
    }
    if (e.keyCode === 39) {
        project.n_img_m();
    }
});
// 下一张
$('#miniNext').bind('click', function() {

    project.n_img();
});
$('#mask').delegate('#miniONext', 'click', function() {

    project.n_img_m();
});
// 关闭图片窗口
$('#mask').delegate('#miniExit', 'click', function() {

    $.showMask(false);
});

// 放大图片
$('#miniCW').bind('click', function(e) {
    var e = e || window.event,
        elem = e.srcElement || e.target;
    if (elem.id === 'miniCW') {
        project.zIn();
    }
});


// 套餐收藏/取消收藏
$('#sitePack .like-pack').bind('click', function() {

    project.fav($(this));
});

// 套餐展开事件
$('.open-pack, .open-pack2').bind('click', function() {

    project.togglePack($(this));
});

// 选择人数展开
$('#sitePack .per-choice').bind('click', function() {

    project.openPerson($(this));
});

// 确定选择人数
$('#sitePack .per-list li').bind('click', function() {

    project.okPerson($(this));
});

// 增值服务选择
$('#sitePack .p-m-add').bind('change', function() {

    project.exSer($(this));
});

$('#sitePack .p-o-apply').bind('click', function() {

    project.inOrder($(this));
});


// 其他推荐
$('#carouselOtherP').bind('click', function() {

    project.pre();
});

$('#carouselOtherN').bind('click', function() {

    project.next();
});

// 页脚微信点击
// 绑定取消选择人事件
$('#weixin').bind('click', function() {

    $(this).find('.wdf-wx').toggleClass('active');
});
$(document).bind('click', function(e) {
    var e = e || window.event,
        elem = e.srcElement || e.target,
        weixin = false,
        per = false;
    while (elem) {
        if (!weixin) {
            weixin = $(elem).attr('id') === 'weixin' ? true : false;
        }
        if (!per) {
            per = $(elem).attr("data-role") === 'person' ? true : false;
        }
        elem = elem.parentNode;
    }
    if (!weixin) {
        $('#weixin .wdf-wx').removeClass('active');
    }
    if (!per) {
        project.cancelPerson();
    }
});
