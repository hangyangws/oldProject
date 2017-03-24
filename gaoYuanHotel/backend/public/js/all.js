/**
 * Pj 后台管理 projet
 * fj in 2015-11-02
 */

var $allWrap = $('#allWrap'),
    $mask = $('#mask'),
    Pj = {
        // 日期选择框初始化
        inputDate: function($wrap) {
            var $input_date = $wrap.find('.input-date'),
                _input_date_l = $input_date.length,
                _p = {
                    calendarOffset: {
                        x: 0,
                        y: -1
                    },
                    zIndex: 1
                };
            // 渲染日期插件
            while (_input_date_l--) {
                $input_date.eq(_input_date_l).glDatePicker(_p);
            };
        },
        // 富文本编辑
        inputText: function(_img) {
            var _edit = [],
                $edit = $('.edit-dom'),
                _edit_l = $edit.length,
                _toolbar = [
                    // 'image',
                    'link',
                    'bold',
                    'title',
                    'italic',
                    'underline',
                    'strikethrough',
                    'color',
                    'ol', // ordered list
                    'ul', // unordered list
                    'blockquote', // 块引用
                    //'code',           // code block
                    'table',
                    // 'hr', // horizontal ruler
                    // 'indent',
                    // 'outdent',
                    'alignment'
                ];
            _img && _toolbar.unshift('image');
            if (_edit_l > 0) {
                while (_edit_l--) {
                    if (!($edit.eq(_edit_l).parent().is('.simditor-wrapper'))) {
                        _edit[_edit_l] = new Simditor({
                            textarea: $edit[_edit_l],
                            toolbar: _toolbar, //工具栏
                            defaultImage: 'http://7xo7hn.com1.z0.glb.clouddn.com/article_uploadI_img.png',
                            upload: {
                                url: global.uploadUrl, //文件上传的接口地址
                                // params: null, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
                                // fileKey: 'fileDataFileName', //服务器端获取文件数据的参数名
                                connectionCount: 1,
                                leaveConfirm: '正在上传图片 确认要离开'
                            },
                            toolbarFloat: false // 工具条不固定浏览器头部
                        });
                    };
                };
            };
        },
        imgDel: function($this) {
            var $p = $this.parent(), // figure
                $add = $p.parent().find('.add-img');
            $p.hide(400, function() {
                $p.remove();
                ($add.data('num') !== 'infinity') && $add.show(400);
            });
        },
        onlyNum: function($this, e) {
            // 四个方向键 delete 回车 backspace
            if ([37, 38, 39, 40, 46, 13, 8].indexOf($.getK(e)) !== -1) {
                return;
            };
            $this.val($this.val().replace(/\D/gi, ''));
        },
        onlyPrice: function($this, e) {
            // 四个方向键 delete 回车 backspace
            if ([37, 38, 39, 40, 46, 13, 8].indexOf($.getK(e)) !== -1) {
                return;
            };
            $this.val($this.val().replace(/[^\d.]/gi, ''));
        },
        getDate: function() {
            var date = new Date(),
                _return_date = [date.getFullYear()],
                month = date.getMonth() + 1,
                day = date.getDate();
            _return_date.push(month < 10 ? ('0' + month) : month);
            _return_date.push(day < 10 ? ('0' + day) : day);
            return _return_date.join('-');
        }
    };

// input 只能输入数字
$allWrap.on('keyup', '.only-num', function(e) {
    Pj.onlyNum($(this), e);
});

$mask.on('keyup', '.only-num', function(e) {
    Pj.onlyNum($(this), e);
});

// input 只能输入价格
$allWrap.on('keyup', '.only-price', function(e) {
    Pj.onlyPrice($(this), e);
});

$mask.on('keyup', '.only-price', function(e) {
    Pj.onlyPrice($(this), e);
});

// 侧边栏导航
$('#mainNav').on('click', '.nav-dir', function() {
    $(this).closest('li').toggleClass('active');
});

// 列表页输入框回车
$allWrap.on('keyup', '.search-list', function(e) {
    $.getK(e) === 13 && $(this).next().trigger('click');
});

// 图片删除
$allWrap.on('click', '.img-del', function() {
    Pj.imgDel($(this));
});

// 删除临时节点
$allWrap.on('click', '.del-temp-dom', function() {
    $(this).parent().remove();
});
