<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;

class BaseController extends Controller {
	/**
	 * [_initialize 初始化函数]
	 * @return [type] [description]
	 */
	public function _initialize () {
		if($uid = is_admin()){
	       	$db = D('Admin/UserView');
		 	$user = $db->getUser($uid);
		    if ($user['is_lock']) {
	            return $this->error('用户被锁定');
	        }
	        if ($user['roles'] != '1') {
	            return $this->error('对不起，您不是管理员！',U('Login/index'));
	        }
	        session('user',$user);
		}else{
			$this->redirect('Login/index');
		}
	}

	public function _empty() {
        header("HTTP/1.0 404 Not Found");
        $this->display('Public:404');
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

}
