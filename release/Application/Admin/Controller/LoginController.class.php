<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;

class LoginController extends Controller {
    public function index() {
        if(is_admin()){
          redirect(U('Index/index'));
        }
        $this->display();
    }
    /**
     * [doLogin 处理登录]
     * @return [type] [json]
     */
    public function doLogin() {
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $password = deCodeMd5($arr['password']);
        $username = $arr['username'];

        $where = array(
            'username' => $username
        );
        $table = D('user');
        if (!$table->create($arr)) {
            // 对data数据进行验证
            return $this->resultMsg('error', $table->getError());
        }
        $user = $table->where($where)->find();
        if (!$user) {
            return $this->resultMsg('error', '用户名不存在');
        }
        if ($user['password'] != $password) {
            return $this->resultMsg('error', '密码错误请重新登陆');
        }
        if ($user['lock']) {
            return $this->resultMsg('error', '用户被锁定');
        }
        if ($user['roles'] != '1') {
            return $this->resultMsg('error', '对不起，您不是管理员！');
        }
        session('aid', $user['id']);
        return $this->resultMsg('success', '登录成功！');
    }

  /**
   * [resultMsg 公共信息返回]
   * @param  [type] $status [返回状态,success或error]
   * @param  [type] $msg    [返回消息]
   * @param  string $data   [返回值]
   * @return [type]         [json]
   */
    Public function resultMsg($status, $msg, $data = '') {
        $array['status'] = $status;
        $array['message'] = $msg;
        $array['data'] = $data;
        $this->ajaxReturn($array, 'json');
    }

    /**
     * [logout 退出登录]
     * @return [type] [跳转登录页]
     */
    public function logout() {
        //卸载SESSION
        session_unset();
        session_destroy();
        redirect(U('Login/index'));
    }
}
