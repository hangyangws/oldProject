<?php
namespace Home\Controller;
use Think\Controller;
use Common\Tools\Sms;

class LoginController extends Controller {

    /**
     * 处理登陆页
     */
    public function login(){
        $password = deCodeMd5(I('password',''));
        $username = I('username');
        $where = array('username' =>$username);
        $table = M('user');
        $user = $table->where($where)->find();
        if($user['password']!=$password){
            $this->resultMsg('error','账号或密码错误');
        }
        if ($user['lock']) {
            $this->resultMsg('error','用户被锁定！');
        }
        session('uid', $user['id']);
        $this->resultMsg('success','登录成功！');
    }

    /**
     * [forget 忘记密码]
     */
    public function forget(){
        $mobile = I('username','');
        $password = deCodeMd5(I('password',''));
        $code = I('code','null');
        $table = M('mobileVerifyRecord');
        $where = array('mobile' =>$mobile,'type'=>1);
        $result = $table->where($where)->order('created desc')->find();
        if($result['code']!=$code){
            $this->resultMsg('error','验证码不正确');
        }
        $nowTime = date('Y-m-d H:i:s',time());
        $timeOut = date('Y-m-d H:i:s',strtotime($result['created']."+30 minute"));
        //判断验证码是否超时
        if(strtotime($timeOut)<strtotime($nowTime)){
            $this->resultMsg('error','验证码超时，请重新发送！');
        }
        $user = D("user"); // 实例化用户
        $condition = array('username'=>$mobile);
        $user->where($condition)->data(array('password'=>$password))->save();
        $this->resultMsg('success','密码重置成功！');

    }

    /**
     * [reset 重置密码]
     */
    public function reset(){
        $arr = I();
        $oldPassword = deCodeMd5(I('oldPassword',''));
        $password = deCodeMd5(I('password',''));
        if($status = is_login()){      
            $where = array('id' =>$status);
            $user = M('user');
            $result = $user->where($where)->find();
            if($result['password']!=$oldPassword){
                $this->resultMsg('error','旧密码不正确');
            }
            $user->where(array('id'=>$status))->data(array('password'=>$password))->save();
            $this->resultMsg('success','密码修改成功');
        }else{
            $this->resultMsg('error','尚未登录');
        }
    }

    /**
     * [forgetSendCode 忘记密码发送code]
     * @return [type] [description]
     */
    public function forgetSendCode(){
        $arr = I();
        $mobile = $arr['username'];
        $this->sendCode($mobile,'1');
    }

    /**
     * [register 用户注册]
     */
    public function register() {
        $mobile = I('username','');
        $code = I('code','null');
        $table = M('mobileVerifyRecord');
        $where = array('mobile' =>$mobile,'type'=>0);
        $result = $table->where($where)->order('created desc')->find();

        if($result['code']!=$code){
            $this->resultMsg('error','验证码不正确');
        }
        $nowTime = date('Y-m-d H:i:s',time());
        $timeOut = date('Y-m-d H:i:s',strtotime($result['created']."+30 minute"));
        //判断验证码是否超时
        if(strtotime($timeOut)<strtotime($nowTime)){
            $this->resultMsg('error','验证码超时，请重新发送！');
        }

        $user = D("user"); // 实例化用户
        $rules = array(
            array('username','require','请填写用户名！'),
            array('password','require','请填写密码！'),
        );

        $auto = array(
            array('roles','2'),
            array('password','autoMd5',3,'callback'),
            array('createtime',date('Y-m-d H:i:s',time()))
        );
        $condition = array('username'=>$mobile);
        $result = $user->where($condition)->find();
        if($result){
            $this->resultMsg('error','用户名已存在！');
        }
        if($user->validate($rules)->auto($auto)->create()){
            $id =$user->add();
            session('uid', $id);
            $info = M('userInfo');
            $info->data(array('uid'=>$id,'mobile'=>$mobile))->add();
            $ip = get_client_ip();
            $region = getMobileArea($mobile);//查询归属地
            sendMail('hi@wederful.com', '用户注册提醒', '注册时间：'.date('y-m-d h:i:s',time()).'<br>注册手机号：'.$mobile.'<br>归属地：'.$region.'<br>IP：'.$ip);
            $this->resultMsg('success','注册成功！');
        }else{
            $this->resultMsg('error',$user->getError());
        }

    }

    /**
     * [regSendCode 注册时发送验证码]
     * @return [type] [description]
     */
    public function regSendCode(){
        $arr = I();
        $mobile = $arr['username'];
        $this->sendCode($mobile);
    }

    /**
     * [sendCode 发送验证码]
     * @param  [type]  $mobile [description]
     * @param  integer $type   [0为注册，1为找回密码]
     */
    private function sendCode($mobile,$type = 0){
        if(!preg_match("/1[3458]{1}\d{9}$/",$mobile)){
            $this->resultMsg('error','请输入正确的手机号码！');
        }
        $table = M('mobileVerifyRecord');
        $code=sprintf("%06d",rand(1,999999));
        $ip = get_client_ip();
        $createTime = date('Y-m-d H:i:s',time());
        $endTime = date('Y-m-d',time()).' 23:59:59';
        $data = array('code'=>$code,'mobile'=>$mobile,'type'=>$type,'ip'=>$ip,'created'=>$createTime);
        $where = array('ip'=>$ip,'created'=>array('lt',$endTime));
        $count = $table->where($where)->count();
        if($count >= 5){
            $this->resultMsg('error','请求次数过多！');
        }
        $status = $table->add($data);
        //此处添加短信发送接口
        if($status){
            $params = array($code,'10');
            $sms = new Sms($mobile,$params);
            $result = $sms->sendSms();
            if($result['status'] == 'success'){
                $this->resultMsg('success','发送成功，请注意查收！');
            }else{
                $this->resultMsg('error','短信出现未知错误');
            }
        }else{
            $this->resultMsg('error','发送失败，请重试！');
        }

    }

    /**
     * 判断用户是否存在
     */
    public function checkUser(){
        $user = M("user");
        $arr = I();
        $username = $arr['username'];
        $where = array('username'=>$username);
        $result = $user->where($where)->find();
        if($username ==""){
            $this->resultMsg('error','用户不能为空');
        }
        if($result){
            $this->resultMsg('error','用户已经存在');
        }else{
            $this->resultMsg('success','可以注册！');
        }
    }

    /**
     * [checkNikeName 检查昵称是否存在]
     * @return [type] [description]
     */
    public function checkNikeName(){
        $arr = I();
        if(session('uid')){        
            if(empty($arr['nickname'])){
                $this->resultMsg('error','昵称不能为空');
            }else{
                $info = M("userInfo");
                $condition['uid']  = array('neq',session('uid'));
                $condition['nickname'] = $arr['nickname'];
                $data = $info->where($condition)->find();
                if($data){
                    $this->resultMsg('error','昵称已经存在');
                }else{
                    $this->resultMsg('success','可以使用该昵称');
                }
            }
        }else{
            $this->resultMsg('error','尚未登录');
        }
    }

    /**
     * [logout 退出登录]
     */
    public function logout() {
        //卸载SESSION
        session_unset();
        session_destroy();
        $this->resultMsg('success','退出登录成功！');
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
