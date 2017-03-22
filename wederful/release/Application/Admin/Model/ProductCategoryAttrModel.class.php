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

class ProductCategoryAttrModel extends Model {

    /* 自动验证规则 */
    protected $_validate = array(
        array('name', 'require', '属性名称不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        array('type',array('input','checkbox','radio','select','textarea'),'属性类别不正确。',self::VALUE_VALIDATE,'in',self::MODEL_BOTH),
    );
}
