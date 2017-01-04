<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;
use Think\Upload\Driver\Qiniu\QiniuStorage;
use Common\Tools\Page;

class ServiceController extends BaseController {

  /**
   * [serviceManage 服务项管理]
   * @return [type] [description]
   */
  public function index(){
    $arr = I();
    $table = M('product');
    $package = M('package');
    $vendors = M('vendors');
    $where = array('is_del'=>'0');
    $pagesize = C('BACKEND_PAGESIZE');

    $vendorsArr = array();
    if($arr['categoryid']){
        $relat = M('vendorsCategoryRelation');
        $data =$relat->where(array('category_id'=>$arr['categoryid']))->select();
        foreach ($data as $k => $v) {
          $vdata = $vendors->where(array('id'=>$v['vendors_id']))->find();
          $vendorsArr[] = $vdata;
        }
        $where['category_id'] = $arr['categoryid'];
    }

    if($arr['search']){
        $where['name']=array('like',"%".$arr['search']."%");
    }

    if($arr['vendorid']){
        $where['vendors_id'] = $arr['vendorid'];
    }

    $count = $table->where($where)->count();
    $page = getpage($count,$pagesize);

    $result = $table->where($where)->limit($page->firstRow.','.$page->listRows)->select();

    $category = D('ProductCategory');
    $categorys = $category->where(array('parent_id'=>0))->select();
    $totalPage = ceil($count/$pagesize);
    $totalSize = $count;
    $nowPage = $arr['p'] && $arr['p'] > 1 ? $arr['p'] : 1;
    foreach ($result as $key => $value) {
        $cid = $value['category_id'];
        $vid = $value['vendors_id'];
        $cate = $category->where(array('id'=>$cid))->find();
        $vendor =$vendors->where(array('id'=>$vid))->find();
        $result[$key]['categoryName'] = $cate['name'];
        $result[$key]['vendorName'] = $vendor['name'];
        $packageCount = $package->where(array('product_id'=>$value['id'],'is_del'=>'0','is_show'=>'1'))->count();
        $result[$key]['packageCount'] = $packageCount;
    }

    $this->assign('page',$page->show());
    $this->assign('keywords',$arr['search']);
    $this->assign('vendorsArr', $vendorsArr);
    $this->assign('result', $result); // 赋值数据集
    $this->assign('nowPage',$nowPage);
    $this->assign('categorys',$categorys);
    $this->assign('totalSize',$totalSize);
    $this->assign('totalPage',$totalPage);
    $this->assign('categoryid',$arr['categoryid']);
    $this->assign('vendorid',$arr['vendorid']);
    $this->display();
  }

    public function getVendors(){
    	$arr = I();
        $dao = M();
        $data = array();
        if($arr['id']){
            $data = $dao->query("SELECT id,name from vendors where id in (SELECT vendors_id from vendors_category_relation where category_id = '%s')",$arr['id']);
        }
        $this->resultMsg('success', '获取成功',$data);

    }

    public function addServiceOne(){
        $arr = I();
        $category = D('ProductCategory');
        $categorys = $category->where(array('parent_id'=>0))->select();
        $this->assign('categorys',$categorys);
        $this->display();
    }

    public function addServiceOneMethod(){
        $arr = I();
        $table = D('Product');
        $relatinal = M('ProductAttrRelational');
        $arr['uid'] = is_admin();
        if (!$table->create($arr)) {
            $this->error($table->getError() , U('Service/addServiceOne'));
        }
        $id = $table->add();
        foreach ($arr['attr'] as $key => $value) {
            if (is_array($value)) {
                //判断如果是多选，就把字段用|分割存
                $str = "";
                
                foreach ($value as $k => $v) {
                    $str.= $v . '|';
                }
                $str = substr($str, 0, -1);
                $data = array(
                    'product_id' => $id,
                    'attr_id' => $key,
                    'value' => $str
                );
            } else {
                $data = array(
                    'product_id' => $id,
                    'attr_id' => $key,
                    'value' => $value
                );
            }
            $relatinal->data($data)->add();
        }
        $this->redirect('Service/addServiceTwo', array(
            'pid' => $id
        ));
    }

    public function addServiceTwo(){
        $arr = I();
        $pid = $arr['pid'];
        $this->assign('pid',$pid);
        $this->assign('depositRatio', C('DEPOSIT_RATIO'));
        $this->display();
    }

    public function addServiceTwoMethod(){
        $arr = I();
        $productId = $arr['pid'];
        $product = M('product');
        $imgList = M('ProductDetailImages');
        $promotion = M('promotion');
        $data = array(
            'large_img' => $arr['large'],
            'thumbnail' => $arr['thumbnail']
        );
        $product->where(array(
            'id' => $productId
        ))->save($data);
        $details = $arr['details'];
        
        foreach ($details as $key => $value) {
            $imgList->data(array(
                'product_id' => $productId,
                'img' => $value
            ))->add();
        }
        $notice = M('notice');
        $arr['product_id'] = $productId;
        $notice->data($arr)->add();
        $cost = M('CostDescription');
        $costId = $cost->data(array(
            'product_id' => $productId,
            'deposit_ratio' => $arr['deposit_ratio'],
            'balance_date_num' => $arr['balance_date_num'],
            'no_fine_date_num' => $arr['no_fine_date_num']
        ))->add();
        $deduct = M('DeductFineRatio');
        if ($costId) {
            foreach ($arr['deduct_fine_date'] as $k => $dateNum) {
                $value = $arr['deduct_fine_value'][$k];
                if(!empty($dateNum)&&!empty($value)){
                    $deduct->data(array(
                        'cost_id' => $costId,
                        'date_num' => $dateNum,
                        'fine_ratio' => $value
                    ))->add();
                }
            }
        }

        $this->redirect('Service/editServiceOne/', array(
            'pid' => $productId
        ));
    }

    public function editServiceOne(){
        $arr = I();
        $pid = $arr['pid'];
        $category = M('ProductCategory');
        $ProductCategoryAttr = D('ProductCategoryAttr');
        $relational = M('ProductAttrRelational');
        $vendor = M('vendors');
        $categorys = $category->where(array('parent_id'=>0))->select();
        $product = M('product');
        $where = array(
            'id' => $pid
        );
        $proData = $product->where($where)->find();
        $categoryId = $proData['category_id'];
        $vendorId = $proData['vendors_id'];
        
        $vendorsArr = array();
        $relat = M('vendorsCategoryRelation');
        $data =$relat->where(array('category_id'=>$categoryId))->select();
        foreach ($data as $k => $v) {
          $vdata = $vendor->where(array('id'=>$v['vendors_id']))->find();
          $vendorsArr[] = $vdata;
        }
        
        $data = $ProductCategoryAttr->where(array('category_id' => $categoryId))->select();
        foreach ($data as $key => $value) {
            if ($value['type'] != "input" || $value['type'] != "textarea") {
                $option = M('ProductCategoryAttrOption');
                $where = array(
                    'attr_id' => $value['id']
                );
                $res = $option->where($where)->select();
                $data[$key]['options'] = $res;
            }
            $rdata = $relational->field('value')->where(array(
                'attr_id' => $value['id'],
                'product_id' => $pid
            ))->find();
            if ($value['type'] == 'checkbox') {
                $data[$key]['value'] = explode("|", $rdata['value']);
            } else {
                $data[$key]['value'] = $rdata['value'];
            }
        }

        $this->assign('pid',$pid);
        $this->assign('vendorsArr', $vendorsArr);
        $this->assign('attrData', $data);
        $this->assign('proData',$proData);
        $this->assign('vendors',$vendors);
        $this->assign('vendorId',$vendorId);
        $this->assign('categoryId',$categoryId);
        $this->assign('categorys',$categorys);
        $this->display();
    }

    public function editServiceOneMethod(){
        $arr = I();
        $table = D('Product');
        $relatinal = M('ProductAttrRelational');
        $pid = $arr['pid'];
        $arr['id'] = $pid;

        if (!$table->create($arr)) {
            $this->error($table->getError() , U('Service/editServiceOne/pid/' . $arr['pid']));
        }
        $status = $table->save($arr);
        $relatinal->where(array(
            'product_id' => $arr['pid']
        ))->delete();
        
        foreach ($arr['attr'] as $key => $value) {
            if (is_array($value)) {
                //判断如果是多选，就把字段用|分割存
                $str = "";
                
                foreach ($value as $k => $v) {
                    $str.= $v . '|';
                }
                $str = substr($str, 0, -1);
                $data = array(
                    'product_id' => $arr['pid'],
                    'attr_id' => $key,
                    'value' => $str
                );
            } else {
                $data = array(
                    'product_id' => $arr['pid'],
                    'attr_id' => $key,
                    'value' => $value
                );
            }
            $relatinal->data($data)->add();
        }
        $this->redirect('Service/editServiceTwo', array(
            'pid' => $pid
        ));
    }

    public function editServiceTwo(){
        $arr = I();
        $product = M('product');
        $res = $product->where(array('id'=>$arr['pid']))->find();
        if(!$res){
            return $this->error('当前项目不存在',U('Index/goodsManage'));
        }

        $cost = M('CostDescription');
        $costData = $cost->where(array(
            'product_id' => $arr['pid']
        ))->find();
        $deduct = M('DeductFineRatio');
        $deList = $deduct->where(array(
            'cost_id' => $costData['id']
        ))->select();
        $notice = M('notice');
        $proData = $product->where(array(
            'id' => $arr['pid']
        ))->find();
        $detailImages = M('ProductDetailImages');
        $noticeData = $notice->where(array(
            'product_id' => $arr['pid']
        ))->find();
        $detailImg = $detailImages->where(array(
            'product_id' => $arr['pid']
        ))->select();
        $this->assign('proData', $proData);
        $this->assign('pid', $arr['pid']);
        $this->assign('noticeData', $noticeData);
        $this->assign('detailImg', $detailImg);
        $this->assign('depositRatio', C('DEPOSIT_RATIO'));
        $this->assign('costData', $costData);
        $this->assign('deList', $deList);
        $this->display();
    }

    public function editServiceTwoMethod(){
        $arr = I();
        $productId = $arr['pid'];
        $arr['product_id'] = $productId;
        $product = M('product');
        $imgList = M('ProductDetailImages');
        $data = array(
            'large_img' => I('post.large',''),
            'thumbnail' => I('post.thumbnail','')
        );
        $product->where(array(
            'id' => $productId
        ))->save($data);
        $details = $arr['details'];
        $imgList->where(array(
            'product_id' => $productId
        ))->delete();
        
        foreach ($details as $key => $value) {
            $imgList->data(array(
                'product_id' => $productId,
                'img' => $value
            ))->add();
        }
        $notice = M('notice');
        $notice->where(array(
            'product_id' => $productId
        ))->delete();
        $notice->data($arr)->add();
        $cost = M('CostDescription');
        $costObj = $cost->where(array(
            'product_id' => $productId
        ))->find();
        $cost->where(array(
            'product_id' => $productId
        ))->delete();
        $costId = $cost->data(array(
            'product_id' => $productId,
            'deposit_ratio' => $arr['deposit_ratio'],
            'balance_date_num' => $arr['balance_date_num'],
            'no_fine_date_num' => $arr['no_fine_date_num']
        ))->add();
        $deduct = M('DeductFineRatio');
        $deduct->where(array(
            'cost_id' => $costObj['id']
        ))->delete();
        if ($costId) {
            foreach ($arr['deduct_fine_date'] as $k => $dateNum) {
                $value = $arr['deduct_fine_value'][$k];
                if(!empty($dateNum)&&!empty($value)){
                    $deduct->data(array(
                        'cost_id' => $costId,
                        'date_num' => $dateNum,
                        'fine_ratio' => $value
                    ))->add();
                }
            }
        }

        $this->redirect('Service/editServiceOne/', array(
            'pid' => $productId
        ));

    }


    /**
     * [delProduct 删除商品]
     * @return [type] [description]
     */
    public function delProduct(){
        $arr = I();
        $pid = $arr['id'];
        $product = M('product');
        $where = array('id'=>$pid);
        $product->where($where)->save(array('is_show'=>0,'is_del'=>1));
        $this->resultMsg('success', '删除成功','1');
    }


    /**
     * 是否发布产品
     */
    public function isShow(){
        $arr = I();
        $pid = $arr['id'];
        $product = M('product');
        $where = array('id'=>$pid);
        $pdata = $product->field('is_show')->where($where)->find();
        // print_r($pdata);
        if($pdata['is_show']){
            $pdata = $product->where($where)->save(array('is_show'=>'0'));
            $this->resultMsg('success', '取消发布成功', '0');
        }else{
            $pdata = $product->where($where)->save(array('is_show'=>'1'));
            $this->resultMsg('success', '发布成功','1');
        }
    }

}
