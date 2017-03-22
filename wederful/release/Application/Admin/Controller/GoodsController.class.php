<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;
use Common\Tools\Page;

class GoodsController extends BaseController {
    public function index(){
        $arr = I();
    	$pagesize = C('BACKEND_PAGESIZE');
    	$package = M('package');
        $product = M('product');
        $category = D('ProductCategory');
        $vendors = D('vendors');
        $destination = M('destination');
        $destinations = $destination->select();
        $where = "where p.is_del=0 ";
        if($arr['search']){
            $where.="and p.name like '%".$arr['search']."%' ";
          // $where['name']=array('like',"%".$arr['search']."%");
        }
        if($arr['categoryid']){
            $where.="and pro.category_id =".$arr['categoryid']." ";
            $relat = M('vendorsCategoryRelation');
            $data =$relat->where(array('category_id'=>$arr['categoryid']))->select();
            foreach ($data as $k => $v) {
              $vdata = $vendors->where(array('id'=>$v['vendors_id']))->find();
              $vendorsArr[] = $vdata;
            }
        }
        if($arr['vendorid']){
            $where.=" and v.id =".$arr['vendorid'];
        }

        if($arr['order']){
            $where.=" order by p.price ".$arr['order'];
        }

        if($arr['area']){
            $where.=" and p.area_id =".$arr['area'];
        }

        $dao = M();
        $countData = $dao->query("SELECT count(*) as count from package as p LEFT JOIN product as pro on p.product_id = pro.id LEFT JOIN vendors as v on pro.vendors_id = v.id LEFT JOIN product_category as cate on cate.id = pro.category_id ".$where);
        $count = $countData[0]['count'];
        
        $page = getpage($count,$pagesize);

        $where.= ' limit '.$page->firstRow.','.$page->listRows;
        $data = $dao->query("SELECT cate.name as categoryname,p.*,pro.category_id as categoryid ,pro.id as proid,pro.name as proname,v.name as vendorname from package as p LEFT JOIN product as pro on p.product_id = pro.id LEFT JOIN vendors as v on pro.vendors_id = v.id LEFT JOIN product_category as cate on cate.id = pro.category_id ".$where);
        $category = D('ProductCategory');
        $categorys = $category->where(array('parent_id'=>0))->select();
        $nowPage = $arr['p'] && $arr['p'] > 1 ? $arr['p'] : 1;
        $totalSize = $count;
        $totalPage = ceil($count/$pagesize);


        
        $this->assign('areaid',$arr['area']);
        $this->assign('destinations',$destinations);
        $this->assign('order',$arr['order']);
        $this->assign('page',$page->show());
        $this->assign('categorys',$categorys);
        $this->assign('totalSize',$totalSize);
        $this->assign('totalPage',$totalPage);
        $this->assign('nowPage',$nowPage);
        $this->assign('keywords',$arr['search']);
        $this->assign('categoryid',$arr['categoryid']);
        $this->assign('packageData',$data);
        $this->assign('vendorsArr', $vendorsArr);
        $this->assign('vendorid', $arr['vendorid']);
        $this->display();
    }

    public function addGoods(){
    	$category = D('ProductCategory');
    	$destination = M('destination');
    	$destinations = $destination->select();
    	$categorys = $category->where(array('parent_id'=>0))->select();
        $promotion = M('promotion');
        $promotionData = $promotion->select();
        $this->assign('promotionData', $promotionData);
        $this->assign('categorys',$categorys);
    	$this->assign('destinations',$destinations);
    	$this->display();
    }

    public function addGoodsMethod(){
        $arr = I();
        $package = M('package');
        $noProvide = M('PackageNoProvideDate');
        $datePrice = M('PackageDatePrice');
        $promotionDate = M('PackagePromotionDate');
        $addValueService = M('PackageAddValueService');

        if($arr['product_id'] =='null'){
            $this->error('请必须选择服务项！');
        }

        $packageId = $package->data(array(
            'product_id' => $arr['product_id'],
            'package_no' => $arr['package_no'],
            'name' => $arr['name'],
            'name_en' => $arr['name_en'],
            'price' => $arr['price'],
            'number_range_min' => $arr['number_range_min'],
            'number_range_max' => $arr['number_range_max'],
            'out_charge' => $arr['out_charge'],
            'content' => $arr['content'],
            'content_en' => $arr['content_en'],
            'gift_service' => $arr['gift_service'],
            'gift_service_en' => $arr['gift_service_en'],
            'area_id' =>$arr['area_id'],
            'uid' =>is_admin()
        ))->add();

        $destination= M('destination');
        $destData = $destination->field('code')->where(array('id'=>$arr['area_id']))->find();
        $goods_no = $destData['code'];
        $productCategory = M('productCategory');
        $proData = $productCategory->field('code')->where(array('id'=>$arr['categoryid']))->find();
        $goods_no.=$proData['code'];
        $goods_no.=sprintf("%04d", $packageId);
        $package->where(array('id'=>$packageId))->data(array('goods_no'=>$goods_no))->save();

        foreach ($arr['no_provide_date_startdate'] as $k => $v) {
            if(!empty($v) && !empty($arr['no_provide_date_enddate'][$k])){
                $noProvide->data(array(
                    'package_id' => $packageId,
                    'startdate' => $v,
                    'enddate' => $arr['no_provide_date_enddate'][$k]
                ))->add();
            }
        }
        
        foreach ($arr['package_date_price_startdate'] as $j => $l) {
            if(!empty($l) && !empty($arr['package_date_price_enddate'][$j]) && !empty($arr['package_date_price'][$j])){
                $datePrice->data(array(
                    'package_id' => $packageId,
                    'startdate' => $l,
                    'enddate' => $arr['package_date_price_enddate'][$j],
                    'price' => $arr['package_date_price'][$j]
                ))->add();
            }
        }
        
        foreach ($arr['package_promotion_startdate'] as $a => $s) {
            if(!empty($s) && !empty($arr['package_promotion_enddate'][$a]) && !empty($arr['promotion'][$a])){                
                $promotionDate->data(array(
                    'package_id' => $packageId,
                    'startdate' => $s,
                    'enddate' => $arr['package_promotion_enddate'][$a],
                    'promotion_id' => $arr['promotion'][$a]
                ))->add();
            }
        }
        
        foreach ($arr['add_value_name'] as $d => $f) {
            if(!empty($f) && !empty($arr['add_value_price'][$d])){
                $addValueService->data(array(
                    'package_id' => $packageId,
                    'name' => $f,
                    'name_en' => $arr['add_value_name_en'][$d],
                    'price' => $arr['add_value_price'][$d],
                    'min_num' => $arr['min_num'][$d],
                    'max_num' => $arr['max_num'][$d]
                ))->add();
            }
        }


        $this->redirect('Goods/editGoods/', array(
            'id' => $packageId
        ));


    }

    public function editGoods(){
        $arr = I();
        $category = D('ProductCategory');
        $destination = M('destination');
        $destinations = $destination->select();
        $categorys = $category->where(array('parent_id'=>0))->select();
        $promotion = M('promotion');
        $promotionData = $promotion->select();
        $package = M('package');
        $packData = $package->where(array('id'=>$arr['id']))->find();
        $product = M('product');
        $proData = $product->where(array('id'=>$packData['product_id']))->find();
        $services = $product->field('id,name')->where(array('vendors_id'=>$proData['vendors_id']))->select();
        $dao = M();
        $vendors = $dao->query("SELECT id,name from vendors where id in (SELECT vendors_id from vendors_category_relation where category_id = '%s')",$proData['category_id']);
        $noProvide = M('PackageNoProvideDate');
        $datePrice = M('PackageDatePrice');
        $promotionDate = M('PackagePromotionDate');
        $addValueService = M('PackageAddValueService');
        $condition = array('package_id'=>$arr['id']);
        $noProvideData = $noProvide->where($condition)->select();
        $datePriceData = $datePrice->where($condition)->select();
        $promotionDateData = $promotionDate->where($condition)->select();


        $addValueServiceData = $addValueService->where($condition)->select();

        $this->assign('noProvideData',$noProvideData);
        $this->assign('datePriceData',$datePriceData);
        $this->assign('addValueServiceData',$addValueServiceData);
        $this->assign('promotionDateData',$promotionDateData);
        $this->assign('packgeid',$arr['id']);
        $this->assign('proData',$proData);
        $this->assign('vendors',$vendors);
        $this->assign('services',$services);
        $this->assign('packData',$packData);
        $this->assign('categorys',$categorys);
        $this->assign('promotionData', $promotionData);
        $this->assign('destinations',$destinations);
        $this->display();
    }

    public function editGoodsMethod(){

        $arr = I();
        $packageId = $arr['packageid'];
        $package = M('package');
        $noProvide = M('PackageNoProvideDate');
        $datePrice = M('PackageDatePrice');
        $promotionDate = M('PackagePromotionDate');
        $addValueService = M('PackageAddValueService');
        if($arr['product_id'] =='null'){
            $this->error('请必须选择服务项',U('Goods/editGoods').'/id/'.$packageId);
        }
        $package->where(array('id'=>$arr['packageid']))->data(array(
            'product_id' => $arr['product_id'],
            'package_no' => $arr['package_no'],
            'name' => $arr['name'],
            'name_en' => $arr['name_en'],
            'price' => $arr['price'],
            'number_range_min' => $arr['number_range_min'],
            'number_range_max' => $arr['number_range_max'],
            'out_charge' => $arr['out_charge'],
            'content' => $arr['content'],
            'content_en' => $arr['content_en'],
            'gift_service' => $arr['gift_service'],
            'gift_service_en' => $arr['gift_service_en'],
            'area_id' =>$arr['area_id'],
            'uid' =>is_admin()
        ))->save();


        $packageWhere = array(
            'package_id' => $packageId
        );

        $noProvide->where($packageWhere)->delete();
        $datePrice->where($packageWhere)->delete();
        $promotionDate->where($packageWhere)->delete();
        $addValueService->where($packageWhere)->delete();


        foreach ($arr['no_provide_date_startdate'] as $k => $v) {
            if(!empty($v) && !empty($arr['no_provide_date_enddate'][$k])){
                $noProvide->data(array(
                    'package_id' => $packageId,
                    'startdate' => $v,
                    'enddate' => $arr['no_provide_date_enddate'][$k]
                ))->add();
            }
        }
        
        foreach ($arr['package_date_price_startdate'] as $j => $l) {
            if(!empty($l) && !empty($arr['package_date_price_enddate'][$j]) && !empty($arr['package_date_price'][$j])){
                $datePrice->data(array(
                    'package_id' => $packageId,
                    'startdate' => $l,
                    'enddate' => $arr['package_date_price_enddate'][$j],
                    'price' => $arr['package_date_price'][$j]
                ))->add();
            }
        }
        
        foreach ($arr['package_promotion_startdate'] as $a => $s) {
            if(!empty($s) && !empty($arr['package_promotion_enddate'][$a]) && !empty($arr['promotion'][$a])){                
                $promotionDate->data(array(
                    'package_id' => $packageId,
                    'startdate' => $s,
                    'enddate' => $arr['package_promotion_enddate'][$a],
                    'promotion_id' => $arr['promotion'][$a]
                ))->add();
            }
        }
        
        foreach ($arr['add_value_name'] as $d => $f) {
            if(!empty($f) && !empty($arr['add_value_price'][$d])){
                $addValueService->data(array(
                    'package_id' => $packageId,
                    'name' => $f,
                    'name_en' => $arr['add_value_name_en'][$d],
                    'price' => $arr['add_value_price'][$d],
                    'min_num' => $arr['min_num'][$d],
                    'max_num' => $arr['max_num'][$d]
                ))->add();
            }
        }


         $this->redirect('Goods/editGoods/', array(
            'id' => $packageId
        ));

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

    public function getServices(){
    	$arr = I();
    	$vid = $arr['id'];
    	$product = M('product');
    	$services = $product->field('id,name')->where(array('vendors_id'=>$vid))->select();
    	$this->resultMsg('success', '获取成功',$services);
    }

    public function delGoods(){
        $arr = I();
        $package = M('package');
        $package->where(array('id'=>$arr['id']))->data(array('is_del'=>'1'))->save();
        $this->resultMsg('success', '删除成功','1');
    }

    /**
     * 是否发布产品
     */
    public function showGoods(){
        $arr = I();
        $pid = $arr['id'];
        $package = M('package');
        $where = array('id'=>$pid);
        $data = $package->field('is_show')->where($where)->find();
        if($data['is_show']){
            $data = $package->where($where)->save(array('is_show'=>'0'));
            $this->resultMsg('success', '取消发布成功', '0');
        }else{
            $data = $package->where($where)->save(array('is_show'=>'1'));
            $this->resultMsg('success', '发布成功','1');
        }
    }

    public function upGoodsNum(){
        $arr = I();
        $package = M('package');
        $product = M('product');
        $destination= M('destination');
        $condition['goods_no'] = array('EXP','IS NULL');
        $packageData = $package->where($condition)->select();
        $productCategory = M('productCategory');
        foreach ($packageData as $key => $value) {
            $destData = $destination->field('code')->where(array('id'=>$value['area_id']))->find();
            $proData = $product->where(array('id'=>$value['product_id']))->find();
            $pro = $productCategory->field('code')->where(array('id'=>$proData['category_id']))->find();
            if(!$destData || !$pro){
                continue;
            }
            $goods_no = $destData['code'];
            $goods_no.=$pro['code'];
            $goods_no.=sprintf("%04d", $value['id']);
            $package->where(array('id'=>$value['id']))->data(array('goods_no'=>$goods_no))->save();
        }
        echo "更新成功!";
    }
}
