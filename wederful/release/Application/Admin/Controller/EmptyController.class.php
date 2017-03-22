<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;
class EmptyController extends Controller {
    function _empty() {
        header("HTTP/1.0 404 Not Found");
        $this->display('Public:404');
    }
    // 404
    function index() {
        header("HTTP/1.0 404 Not Found");
        $this->display('Public:404');
    }
}
