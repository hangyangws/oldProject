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

class ProductCategoryModel extends Model {

    /* 自动验证规则 */
    protected $_validate = array(
        array('name', 'require', '分类名称不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('address', 'require', '商家地址不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('contacts', 'require', '联系人不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('mobile', 'require', '手机号码不能不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('email', 'require', '邮箱不能为空不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('mobile','/^1[3|4|5|8][0-9]\d{4,8}$/','手机号码错误！','0','regex',self::MODEL_BOTH),
        // array('other', 'require', '其他不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('email','email','邮箱格式不正确'),
        // array('name', '', '标识已经存在', self::MUST_VALIDATE, 'unique', self::MODEL_BOTH),
        // array('title', 'require', '标题不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('title', '1,80', '标题长度不能超过80个字符', self::MUST_VALIDATE, 'length', self::MODEL_BOTH),
        // array('remark', 'require', '行为描述不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('remark', '1,140', '行为描述不能超过140个字符', self::MUST_VALIDATE, 'length', self::MODEL_BOTH),
    );
}
