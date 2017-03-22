<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;
use Think\Upload\Driver\Qiniu\QiniuStorage;

class AttributeController extends BaseController {

  /**
   * [serviceManage 服务项管理]
   * @return [type] [description]
   */
  public function index(){
    $table = D('ProductCategory');
    $attr = M('ProductCategoryAttr');
    $iconManager = M('IconManager');
    $iconManagerData = $iconManager->select();
    $where = array('parent_id'=>0);
    $data = $table->where($where)->select();
    for($i=0;$i<count($data);$i++){
        $attrs = array();
        $id = $data[$i]['id'];
        $conditionAttr = array('category_id' =>$id);
        $attrs = $attr->where($conditionAttr)->select();
        $data[$i]['attrs'] = $attrs;
    }
    $this->assign('result',$data);
    $this->assign('iconManagerData',$iconManagerData);
    $this->display();
  }

    /**
     * [categoryMd 添加或修改分类]
     */
    public function categoryMd(){
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $table = D('ProductCategory');
        if (!$table->create($arr)) {
            return $this->resultMsg('error', $table->getError());
        }
        if(!$arr['parentId']){
            if(!$arr['id']){
                $id = $table->data($arr)->add();
                $data = array('id'=>$id,'name'=>$arr['name']);
                $this->resultMsg('success','添加成功',$data);
            }else{
                $where = array('id' =>$arr['id']);
                $table->where($where)->save($arr);
                $data = array('id'=>$arr['id'],'name'=>$arr['name']);
                $this->resultMsg('success','编辑成功',$data);
            }
        }else{
            $parent = $table->where('id ='.$arr['parentId'])->select();
            if(!$parent){
                 $this->resultMsg('error','当前父级id不存在');
            }
            if(!$arr['id']){
                $arr['parent_id'] = $arr['parentId'];
                $id = $table->data($arr)->add();
                $data = array('id'=>$id,'name'=>$arr['name'],'parent_id'=>$arr['parentId']);
                $this->resultMsg('success','添加成功',$data);
            }else{
                $where = array('id' =>$arr['id']);
                $table->where($where)->save($arr);
                $data = array('id'=>$arr['id'],'name'=>$arr['name'],'parent_id'=>$arr['parentId']);
                $this->resultMsg('success','编辑成功',$data);
            }
        }
    }

    /**
     * [delCategory 删除分类]
     * @return [type] [description]
     */
    public function delCategory(){
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $table = M('ProductCategory');
        $where = array('id'=>$arr['id']);
        $data = $table->where($where)->select();
        if(!$data){
            $this->resultMsg('error','当前分类不存在');
        }else{
            $condition = array('parent_id'=>$arr['id']);
            $data = $table->where($condition)->select();
            $product = M('product');
            $procondition = array('category_id' =>$arr['id']);
            $pdata= $product->where($procondition)->select();
            if($pdata){
                $this->resultMsg('error','当前分类下有商品，请删除商品后才能删除分类！');
            }
            if($data){
                $this->resultMsg('error','请删除当前分类下的子分类');
            }
            $attr = M('productCategoryAttr');
            $attrData = $attr->where($procondition)->select();//查看当前分类的属性
            if($attrData){
                $this->resultMsg('error','当前分类下有属性，请删除属性后才能删除分类');
            }
            $table->where($where)->delete();
            $this->resultMsg('success','删除成功');
        }
    }

    /**
     * [addAttribute 添加分类属性]
     */
    public function addAttribute(){
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();//id分类id type属性类型 name属性名称  option[]
        foreach ( $arr as $i=>$val ) {
            if($i=='id'){
                 $arr['category_id'] = $val; //赋值
                 unset($arr[$i]); //删掉原有的键值
            }
            if($i=='pic'){
                 $arr['icon_id'] = $val; //赋值
                 unset($arr[$i]); //删掉原有的键值
            }
        }
        $table = D('ProductCategoryAttr');
        if (!$table->create($arr)) {
            return $this->resultMsg('error', $table->getError());
        }
        $category = M('ProductCategory');
        $where = array('id'=>$arr['category_id']);
        $data = $category->where($where)->find();
        if(!$data){
            return $this->resultMsg('error','当前分类不存在');
        }
        // if($data['parent_id']=='0'){
        //     return $this->resultMsg('error','不能给顶级分类添加属性');
        // }
        if($arr['type']=='input' || $arr['type']=='textarea'){
            //判断当前type的类型，如果没有选项就存到属性表
            $res = $table->data($arr)->add();
            return $this->resultMsg('success','添加属性成功');
        }else{
            //如果有选项存到属性的option表
            $categoryAttrId = $table->data($arr)->add();
            $option = M('ProductCategoryAttrOption');
            for($i=0;$i<count($arr['option']);$i++){
                $data = array('attr_id' =>$categoryAttrId,'option'=>$arr['option'][$i]['value'],'icon_id'=>$arr['option'][$i]['pic']);
                $option->data($data)->add();
            }
            return $this->resultMsg('success','添加属性成功');
        }
    }

    /**
     * [delAttribute 删除分类属性]
     */
    public function delAttribute(){
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();//要删除属性id
        $table = M('ProductCategoryAttr');
        $option = M('ProductCategoryAttrOption');
        $where = array('id'=>$arr['id']);
        $data = $table->where($where)->find();
        if(!$data){
            return $this->resultMsg('error','当前属性不存在');
        }

        $relational = M('ProductAttrRelational');
        $recondition = array('attr_id' =>$arr['id']);
        $pdata= $relational->where($recondition)->select();
        if($pdata){
            $this->resultMsg('error','当前属性下有商品，请删除商品后才能删除该属性！');
        }

        //如果不是文本框，就去选项表删除当前属性的选项
        if($data['type']!='input'||$data['type']!='textarea'){
            $condition = array('attr_id'=>$data['id']);
            $option->where($condition)->delete();
        }
        $table->where($where)->delete();
        $this->resultMsg('success','删除成功');
    }

    /**
     * [getAttribute 获取属性信息]
     * @return [type] [description]
     */
    public function getAttribute(){
        $arr = I();
        $aid = $arr['attr_id'];
        $categoryAttr = M('ProductCategoryAttr');
        $categoryData = $categoryAttr->where(array('id'=>$aid))->find();
        $attrOption = M('ProductCategoryAttrOption');
        $optionData = $attrOption->where(array('attr_id' =>$aid))->select();
        $categoryData['options'] = $optionData;
        $this->resultMsg('success','获取属性信息',$categoryData);
    }

    /**
     * [delOption 删除候选值]
     * @return [type] [description]
     */
    public function delOption(){
        $arr = I();
        $id = $arr['id'];
        $option = M('ProductCategoryAttrOption');
        $option->where(array('id'=>$id))->delete();
        $this->resultMsg('success','删除选项成功',$categoryData);
    }

    /**
     * [editAttribute 编辑属性]
     * @return [type] [description]
     */
    public function editAttribute(){
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();//id分类id type属性类型 name属性名称  option[]
        foreach ( $arr as $i=>$val ) {
            if($i=='pic'){
                 $arr['icon_id'] = $val; //赋值
                 unset($arr[$i]); //删掉原有的键值
            }
        }
        $table = M('ProductCategoryAttr');
        if($arr['type']=='input' || $arr['type']=='textarea'){
            //判断当前type的类型，如果没有选项就存到属性表
            $res = $table->where(array('id'=>$arr['attr_id']))->save($arr);
            return $this->resultMsg('success','编辑属性成功');
        }else{
            $option = M('ProductCategoryAttrOption');
            $res = $table->where(array('id'=>$arr['attr_id']))->save($arr);
            $odata = $option->where(array('attr_id'=>$arr['attr_id']))->select();
            for($i=0;$i<count($arr['option']);$i++){

                if($arr['option'][$i]['id']){
                    $data = array('id' =>$arr['option'][$i]['id'],'attr_id' =>$arr['attr_id'],'option'=>$arr['option'][$i]['value'],'icon_id'=>$arr['option'][$i]['pic']);
                    $option->save($data);
                }else{
                    $data = array('attr_id' =>$arr['attr_id'],'option'=>$arr['option'][$i]['value'],'icon_id'=>$arr['option'][$i]['pic']);
                    $option->data($data)->add();
                }

            }
            return $this->resultMsg('success','添加属性成功');
        }
    }

}
