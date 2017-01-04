<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Home\Controller;
use Think\Controller;

class BaseController extends Controller {
	/**
	 * [_initialize 初始化函数]
	 * @return [type] [description]
	 */
	public function _initialize () {
		if($uid = is_login()){
	       	$db = D('Admin/UserView');
		 	$user = $db->getUser($uid);
		    if ($user['is_lock']) {
	            return $this->error('用户被锁定');
	        }
	        $this->assign('user', $user);
		}
	}

 /**
   * [resultMsg 公共信息返回]
   * @param  [type] $status [返回状态,success或error]
   * @param  [type] $msg    [返回消息]
   * @param  string $data   [返回值]
   * @return [type]         [json]
   */
    public function resultMsg($status, $msg, $data = '') {
        $array['status'] = $status;
        $array['message'] = $msg;
        $array['data'] = $data;
        $this->ajaxReturn($array, 'json');
    }


    public function _empty() {
        header("HTTP/1.0 404 Not Found");
        $this->display('Public:404');
    }

}
