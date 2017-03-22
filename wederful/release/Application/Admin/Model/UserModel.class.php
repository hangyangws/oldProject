<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: huajie <banhuajie@163.com>
// +----------------------------------------------------------------------

namespace Admin\Model;
use Think\Model;

/**
 * 行为模型
 * @author huajie <banhuajie@163.com>
 */

class UserModel extends Model {

    /* 自动验证规则 */
    protected $_validate = array(
        array('username', 'require', '账号不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        array('username', '/^[a-zA-Z]\w{0,39}$/', '请输入正确的账号', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        array('password','require','请填写密码！')
        // array('name', '', '标识已经存在', self::MUST_VALIDATE, 'unique', self::MODEL_BOTH),
        // array('title', 'require', '标题不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('title', '1,80', '标题长度不能超过80个字符', self::MUST_VALIDATE, 'length', self::MODEL_BOTH),
        // array('remark', 'require', '行为描述不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('remark', '1,140', '行为描述不能超过140个字符', self::MUST_VALIDATE, 'length', self::MODEL_BOTH),
    );

    // //定义用户与用户信处表关联关系属性
    // Protected $_link = array(
    //     'userinfo' => array(
    //         'mapping_type' => self::HAS_ONE,
    //         'foreign_key' => 'uid'
    //         )
    // );

    

}
