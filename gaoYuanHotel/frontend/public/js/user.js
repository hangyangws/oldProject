/**
 * [created by hangyangw in 2016-03-21]
 * @return {[User]} [Object]
 */
;
! function($) {
    var $nav = $('#nav'),
        $userInfo = $('#userInfo'),
        $conDon = {
            unpay: $('#unpay'), // 待付款
            paied: $('#paied'), // 待入住
            done: $('#done') // 已完成
        },
        $navAll = $('#nav').find('a'),
        $conAll = $('#conWrap').find('.each-item'),
        _tp = {
            unpay: $('#unpay-tp').html(),
            paied: $('#paied-tp').html(),
            done: $('#done-tp').html()
        },
        _is_ok = {},
        User = {
            init: function() {
                // 根据hash 获取相应数据
                var _p = ~~location.href.slice(location.href.lastIndexOf('=') + 1);
                User.toggleNav($navAll.eq(_p));
            },
            toggleNav: function($this) {
                var _id = $this.data('id'),
                    _type = $this.data('type');
                $conAll.addClass('none');
                $conDon[_id].removeClass('none');
                $navAll.removeClass('active');
                $this.addClass('active');
                if (!_is_ok[_id]) {
                    $.ajax({
                        url: '/user/orders?orderstatus=' + _type,
                        dataType: 'json',
                        success: function(_d) {
                            if (_d.msg === '获取数据成功') {
                                var _list = _d.data.data.list,
                                    _l = _list.length,
                                    _temp = [];
                                $this.find('span').html(_l);
                                while (_l--) {
                                    _temp.push(
                                        _tp[_id]
                                        .replace(/\${roomorderid}/g, _list[_l].roomorderid)
                                        .replace(/\${roomordersn}/g, _list[_l].roomordersn)
                                        .replace(/\${tempImagepath}/g, _list[_l].tempImagepath)
                                        .replace(/\${indate}/g, _list[_l].indate)
                                        .replace(/\${outdate}/g, _list[_l].outdate)
                                        .replace(/\${totalprice}/g, _list[_l].totalprice)
                                        .replace(/\${brandname}/g, _list[_l].brandname)
                                        .replace(/\${hotelname}/g, _list[_l].hotelname)
                                        .replace(/\${roomname}/g, _list[_l].roomname)
                                        .replace(/\${betweendays}/g, _list[_l].betweendays)
                                        .replace(/\${refundstatus}/g, _list[_l].refundstatus)
                                    );
                                }
                                $conDon[_id].find('.data-wrap').html(_temp.join(''));
                            } else {
                                $conDon[_id].find('.loading').html(_d.msg);
                            }
                            _is_ok[_id] = true;
                        },
                        error: function() {
                            layer.open({
                                content: '网络堵塞'
                            });
                        }
                    });
                }
            }
        };
    // 项目初始化
    User.init();
    // 导航点击
    $nav.on('tap', 'a', function() {
        User.toggleNav($(this));
    });
    // 积分查看
    $userInfo.on('tap', '.point', function() {
        layer.open({ content: '获取积分列表…' });
        location.href = $(this).data('href');
    });
}(Zepto);
