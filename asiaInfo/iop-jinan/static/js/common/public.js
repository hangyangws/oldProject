;
! function(g, $, undefined) {
    'use strict';
    var Project = {
        init: function() {
            // 图标背景
            var _bg = 'url(./static/img/{{imgname}}) no-repeat 50% 50%/80%';
            $('#side').find('.j-s-icon').each(function(i, $e) {
                $e = $($e);
                $e.css({
                    background: _bg.replace('{{imgname}}', $e.data('imgname'))
                });
            });

            // 表格分页模拟
            Project.pagination($('#tablePagination'));
        },
        pagination: function($dom) {
            $dom.pagination({
                totalData: 100, // 数据总条数
                showData: 10, // 每页显示的条数
                current: 6, // 当前第几页
                prevCls: 'table-p-prev', // 
                nextCls: 'table-p-next', // 下一页class
                prevContent: '<', // 上一页节点内容
                nextContent: '>', // 下一页节点内容
                activeCls: 'table-p-active', // 当前页选中状态class名
                count: 1, // 当前选中页前后页数
                coping: true, // 是否开启首页和末页，值为boolean
                keepShowPN: true, // 是否一直显示上一页下一页
                isHide: true, // 总页数为0或1时隐藏分页控件
                // jump: false, //  是否开启跳转到指定页数，值为boolean类型
                // jumpIptCls: 'jump-ipt', // 文本框内容
                // jumpBtnCls: 'jump-btn', // 跳转按钮class

                // pageCount: 9, // 总页数
                // endPage: '', // 尾页节点内容， 默认为空
                // homePage: '', // 首页节点内容， 默认为空
                jumpBtn: '跳转', // 跳转按钮文本内容
                callback: function(api) { // 回调函数，参数 "index"为当前页
                    // api.getPageCount() // 获取总页数
                    // api.setPageCount(page) // page：页数，设置总页数
                    // api.getCurrent() // 获取当前页
                    // api.filling() // 填充数据，参数为页数
                }
            });
        }
    };

    /**
     * 项目初始化
     */
    Project.init();
}(window || this, jQuery);
