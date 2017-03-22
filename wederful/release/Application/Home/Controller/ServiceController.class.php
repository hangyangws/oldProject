<?php
namespace Home\Controller;
use Think\Controller;

class ServiceController extends BaseController {

    public function index() {
        $arr = I();
        $pageNum =$arr['p'] ? $arr['p'] : 1;
        $area = $_SERVER['AREA'];//当前地区
        $destinationid = $arr['area'];
        $destination = M('destination');
        $product = M('product');
        $vendors = M('vendors');
        $package = M('package');
        $option = M('ProductCategoryAttrOption');
        $ProductCategory = M('ProductCategory');
        $destinationData = $destination->where(array(
            'id' => $destinationid
        ))->find();

        if (!$destinationData) {
            $this->error('当前目的地不存在');
        }
        $model = M();
        $productCategoryData = $ProductCategory->where(array(
            'parent_id' => '0'
        ))->select();

        foreach ($productCategoryData as $h => $l) {
            $condition = array('p.is_del'=>'0','k.is_show'=>'1','k.is_del'=>'0','k.area_id'=>$destinationid,'p.category_id'=>$l['id']);
            $pd = $model->table('product p')->join('package k on p.id=k.product_id')->field('p.*')->where($condition)->count();
            if(!$pd){
                $productCategoryData[$h]['is_show'] = 0;
            }else{
                $productCategoryData[$h]['is_show'] = 1;
            }
        }
        $categoryArray = array();
        $cid = $_SERVER['CID'];//默认选中分类为场地
        foreach ($productCategoryData as $x => $y) {
            if($y['is_show']){
                $categoryArray[] =$y;
            }
        }
        if($categoryArray){
            if(!isset($cid) || !$cid){
                $cid = $categoryArray[0]['id'];//如果没有场地默认选中第一个分类
            }
            if($cid == 55){
                $categoryName = 'venue';
            }else if($cid == 56){
                $categoryName = 'prewedding';
            }else if($cid == 57){
                $categoryName = 'wedding';
            }

            $_SERVER['CATEGORY'] = $categoryName;
        }

           switch ($area) {
                case 'bali':
                    if($categoryName =='venue'){                    
                        $title = '巴厘岛婚礼_巴厘岛婚礼场地_婚礼策划-Wederful海外婚礼';
                        $keywords = '巴厘岛婚礼,巴厘岛婚礼场地,巴厘岛婚礼策划';
                        $description = 'Wederful海外婚礼，为广大新人提供众多巴厘岛婚礼场地，巴厘岛婚礼场地,巴厘岛婚礼策划，更多服务请咨询专业的婚嫁社区Wederful海外婚礼热线：400-070-2080';
                    }else{
                        $title = '巴厘岛婚纱摄影_婚礼摄影-Wederful海外婚礼';
                        $keywords = '巴厘岛婚纱摄影,巴厘岛婚礼摄影';
                        $description = 'Wederful海外婚礼，为广大新人提供众多巴厘岛婚纱摄影，更多服务请咨询专业的婚嫁社区Wederful海外婚礼热线：400-070-2080';
                    }
                    break;
                case 'maldive':
                    $title = '马尔代夫婚礼_马尔代夫婚礼场地_婚礼策划-Wederful海外婚礼';
                    $keywords = '马尔代夫婚礼,马尔代夫场地,马尔代夫婚礼策划';
                    $description = 'Wederful海外婚礼，为广大新人提供众多马尔代夫婚礼场地，马尔代夫婚礼场地,马尔代夫婚礼策划，更多服务请咨询专业的婚嫁社区Wederful海外婚礼热线：400-070-2080';
                    break;
                case 'australia':
                    $title = '澳大利亚婚礼_澳大利亚婚礼场地_婚礼策划-Wederful海外婚礼';
                    $keywords = '澳大利亚婚礼,澳大利亚场地,澳大利亚婚礼策划';
                    $description = 'Wederful海外婚礼，为广大新人提供众多澳大利亚婚礼场地，澳大利亚婚礼场地,澳大利亚婚礼策划，更多服务请咨询专业的婚嫁社区Wederful海外婚礼热线：400-070-2080';
                    break;
                case 'thailand':
                    $title = '泰国婚礼_泰国婚礼场地_婚礼策划-Wederful海外婚礼';
                    $keywords = '泰国婚礼,泰国婚礼场地,泰国婚礼策划';
                    $description = 'Wederful海外婚礼，为广大新人提供众多泰国婚礼场地，泰国婚礼场地,泰国婚礼策划，更多服务请咨询专业的婚嫁社区Wederful海外婚礼热线：400-070-2080';
                    break;
                case 'japan':
                    $title = '日本婚礼_日本婚礼场地_婚礼策划-Wederful海外婚礼';
                    $keywords = '日本婚礼,日本婚礼场地,日本婚礼策划';
                    $description = 'Wederful海外婚礼，为广大新人提供众多日本婚礼场地，日本婚礼场地,日本婚礼策划，更多服务请咨询专业的婚嫁社区Wederful海外婚礼热线：400-070-2080';
                    break;
                case 'unitedkingdom':
                    $title = '英国婚礼_英国婚礼场地_婚礼策划-Wederful海外婚礼';
                    $keywords = '英国婚礼,英国婚礼场地,英国婚礼策划';
                    $description = 'Wederful海外婚礼，为广大新人提供众多英国婚礼场地，英国婚礼场地,英国婚礼策划，更多服务请咨询专业的婚嫁社区Wederful海外婚礼热线：400-070-2080';
                    break;           
            }

        $categoryId = isset($arr['categoryid']) ? $arr['categoryid'] : $cid; //判断是否传分类id 默认为47
        $condition = array('p.is_del'=>'0','k.is_show'=>'1','k.is_del'=>'0','k.area_id'=>$destinationid,'p.category_id'=>$categoryId);
        $count = $model->table('product p')->join('package k on p.id=k.product_id')->field('p.*')->where($condition)->count('distinct(p.id)');
        
        $page = getpage($count,6);
        $page->route = 'service';//开启服务商列表路由分页
        $productData = $model->table('product p')->Distinct(true)->join('package k on p.id=k.product_id')->field('p.*')->where($condition)->limit($page->firstRow.','.$page->listRows)->select();

        foreach ($productData as $key => $value) {
            $vend = $vendors->where(array(
                'id' => $value['vendors_id']
            ))->find();
            $productData[$key]['vendor'] = $vend;
            $category = $ProductCategory->where(array(
                'id' => $value['category_id']
            ))->find();
            $productData[$key]['categoryname'] = $category['name'];
            $price = $model->query("SELECT min(price) as price from package where product_id = '%s' and is_del ='0' and is_show='1'",$value['id']);
            if($price){
                $productData[$key]['startPrice'] = number_format(usdtosny($price[0]['price']));
            }else{
                 $productData[$key]['startPrice'] = 0;
            }

            $model = M();
            $arrA = array();

            $iconAttrData = $model->table('product_attr_relational as a')->join('product_category_attr as p on a.attr_id = p.id')->where("a.product_id='%s' and p.is_detail = 1",$value['id'])->select();  
            foreach ($iconAttrData as $k => $v) {
                if($v['name']=='场地类型'){
                    $ic = $option->where(array('id'=>$v['value']))->find();
                    $productData[$key]['option'] = $ic['option'];
                }
            }
        }


        $this->assign('title',$title);
        $this->assign('keywords',$keywords);
        $this->assign('description',$description);
        $this->assign('destinationData', $destinationData);
        $this->assign('ProductCategoryData', $productCategoryData);
        $this->assign('productData', $productData);
        $this->assign('page',$page->show());
        $this->assign('destinationid',$destinationid);
        $this->assign('categoryId',$categoryId);
        $this->assign('pageNum',$pageNum);
        $this->assign('area',$area);
        $this->assign('categoryName',$categoryName);
        $this->display();
    }

    public function serviceDetail() {
        $arr = I();
        $pid = $arr['id'];
        $area = $_SERVER['AREA'];
        $areaId = $arr['area'];
        $product = M('product');
        $vendors = M('vendors');
        $package = M('package');
        $notice = M('notice');
        $categoryAttr = M('ProductCategoryAttr');
        $option = M('ProductCategoryAttrOption');
        $relation = M('ProductAttrRelational');
        $productCategory = M('ProductCategory');
        $addValue = M('PackageAddValueService');
        $iconManage= M('IconManager');
        $detailImages = M('ProductDetailImages');
        $destination = M('destination');
        $destinationInfo = M('destinationInfo');
        $destinationData = $destination->where(array(
            'id' => $areaId
        ))->find();
        $model = M();
        $infoData = $destinationInfo->where(array('dest_id'=>$areaId))->select();
        $manage = M('iconAreaManager');
        foreach ($infoData as $e => $u) {
            $m = $manage->where(array('id'=>$u['icon_area_id']))->find();
            $infoData[$e]['url'] = $m['icon_url'];      
        }
        if(!$destinationData){
            $this->error('当前目的地不存在');
        }
        $product->where(array('id'=>$pid))->setInc('visit_num');
        $productData = $product->where(array('id'=>$pid))->find();
        $vendorsData = $vendors->where(array('id'=>$productData['vendors_id']))->find();
        $detailImagesData = $detailImages->where(array('product_id'=>$pid))->select();
        $packageData = $package->where(array('product_id'=>$pid,'is_show'=>'1'))->order('package_no asc')->select();
        foreach ($packageData as $key => $value) {
            $addService = $addValue->where(array('package_id'=>$value['id']))->select();
            foreach ($addService as $k => $v) {
                $addService[$k]['price'] = number_format(usdtosny($v['price']));
            }
            $packageData[$key]['addValue'] = $addService;
            $packageData[$key]['price'] = number_format(usdtosny($packageData[$key]['price']));
            $packageData[$key]['out_charge'] = usdtosny($packageData[$key]['out_charge']);
            $collection = M('userCollection');
            $status = is_login();
            $is_collection = $collection->where(array('uid'=>$status,'package_id'=>$value['id']))->find();
            $packageData[$key]['is_collection'] = $is_collection ? '1' : '0';//是否收藏此套餐
        }

        $iconAttrData = $model->table('product_attr_relational as a')->join('product_category_attr as p on a.attr_id = p.id')->where("a.product_id='%s' and p.is_detail = 1",$pid)->select();
        foreach ($iconAttrData as $k => $v) {
           if($v['type']=='input' || $v['type']=='textarea'){
                $icon = $iconManage->where(array('id'=>$v['icon_id']))->find();
           }else{
                $ic = $option->where(array('id'=>$v['value']))->find();
                $icon = $iconManage->where(array('id'=>$ic['icon_id']))->find();
                $icon['option'] = $ic['option'];
           }
           $iconAttrData[$k]['icon'] = $icon;
        }

        $textAttrData = $model->table('product_attr_relational as a')->join('product_category_attr as p on a.attr_id = p.id')->where("a.product_id='%s' and p.is_detail = 0",$pid)->select();
        
        foreach ($textAttrData as $text_k => $text_v) {
            if ($text_v['type'] != "input" || $text_v['type'] != "textarea") {
                $res = $option->where(array('attr_id' => $text_v['id']))->select();
                $textAttrData[$text_k]['options'] = $res;
            }
            $rdata = $relation->field('value')->where(array(
                'attr_id' => $text_v['id'],
                'product_id' => $pid
            ))->find();
            if ($text_v['type'] == 'checkbox') {
                $textAttrData[$text_k]['value'] = explode("|", $rdata['value']);
            } else {
                $textAttrData[$text_k]['value'] = $rdata['value'];
            }
        }

        $noticeData =$notice->where(array('product_id'=>$pid))->find();
        $productData['vendorLogo'] = $vendorsData['icon'];
        $productData['vendorName'] = $vendorsData['name'];
        $productData['ImagesData'] = $detailImagesData;
        $productData['packageData'] = $packageData;
        $productData['noticeData'] = $noticeData;
        $productData['iconAttrData'] = $iconAttrData;
        $productData['textAttrData'] = $textAttrData;
        $condition = array('p.is_del'=>'0','k.is_show'=>'1','k.is_del'=>'0','k.area_id'=>$areaId);
        $rand = $model->table('product p')->join('package k on p.id=k.product_id')->field('p.*')->where($condition)->order('rand()')->limit(12)->select();

        foreach ($rand as $l => $p) {
            $vend = $vendors->where(array(
                'id' => $p['vendors_id']
            ))->find();
            $rand[$l]['vendor'] = $vend;
            $category = $productCategory->where(array(
                'id' => $p['category_id']
            ))->find();
            $rand[$l]['categoryname'] = $category['name'];
            $price = $model->query("SELECT min(price) as price from package where product_id = '%s'",$p['id']);
            if($price){
                $rand[$l]['startPrice'] = number_format(usdtosny($price[0]['price']));
            }else{
                 $rand[$l]['startPrice'] = 0;
            }

            $arrA = array();
            $iconAttrData = $model->table('product_attr_relational as a')->join('product_category_attr as p on a.attr_id = p.id')->where("a.product_id='%s' and p.is_detail = 1",$p['id'])->select();  
            foreach ($iconAttrData as $k => $v) {
                if($v['name']=='场地类型'){
                    $ic = $option->where(array('id'=>$v['value']))->find();
                    $rand[$l]['option'] = $ic['option'];
                }
            }
        }

        
        $this->assign('infoData', $infoData);
        $this->assign('rand', $rand);
        $this->assign('areaId', $areaId);
        $this->assign('area',$area);
        $this->assign('destinationData', $destinationData);
        $this->assign('randLength', ceil(count($rand)/3));
        $this->assign('productData', $productData);
        $this->display();
    }
    
    public function getGoodDatePrice(){
        $arr = I();
        $pid = $arr['pid'];
        $date = $arr['date'];
        if($date < date('Y-m-d')){
            $this->resultMsg('error','选择日期不能小于今天','0');
        }
        $package = M('package');
        $model = M();
        $count = $model->query("SELECT count(*) as count from package_no_provide_date where package_id = '%s' and '%s' BETWEEN startdate and enddate",$pid,$date);
        if(!$count[0]['count']){
            $price = $model->query("SELECT price from package_date_price where package_id = '%s' and '%s' BETWEEN startdate and enddate",$pid,$date);
            if(count($price)>1){
                $this->resultMsg('error','请联系管理员','0');
            }else if(count($price) == 1){
                $this->resultMsg('success','当前价格',usdtosny($price[0]['price']));
            }else{
                $pack = $package->where(array('id'=>$pid))->find();
                $this->resultMsg('success','当前价格',usdtosny($pack['price']));
            }
        }else{
            $this->resultMsg('success','当日不可提供价格','0');
        }
    }

    public function placeOrder(){
        if($status = is_login()){
            $arr = I();
            $proName = $arr['name'];
            $number = $arr['number'];
            $date = $arr['date'];
            $addArr = $arr['add'];
            $str = "";
            foreach ($addArr as $key => $value) {
                $str.=($key+1).'.'.$value['name']."<br>";
            }
            sendMail('hi@wederful.com', '用户下单提醒', '申请时间：'.date('y-m-d h:i:s',time()).'<br>申请产品：'.$proName.'<br>服务日期：'.$date.'（婚礼服务日期）<br>人数：'.$number.'人<br>增值服务：<br>'.$str);
            $this->resultMsg('success','下单成功');
        }else{
            $this->resultMsg('error','尚未登录');
        }

        
    }

}
