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

class ProductModel extends Model {

    /* 自动验证规则 */
    protected $_validate = array(
        array('name', 'require', '商品名称不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('name_en', 'require', '商品英文名称不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('destination_id', 'require', '目的地不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('description', 'require', '商品描述不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('description_en', 'require', '商品英文描述不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        // array('vendors_id', 'require', '商家名称不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        array('category_id', 'require', '商品分类不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
    );

    /* 自动完成规则 */
    protected $_auto = array(
        array('create_uid', 'is_admin', self::MODEL_BOTH, 'function'),
        array('createtime','getTime',self::MODEL_BOTH,'callback'),
        // array('product_no','getProductNo',self::MODEL_BOTH,'callback'),
    );

    protected function getTime(){
        return date('Y-m-d H:i:s');
    }

    protected function getProductNo(){
        $yCode = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J');
        $orderSn = $yCode[intval(date('Y')) - 2015] . strtoupper(dechex(date('m'))) . date('d') . substr(time(), -5) . substr(microtime(), 2, 5) . sprintf('%02d', rand(0, 99));
        return $orderSn;
    }


    
}
