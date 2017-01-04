<?php
namespace Home\Model;
use Think\Model;

class UserModel extends Model {
    protected $_validate = array(
        array(
            'username',
            'require',
            '请填写用户名！'
        ) ,
        array(
            'username',
            '/^1[3458][0-9]{9}$/',
            '账号格式不正确！'
        ) ,
        array(
            'password',
            'require',
            '请填写密码！'
        ) ,
    );
    protected function getTime() {
        
        return date('Y-m-d H:i:s');
    }

    public function autoMd5($password){
        return deCodeMd5($password);
    }
}
