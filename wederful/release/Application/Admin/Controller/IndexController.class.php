<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------
namespace Admin\Controller;
use Think\Controller;
use Think\Upload\Driver\Qiniu\QiniuStorage;

class IndexController extends BaseController {
    public function index() {
        $this->display();
    }

    public function goodsManage() {

        $arr = I();
        $pagesize = C('BACKEND_PAGESIZE');
        $table = M('product');

        $where = array('is_del' =>0);
        if($arr['search']){
            $where['name']=array('like',"%".$arr['search']."%");
        }
        if($arr['countryid']){
            $destination = M('destination');
            $condition = array('parent_id'=>$arr['countryid'],'type_id'=>'1');
            $cityList = $destination->field('id,name')->where($condition)->select();
            $this->assign('cityList',$cityList);
            $cityId = array();
            foreach ($cityList as $key => $value) {
                $cityId[] = $value['id'];
            }
            $where['destination_id'] = array('in',$str);
            if($cityId){
                $where['destination_id'] = array('in',$cityId);
            }else{
                $where['destination_id'] = $arr['countryid'];
            }
            $this->assign('countryid',$arr['countryid']);
        }
        if($arr['destinationid']){
            $where['destination_id'] = $arr['destinationid'];
            $this->assign('destinationid',$arr['destinationid']);
        }
        $count = $table->where($where)->count();
        $page = getpage($count,$pagesize);
        $result = $table->where($where)->order('createtime desc')->limit($page->firstRow.','.$page->listRows)->select();
        $dao = M();
        foreach ($result as $k => $v) {
            $price = $dao->query("SELECT min(price) as price from package where product_id = '%s'",$v['id']);
            $result[$k]['startPrice'] = $price[0]['price'];
        }
        $nowPage = $arr['p'] && $arr['p'] > 1 ? $arr['p'] : 1;
        $totalSize = $count;
        $totalPage = ceil($count/$pagesize);
        $destination = M('destination');
        $countryCondition = array('type_id' => '0');
        $destinationData = $destination->where($countryCondition)->select();
        $this->assign('destinationData', $destinationData);
        $this->assign('result', $result); // 赋值数据集
        $this->assign('nowPage',$nowPage);
        $this->assign('totalSize',$totalSize);
        $this->assign('totalPage',$totalPage);
        $this->assign('keywords',$arr['search']);
        $this->assign('page',$page->show());
        $this->display();
    }

    public function uploadImg(){
        $config = C('UPLOAD_SITEIMG_QINIU');
        $Upload= new\Think\Upload($config);
        $info = $Upload->upload($_FILES);
        if($info){
            $array['status'] = 'success';
            $array['message'] = '上传成功';
            $array['file_path'] = $info['upload_file']['url'];
            $this->ajaxReturn($array, 'json');
        }else{
             return $this->resultMsg('error','上传失败',$array);
        }
    }

}
