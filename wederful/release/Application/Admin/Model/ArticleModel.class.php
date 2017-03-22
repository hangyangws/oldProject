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

class ArticleModel extends Model {

    /* 自动完成规则 */
    protected $_auto = array(
        array('uid', 'is_admin', self::MODEL_BOTH, 'function'),
        array('createtime','getTime',self::MODEL_BOTH,'callback'),
    );

    protected function getTime(){
        return date('Y-m-d H:i:s');
    }
}
