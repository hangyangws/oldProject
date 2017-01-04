/**
 * Pj 后台管理 projet
 * fj in 2015-11-02
 */

var $allWrap = $('#allWrap'),
    $mask = $('#mask');
var Pj = (function() {
    "use strict";
    return {
        // 日期选择框初始化
        inputDate: function($wrap, _type) {
            var $input_date = $wrap.find('.input-date'),
                _input_date_l = $input_date.length,
                $now,
                $next,
                _p = {
                    calendarOffset: {
                        x: 0,
                        y: -1
                    },
                    zIndex: 1
                };
            if (_type === 'restart') {
                $('.gldp-default').remove();
                while (_input_date_l--) {
                    if ($input_date.eq(_input_date_l).is('.gldp-el')) {
                        $now = $input_date.eq(_input_date_l);
                        $next = $now.removeClass('gldp-el').removeAttr('gldp-id').clone();
                        $now.hide();
                        $now.after($next)
                            .next()
                            .glDatePicker(_p);
                        $now.remove();
                    } else {
                        $input_date.eq(_input_date_l).glDatePicker(_p);
                    };
                };
            } else {
                while (_input_date_l--) {
                    $input_date.eq(_input_date_l).glDatePicker(_p);
                };
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
        // 七六文件上传
        qiNiu: function() {
            var $addImg = $allWrap.find('.add-img'),
                _addImg_l = $addImg.length,
                // _img_type = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'ico'],
                _addImg_option = {
                    runtimes: 'html5,flash,html4',
                    //上传选择的点选按钮 id 字符串
                    browse_button: '',
                    uptoken_url: global.qiniuUploadTokenUrl,
                    domain: '7xo7hn.com1.z0.glb.clouddn.com',
                    max_file_size: '200mb',
                    max_retries: 3,
                    //分块上传时，每片的体积
                    chunk_size: '8mb',
                    //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    auto_start: true,
                    init: {
                        BeforeUpload: function(up, file) {
                            // 上传前

                            // 后缀名检测
                            // var _name = file.name;
                            // var _suffix= _name.slice(_name.lastIndexOf('.') + 1).toLowerCase();
                            // if (_img_type.indexOf(_suffix) === -1) {
                            //     // $.remaind('只能上传 jpg, jpeg, gif, png, bmp, ico 格式 的图片');
                            //     // 取消上传 待测试
                            // };
                        },
                        FileUploaded: function(up, file, info) {
                            // 获取上传成功后的文件的Url
                            var sourceLink = 'http://' + up.getOption('domain') + '/' + JSON.parse(info).key,
                                $nowButton = $(up.settings.browse_button[0]),
                                _input_name = $nowButton.data('name'); // input:hidden 的 name

                            $nowButton.data('num') === 'infinity' && (
                                _input_name += '[]'
                            );

                            $nowButton.before('<figure class="load-img-wrap">' +
                                '<img src="' + sourceLink + '" />' +
                                '<input type="hidden" name="' + _input_name + '" value="' + sourceLink + '" />' +
                                '<span class="qiniu-img-del">x</span>' +
                                '</figure>');

                            // 非无限上传图片 删除上传按钮 和 七牛生成的div
                            $nowButton.data('num') !== 'infinity' && (
                                $nowButton.next().andSelf().hide(400)
                            );
                        },
                        Error: function(up, err, errTip) {
                            $.remaind(errTip, true);
                        },
                        Key: function(up, file) {
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            return $(up.settings.browse_button[0]).data('rule') === 'random' ? (new Date().getTime() + ~~(Math.random() * 1000)) : (global.projectId + '_' + $(up.settings.browse_button[0]).data('name') + '_' + new Date().getTime());
                        }
                    }
                },
                qiNiuObj = [],
                qiNiuExa = [],
                _addImg_option_t = [];
            if (_addImg_l > 0) {
                while (_addImg_l--) {
                    // 给add-img 加上id addImg
                    $addImg.eq(_addImg_l).attr('id', 'addImg' + _addImg_l);

                    // 新的 option
                    _addImg_option_t[_addImg_l] = $.cloneObj(_addImg_option);
                    _addImg_option_t[_addImg_l].browse_button = 'addImg' + _addImg_l;

                    // new 一个新的 七牛对象
                    qiNiuObj[_addImg_l] = new QiniuJsSDK();
                    qiNiuExa[_addImg_l] = qiNiuObj[_addImg_l].uploader(_addImg_option_t[_addImg_l]);
                };
            };
        },
        qiniuImgDel: function($this) {
            var $p = $this.parent(), // figure
                $add = $p.parent().find('.add-img');
            $p.hide(400, function() {
                $p.remove();
                $add.data('num') !== 'infinity' && (
                    // 大图 缩略图
                    $add.show(400)
                );
            });
        },
        /**
         * [tip 所有错误提示]
         * @param  o   [参数对象]
         * @param  o.d [错误节点]
         * @param  o.t [错误内容]
         * @param  o.s [错误状态 true-> 红色, false-> 正常色]
         */
        tip: function(o) {
            o.d.css('color', o.s ? '#f00' : '#bdb099').html(o.t);
        }
    };
})();

// 侧边栏导航
$('#mainNav').on('click', '.nav-dir', function() {
    $(this).closest('li').toggleClass('active');
});

// 列表页输入框回车
$allWrap.on('keyup', '.search-list', function(e) {
    e = e || window.e;
    e.keyCode === 13 && $(this).next().trigger('click');
});

// 七牛图片删除
$allWrap.on('click', '.qiniu-img-del', function() {
    Pj.qiniuImgDel($(this));
});

// 删除临时节点
$allWrap.on('click', '.del-temp-dom', function() {
    $(this).parent().remove();
});
