/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-12.
 */

;
! function(win, $, undefined) {
    'use strict';
    var $header = $('#header'),
        $content = $('#content'),
        $searchIpt = $header.find('.j-search-ipt'),
        $dataWrap = $content.find('.j-data-wrap'),
        _page_size = 10,
        _next_page = 1,
        _keyword = '',
        _tp_user_html,
        Project = {
            init: function() {
                // 模板字符串处理
                win.$tp = $('#tpUser');
                _tp_user_html = win.$tp.html();
                win.$tp.remove();
                delete win.$tp;
                // 加载第一页数据
                Project.loadData();
            },
            search: function() {
                _next_page = 1;
                $dataWrap.html('');
                _keyword = $.trim($searchIpt.val());
                $content.find('.j-more').add($content.find('.j-empty-tip')).removeClass('t-none');
                Project.loadData();
            },
            loadData: function() {
                win.F.ajax({
                    type: 'POST',
                    data: 'keyword=' + _keyword,
                    url: win.G.get_url.replace('{{page}}', _next_page).replace('{{size}}', _page_size),
                    yes: function(_data) {
                        var _count = _data.data.count;
                        _data = _data.data.data;
                        // 如果没有数据、最后一页，则隐藏“加载更多”
                        if (!_data || (_page_size * (_next_page - 1) + _data.length) >= _count) {
                            $content.find('.j-more').addClass('t-none');
                        }
                        // ((_page_size * (_next_page - 1) + _data.length) >= _count) && $content.find('.j-more').addClass('t-none');
                        if (_data && _data.length) {
                            var _html = [];
                            _data.forEach(function(_d) {
                                _html.push(
                                    _tp_user_html
                                    .replace('{{name}}', _d.householder.name)
                                    .replace('{{status}}', _d.statusLabel)
                                    .replace('{{reason}}', _d.povertyReasonLabel || '未设置')
                                    .replace('{{tel}}', _d.contactPhone)
                                    .replace('{{idcard}}', _d.householder.idcard)
                                    .replace('{{addr}}', _d.addrProvinceLabel + _d.addrCityLabel + _d.addrDistrictLabel + _d.addrTownLabel + _d.addrVillageLabel)
                                    .replace(/{{id}}/g, _d.familyId)
                                );
                            });
                            $dataWrap.append(_html.join(''));
                            (_next_page === 1) && $content.find('.j-empty-tip').addClass('t-none');
                            _next_page++;
                        }
                    }
                });
            }
        };
    Project.init();
    /**
     * event binding
     */
    $content
        .on(win.method, '.j-more', Project.loadData); // 加载更多
    $header
        .on(win.method, '.j-search-btn', Project.search); // 搜索
}(window || this, Zepto);
