<?php
namespace Home\Controller;
use Think\Controller;


class IndexController extends BaseController {
    public function index() {
        // echo deCodeMd5('Linry2015');
        // exit;
        // $info = M('userInfo');
        // $user = M('user');
        // $d = $user->select();
        // foreach ($d as $key => $value) {
        //     $info->data(array('uid'=>$value['id'],'mobile'=>$value['username']))->add();
        // }
        // exit();
        $this->display();
    }

    //留言页面
    public function custom() {
        $this->display();
    }
    //处理留言
    public function customMessage() {
        $arr = I();
        $str = "";
        if ($arr['phone']) {
            if (!preg_match("/1[3458]{1}\d{9}$/", $arr['phone'])) {
                $this->resultMsg('error', '请输入正确的电话号码');
            }
            $str = '<br>手机号：' . $arr['phone'];
        }
        if ($arr['email']) {
            if (!preg_match("/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]{2,4}/", $arr['email'])) {
                $this->resultMsg('error', '请输入正确邮箱');
            }
            $str = '<br>邮箱：' . $arr['email'];
        }
        if ($arr['weixin']) {
            $str = '<br>微信：' . $arr['weixin'];
        }
        if (!$arr['name']) {
            $this->resultMsg('error', '请输入名字');
        }
        $customMessage = M('CustomMessage');
        $arr['createtime'] = date('Y-m-d H:i:s');
        $customMessage->data($arr)->add();
        sendMail('hi@wederful.com', 'wederful用户定制留言', '用户名：' . $arr['name'] . '<br>目的地：' . $arr['destination'] . '<br>期待婚礼类型：' . $arr['type'] . '<br>亲友人数：' . $arr['number'] . $str);
        $this->resultMsg('success', '提交成功');
    }

    public function fullpage(){
        $this->display();
    }

    /**
     * [updateRate 实时更新汇率]
     * @return [type] [description]
     */
    public function updateRate(){
        $rate = usdtosnyApi();
        $system = M('system_seting');
        $where = array('name'=>'rate');
        $system->where($where)->data(array('value'=>$rate))->save();
        $this->resultMsg('success', '更新汇率成功');
    }

}
