<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;
use Think\Upload\Driver\Qiniu\QiniuStorage;

class ProductController extends BaseController {
    /**
     * [addProductStepOne 填加商品第一步]
     */
    public function addProductStepOne() {
        $destination = M('destination');
        $where = array(
            'type_id' => '0'
        );
        $table = M('ProductCategory');
        $condition = array(
            'parent_id' => 0
        );
        $categorys = $table->where($condition)->select();
        $destinationData = $destination->where($where)->select();
        $table = M('vendors');
        $vendors = $table->select();
        $this->assign('categorys', $categorys); //分类列表
        $this->assign('vendors', $vendors); //商家列表
        $this->assign('destinationData', $destinationData); //地区列表
        $this->display();
    }
    /**
     * [addProductStepOneSave 保存添加第一步]
     */
    public function addProductStepOneSave() {
        $arr = I();
        $table = D('Product');
        $relatinal = M('ProductAttrRelational');
        if ($arr['destination_id'] == 'null') {
            $arr['destination_id'] = $arr['regional_id'];
        }
        if (!$table->create($arr)) {
            $this->error($table->getError() , U('addproduct/step1'));
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
        $this->redirect('Product/addProductStepTwo', array(
            'pid' => $id
        ));
    }
    /**
     * [addProductStepTwo 添加商品第二步]
     */
    public function addProductStepTwo() {
        $arr = I();
        $notice = M('notice');
        $cost = M('CostDescription');

        $product = M('product');
        $res = $product->where(array('id'=>$arr['pid']))->find();
        if(!$res){
            return $this->error('当前项目不存在',U('Index/goodsManage'));
        }

        $where = array(
            'product_id' => $arr['pid']
        );
        $ndata = $notice->where($where)->find();
        $cdata = $cost->where($where)->find();
        if ($ndata || $cdata) {
            $this->redirect('Product/editProductStepTwo', array(
                'pid' => $arr['pid']
            ));
        }

        $this->assign('productName', $res['name']);
        $this->assign('pid', $arr['pid']);
        $this->assign('depositRatio', C('DEPOSIT_RATIO'));
        $this->display();
    }
    /**
     * [addProductStepTwoSave 添加商品保存第二部]
     */
    public function addProductStepTwoSave() {
        $arr = I();
        $productId = $arr['productId'];
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
        $this->redirect('Product/addProductStepThree', array(
            'pid' => $productId
        ));
    }
    /**
     * [addProductStepTree 添加第三部]
     */
    public function addProductStepThree() {
        $arr = I();

        $product = M('product');
        $res = $product->where(array('id'=>$arr['pid']))->find();
        if(!$res){
            return $this->error('当前项目不存在',U('Index/goodsManage'));
        }


        $package = M('package');
        $where = array(
            'product_id' => $arr['pid']
        );
        $pdata = $package->where($where)->find();
        if ($pdata) {
            $this->redirect('Product/editProductStepThree', array(
                'pid' => $arr['pid']
            ));
        }
        $promotion = M('promotion');
        $promotionData = $promotion->select();
        $this->assign('productName', $res['name']);
        $this->assign('pid', $arr['pid']);
        $this->assign('promotionData', $promotionData);
        $this->display();
    }
    /**
     * [editProductStepOne 编辑商品第一步]
     * @return [type] [description]
     */
    public function editProductStepOne() {
        $arr = I();
        $pid = $arr['pid'];

        $product = M('product');
        $res = $product->where(array('id'=>$arr['pid']))->find();
        if(!$res){
            return $this->error('当前项目不存在',U('Index/goodsManage'));
        }

        $where = array(
            'id' => $pid
        );
        $product = M('product');
        $proData = $product->where($where)->find();
        if (!$proData) {
            $this->error('当前商品不存在');
        }
        $destinationId = $proData['destination_id'];
        $destination = M('destination');
        $vendor = M('vendors');
        $condition = array(
            'type_id' => '0'
        );
        $destinationData = $destination->where($condition)->select();
        $vendors = $vendor->select();
        $vendorId = $proData['vendors_id'];
        $dest = $destination->where(array(
            'id' => $destinationId
        ))->find();
        $regional_id = $dest['parent_id'];
        $cityList = $destination->where(array(
            'parent_id' => $regional_id
        ))->select();
        if (!$cityList) {
            $regional_id = $destinationId;
        }
        $ProductCategory = M('ProductCategory');
        $categorys = $ProductCategory->where(array(
            'parent_id' => 0
        ))->select();
        $categoryId = $proData['category_id'];
        $ProductCategoryAttr = D('ProductCategoryAttr');
        $where = array(
            'category_id' => $proData['category_id']
        );
        $data = $ProductCategoryAttr->where($where)->select();
        $relational = M('ProductAttrRelational');
        
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
        $this->assign('attrData', $data);
        $this->assign('parentId', $parentId);
        $this->assign('vendors', $vendors);
        $this->assign('vendorId', $vendorId);
        $this->assign('categoryId', $categoryId);
        $this->assign('destinationId', $destinationId);
        $this->assign('cityList', $cityList);
        $this->assign('categorys', $categorys);
        $this->assign('productId', $pid);
        $this->assign('regionalid', $regional_id);
        $this->assign('destinationData', $destinationData); //地区列表
        $this->assign('proData', $proData);
        $this->display();
    }
    /**
     * [editSaveStepOne 保存第一步编辑]
     * @return [type] [description]
     */
    public function editSaveStepOne() {
        $arr = I();
        $table = D('Product');
        $relatinal = M('ProductAttrRelational');
        $pid = $arr['pid'];
        $arr['id'] = $pid;
        if ($arr['destination_id'] == 'null') {
            $arr['destination_id'] = $arr['regional_id'];
        }
        if (!$table->create($arr)) {
            $this->error($table->getError() , U('editproduct/step1/pid/' . $arr['pid']));
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
        $this->redirect('Product/editProductStepTwo', array(
            'pid' => $arr['pid']
        ));
    }
    /**
     * [editProductStepTwo 编辑商品第二步]
     */
    public function editProductStepTwo() {
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
        $this->assign('productId', $arr['pid']);
        $this->assign('noticeData', $noticeData);
        $this->assign('detailImg', $detailImg);
        $this->assign('depositRatio', C('DEPOSIT_RATIO'));
        $this->assign('costData', $costData);
        $this->assign('deList', $deList);
        $this->display();
    }
    /**
     * [editSaveStepTwo 编辑保存第二步]
     * @return [type] [description]
     */
    public function editSaveStepTwo() {
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
        $this->redirect('Product/editProductStepThree', array(
            'pid' => $arr['pid']
        ));
    }
    /**
     * [editProductStepTree 编辑第三步]
     */
    public function editProductStepThree() {
        $arr = I();

        $product = M('product');
        $res = $product->where(array('id'=>$arr['pid']))->find();
        if(!$res){
            return $this->error('当前项目不存在',U('Index/goodsManage'));
        }
        
        $productId = $arr['pid'];
        $arr['product_id'] = $productId;
        $package = M('package');
        $noProvide = M('PackageNoProvideDate');
        $datePrice = M('PackageDatePrice');
        $promotionDate = M('PackagePromotionDate');
        $addValue = M('PackageAddValueService');
        $promotion = M('promotion');
        $promotionData = $promotion->select();
        $packageData = $package->where(array(
            'product_id' => $productId
        ))->order('package_no asc')->select();
        
        foreach ($packageData as $key => $value) {
            $where = array(
                'package_id' => $value['id']
            );
            $noProvideData = $noProvide->where($where)->select();
            $packageData[$key]['noProvide'] = $noProvideData;
            $dataPriceData = $datePrice->where($where)->select();
            $packageData[$key]['dataPrice'] = $dataPriceData;
            $promotionDateData = $promotionDate->where($where)->select();
            $packageData[$key]['promotion'] = $promotionDateData;
            $addValueData = $addValue->where($where)->select();
            $packageData[$key]['addValue'] = $addValueData;
        }
        $this->assign('productName', $res['name']);
        $this->assign('promotionData', $promotionData);
        $this->assign('productId', $productId);
        $this->assign('packageData', $packageData);
        $this->display();
    }
    /**
     * [addProductStepFour 添加第四部]
     */
    public function addProductStepFour() {
        $arr = I();
        $package = M('package');
        $noProvide = M('PackageNoProvideDate');
        $datePrice = M('PackageDatePrice');
        $promotionDate = M('PackagePromotionDate');
        $addValueService = M('PackageAddValueService');
        
        foreach ($arr['package_no'] as $key => $value) {
            $packageId = $package->data(array(
                'product_id' => $arr['productId'],
                'package_no' => $value,
                'name' => $arr['name'][$key],
                'name_en' => $arr['name_en'][$key],
                'price' => $arr['price'][$key],
                'number_range_min' => $arr['number_range_min'][$key],
                'number_range_max' => $arr['number_range_max'][$key],
                'out_charge' => $arr['out_charge'][$key],
                'content' => $arr['content'][$key],
                'content_en' => $arr['content_en'][$key],
                'gift_service' => $arr['gift_service'][$key],
                'gift_service_en' => $arr['gift_service_en'][$key]
            ))->add();
            
            foreach ($arr['no_provide_date_startdate'][$key] as $k => $v) {
                if(!empty($v) && !empty($arr['no_provide_date_enddate'][$key][$k])){
                    $noProvide->data(array(
                        'package_id' => $packageId,
                        'startdate' => $v,
                        'enddate' => $arr['no_provide_date_enddate'][$key][$k]
                    ))->add();
                }
            }
            
            foreach ($arr['package_date_price_startdate'][$key] as $j => $l) {
                if(!empty($l) && !empty($arr['package_date_price_enddate'][$key][$j]) && !empty($arr['package_date_price'][$key][$j])){
                    $datePrice->data(array(
                        'package_id' => $packageId,
                        'startdate' => $l,
                        'enddate' => $arr['package_date_price_enddate'][$key][$j],
                        'price' => $arr['package_date_price'][$key][$j]
                    ))->add();
                }
            }
            
            foreach ($arr['package_promotion_startdate'][$key] as $a => $s) {
                if(!empty($s) && !empty($arr['package_promotion_enddate'][$key][$a]) && !empty($arr['promotion'][$key][$a])){                
                    $promotionDate->data(array(
                        'package_id' => $packageId,
                        'startdate' => $s,
                        'enddate' => $arr['package_promotion_enddate'][$key][$a],
                        'promotion_id' => $arr['promotion'][$key][$a]
                    ))->add();
                }
            }
            
            foreach ($arr['add_value_name'][$key] as $d => $f) {
                if(!empty($f) && !empty($arr['add_value_name_en'][$key][$d]) && !empty($arr['add_value_price'][$key][$d])){
                    $addValueService->data(array(
                        'package_id' => $packageId,
                        'name' => $f,
                        'name_en' => $arr['add_value_name_en'][$key][$d],
                        'price' => $arr['add_value_price'][$key][$d]
                    ))->add();
                }
            }
        }
        $this->success("添加商品成功", U("Index/goodsManage"));
    }
    /**
     * [editProductStepFour 编辑第四步]
     */
    public function editProductStepFour() {
        $arr = I();
        $packageIdArr = $arr['packageId'];
        $package = M('package');
        $noProvide = M('PackageNoProvideDate');
        $datePrice = M('PackageDatePrice');
        $promotionDate = M('PackagePromotionDate');
        $addValueService = M('PackageAddValueService');
        $package->where(array(
            'product_id' => $arr['productId']
        ))->delete();
        
        foreach ($arr['package_no'] as $key => $value) {
            $packageId = $packageIdArr[$key];
            $packageWhere = array(
                'package_id' => $packageId
            );
            $noProvide->where($packageWhere)->delete();
            $datePrice->where($packageWhere)->delete();
            $promotionDate->where($packageWhere)->delete();
            $addValueService->where($packageWhere)->delete();
            $packageId = $package->data(array(
                'product_id' => $arr['productId'],
                'package_no' => $value,
                'name' => $arr['name'][$key],
                'name_en' => $arr['name_en'][$key],
                'price' => $arr['price'][$key],
                'number_range_min' => $arr['number_range_min'][$key],
                'number_range_max' => $arr['number_range_max'][$key],
                'out_charge' => $arr['out_charge'][$key],
                'content' => $arr['content'][$key],
                'content_en' => $arr['content_en'][$key],
                'gift_service' => $arr['gift_service'][$key],
                'gift_service_en' => $arr['gift_service_en'][$key]
            ))->add();
            
            foreach ($arr['no_provide_date_startdate'][$key] as $k => $v) {
                if(!empty($v) && !empty($arr['no_provide_date_enddate'][$key][$k])){
                    $noProvide->data(array(
                        'package_id' => $packageId,
                        'startdate' => $v,
                        'enddate' => $arr['no_provide_date_enddate'][$key][$k]
                    ))->add();
                }
            }
            
            foreach ($arr['package_date_price_startdate'][$key] as $j => $l) {
                if(!empty($l) && !empty($arr['package_date_price_enddate'][$key][$j]) && !empty($arr['package_date_price'][$key][$j])){
                    $datePrice->data(array(
                        'package_id' => $packageId,
                        'startdate' => $l,
                        'enddate' => $arr['package_date_price_enddate'][$key][$j],
                        'price' => $arr['package_date_price'][$key][$j]
                    ))->add();
                }
            }
            
            foreach ($arr['package_promotion_startdate'][$key] as $a => $s) {
                if(!empty($s) && !empty($arr['package_promotion_enddate'][$key][$a]) && !empty($arr['promotion'][$key][$a])){  
                    $promotionDate->data(array(
                        'package_id' => $packageId,
                        'startdate' => $s,
                        'enddate' => $arr['package_promotion_enddate'][$key][$a],
                        'promotion_id' => $arr['promotion'][$key][$a]
                    ))->add();
                }
            }
            
            foreach ($arr['add_value_name'][$key] as $d => $f) {
                if(!empty($f) && !empty($arr['add_value_name_en'][$key][$d]) && !empty($arr['add_value_price'][$key][$d])){
                    $addValueService->data(array(
                        'package_id' => $packageId,
                        'name' => $f,
                        'name_en' => $arr['add_value_name_en'][$key][$d],
                        'price' => $arr['add_value_price'][$key][$d]
                    ))->add();
                }
            }
        }
        $this->success("编辑商品成功", U("Index/goodsManage"));
    }
    /**
     * [getCityList 根据国家id获取,城市列表]
     * @return [type] [城市JSON列表id,name]
     */
    public function getCityList() {
        $countryId = I('countryid', '');
        $destination = M('destination');
        $where = array(
            'parent_id' => $countryId,
            'type_id' => '1'
        );
        $cityList = $destination->field('id,name')->where($where)->select();
        $this->resultMsg('success', '返回成功', $cityList);
    }
    /**
     * [getVendorList 获取商家详情]
     * @return [type] [description]
     */
    public function getVendorDetail() {
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $table = M('vendors');
        $data = $table->where('id=' . $arr['id'])->find();
        $this->resultMsg('success', '返回成功', $data);
    }
    /**
     * [addVendors 添加商家]
     */
    public function addVendors() {
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $table = D('vendors');
        if (!$table->create($arr)) {
            
            return $this->resultMsg('error', $table->getError());
        }
        if (!$arr['id']) {
            $id = $table->data($arr)->add();
            $data = array(
                'id' => $id,
                'name' => $arr['name']
            );
            $this->resultMsg('success', '添加成功', $data);
        } else {
            $where = array(
                'id' => $arr['id']
            );
            $table->where($where)->save($arr);
            $data = array(
                'id' => $arr['id'],
                'name' => $arr['name']
            );
            $this->resultMsg('success', '编辑成功', $data);
        }
    }
    /**
     * [getVendorList 获取品牌详情]
     * @return [type] [description]
     */
    public function getBrandDetail() {
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $table = M('brand');
        $data = $table->where('id=' . $arr['id'])->find();
        $this->resultMsg('success', '返回成功', $data);
    }
    /**
     * [addVendors 添加品牌]
     */
    public function addBrand() {
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $table = D('brand');
        if (!$table->create($arr)) {
            
            return $this->resultMsg('error', $table->getError());
        }
        if (!$arr['id']) {
            $id = $table->data($arr)->add();
            $data = array(
                'id' => $id,
                'name' => $arr['name']
            );
            $this->resultMsg('success', '添加成功', $data);
        } else {
            $where = array(
                'id' => $arr['id']
            );
            $table->where($where)->save($arr);
            $data = array(
                'id' => $arr['id'],
                'name' => $arr['name']
            );
            $this->resultMsg('success', '编辑成功', $data);
        }
    }
    /**
     * [getChildrenCategory 获取二级分类]
     */
    public function getChildrenCategory() {
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $table = M('ProductCategory');
        $where = array(
            'parent_id' => $arr['id']
        );
        $data = $table->where($where)->select();
        $this->resultMsg('success', '获取二级分类成功', $data);
    }
    /**
     * [getProductAttr 获取类别属性]
     */
    public function getCategoryAttr() {
        if (!IS_POST) {
            E('页面不存在', 404);
        }
        $arr = I();
        $table = D('ProductCategoryAttr');
        $where = array(
            'category_id' => $arr['id']
        );
        $data = $table->where($where)->select();
        
        foreach ($data as $key => $value) {
            if ($value['type'] != "input" || $value['type'] != "textarea") {
                $option = M('ProductCategoryAttrOption');
                $where = array(
                    'attr_id' => $value['id']
                );
                $res = $option->where($where)->select();
                $data[$key]['options'] = $res;
            }
        }
        $this->resultMsg('success', '获取属性列表成功', $data);
    }

    /**
     * 是否发布产品
     */
    public function isShow(){
        $arr = I();
        $pid = $arr['pid'];
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

    /**
     * [delProduct 真实删除商品]
     * @return [type] [description]
     */
    public function delRealProduct(){
        $arr = I();
        $pid = $arr['pid'];
        $product = M('product');
        $cost = M('CostDescription');
        $ratio = M('DeductFineRatio');
        $notice = M('notice');
        $package = M('package');
        $relatinal = M('ProductAttrRelational');
        $addValue = M('PackageAddValueService');
        $datePrice = M('PackageDatePrice');
        $noProvideDate = M('PackageNoProvideDate');
        $promotionDate = M('PackagePromotionDate');
        $detailImages = M('ProductDetailImages');
        $where = array('id'=>$pid);
        $whereOne = array('product_id'=>$pid);
        $product->where($where)->delete();
        $costData = $cost->where($whereOne)->find();
        $ratio->where(array('cost_id'=>$costData['id']))->delete();
        $cost->where($whereOne)->delete();
        $notice->where($whereOne)->delete();
        $packageId = $package->where($whereOne)->find();
        $whereTwo = array('package_id'=>$packageId['id']);
        $noProvideDate->where($whereTwo)->delete();
        $promotionDate->where($whereTwo)->delete();
        $datePrice->where($whereTwo)->delete();
        $addValue->where($whereTwo)->delete();
        $package->where($whereOne)->delete();
        $detailImages->where($whereOne)->delete();
        $relatinal->where($whereOne)->delete();
        $this->resultMsg('success', '删除成功','1');
    }
    
    /**
     * [delProduct 删除商品]
     * @return [type] [description]
     */
    public function delProduct(){
        $arr = I();
        $pid = $arr['pid'];
        $product = M('product');
        $where = array('id'=>$pid);
        $product->where($where)->save(array('is_show'=>0,'is_del'=>1));
        $this->resultMsg('success', '删除成功','1');
    }

    /**
     * [qiniuUploadToken 返回七牛上传token]
     * @return [type] [description]
     */
    public function qiniuUploadToken() {
        $config = C('QINIU_CONFIG');
        $qiniu = new QiniuStorage($config);
        $token = $qiniu->UploadToken($qiniu->sk, $qiniu->ak, $config);
        $data = array(
            'uptoken' => $token
        );
        $this->ajaxReturn($data);
    }
}
