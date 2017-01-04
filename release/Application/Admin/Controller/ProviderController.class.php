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

class ProviderController extends BaseController {
    /**
     * [providerManage 服务商管理]
     * @return [type] [description]
     */
    public function index(){
        $arr = I();
        $vendors = M('vendors');
        $relation = M('vendorsCategoryRelation');
        $table = D('ProductCategory');
        $categorys = $table->where(array('parent_id'=>0))->select();
        $pagesize = C('BACKEND_PAGESIZE');

        $where = array();
        if($arr['search']){
            $where['name']=array('like',"%".$arr['search']."%");
            $str = " and name like '%".$arr['search']."%'";
        }

        if($arr['categoryid']){
            $dao = M();
            $data = $dao->query("SELECT * from vendors where id in (SELECT vendors_id from vendors_category_relation where category_id = '%s') ",$arr['categoryid']);
            $count = count($data);
            $page = getpage($count,$pagesize);
            $result = $dao->query("SELECT * from vendors where id in (SELECT vendors_id from vendors_category_relation where category_id = '%s') limit %s,%s",$arr['categoryid'],$page->firstRow,$page->listRows);
        }else{
            $count = $vendors->where($where)->count();
            $page = getpage($count,$pagesize);
            $result = $vendors->where($where)->limit($page->firstRow.','.$page->listRows)->select();
        }

        foreach ($result as $key => $value) {
            $condition = array('vendors_id'=>$value['id']);
            $relat = $relation->where($condition)->select();
            $str = "";
            foreach ($relat as $k => $v) {
                $cid = $v['category_id'];
                $category = $table->where(array('id'=>$cid))->find();
                $str.=$category['name'].',';
            }
            $str = substr($str,0,-1);
            $result[$key]['category'] = $str;
        }
        $totalPage = ceil($count/$pagesize);
        $totalSize = $count;
        $nowPage = $arr['p'] && $arr['p'] > 1 ? $arr['p'] : 1;
        $this->assign('page',$page->show());
        $this->assign('result', $result); // 赋值数据集
        $this->assign('nowPage',$nowPage);
        $this->assign('categorys',$categorys);
        $this->assign('totalSize',$totalSize);
        $this->assign('totalPage',$totalPage);
        $this->assign('categoryid',$arr['categoryid']);
        $this->assign('keywords',$arr['search']);

        $this->display();
    }


    public function addProvider(){
    	$table = M('ProductCategory');
        $condition = array(
            'parent_id' => 0
        );
        $categorys = $table->where($condition)->select();
        $this->assign('categorys', $categorys);
        $this->display();
    }

    public function addProviderMethod(){
    	$arr = I();
        $vendors = M('vendors');
    	$relation = M('vendorsCategoryRelation');
        $contact = M('vendorsContactsType');

        $data = array(
            'uid' =>is_admin(),
            'name' =>$arr['name'],
            'name_en' =>$arr['name_en'],
            'address' =>$arr['address'],
            'contract_expires'=>$arr['contract_expires'],
            'other'=>$arr['other'],
            'icon'=>$arr['icon']
        );
        $vid = $vendors->data($data)->add();

        foreach ($arr['contacts'] as $key => $value) {
            $contact->data(array('vendors_id'=>$vid,'contacts'=>$value,'mobile'=>$arr['mobile'][$key],'email'=>$arr['email'][$key]))->add();
        }

        foreach ($arr['product_category_id'] as $k => $v) {
            $relation->data(array('vendors_id'=>$vid,'category_id'=>$v))->add();
        }

        $this->redirect('Provider/editProvider/', array(
            'id' => $vid
        ));
    }

    public function editProvider(){
        $arr = I();
        $vendors = M('vendors');
        $relation = M('vendorsCategoryRelation');
        $contact = M('vendorsContactsType');
        $table = D('ProductCategory');
        $vendorData = $vendors->where(array('id'=>$arr['id']))->find();
        $relationData = $relation->where(array('vendors_id'=>$arr['id']))->select();
        $categorys = $table->where(array('parent_id'=>0))->select();
        $contactData = $contact->where(array('vendors_id'=>$arr['id']))->select();
        $this->assign('vendorsid',$arr['id']);
        $this->assign('contactData',$contactData);
        $this->assign('relationData',$relationData);
        $this->assign('categorys',$categorys);
        $this->assign('vendorData', $vendorData);
        $this->display();
    }

    public function editProviderMethod(){
        $arr = I();
        $vendors = M('vendors');
        $relation = M('vendorsCategoryRelation');
        $contact = M('vendorsContactsType');

        $data = array(
            'uid' =>is_admin(),
            'name' =>$arr['name'],
            'name_en' =>$arr['name_en'],
            'address' =>$arr['address'],
            'contract_expires'=>$arr['contract_expires'],
            'other'=>$arr['other'],
            'icon'=>$arr['icon']
        );

        $vendors->where(array('id'=>$arr['id']))->data($data)->save();
        $relation->where(array('vendors_id'=>$arr['id']))->delete();
        $contact->where(array('vendors_id'=>$arr['id']))->delete();

        foreach ($arr['contacts'] as $key => $value) {
            $contact->data(array('vendors_id'=>$arr['id'],'contacts'=>$value,'mobile'=>$arr['mobile'][$key],'email'=>$arr['email'][$key]))->add();
        }

        foreach ($arr['product_category_id'] as $k => $v) {
            $relation->data(array('vendors_id'=>$arr['id'],'category_id'=>$v))->add();
        }

        $this->redirect('Provider/editProvider/', array(
            'id' => $arr['id']
        ));

    }

    public function copyProvider(){
        $arr = I();
        $vendors = M('vendors');
        $relation = M('vendorsCategoryRelation');
        $contact = M('vendorsContactsType');
        $vdata = $vendors->where(array('id'=>$arr['id']))->find();
        unset($vdata['id']); //删除数据id
        $vid = $vendors->add($vdata);
        $rdata = $relation->where(array('vendors_id'=>$arr['id']))->select();
        foreach ($rdata as $key => $value) {
            unset($rdata[$key]['id']);
            $rdata[$key]['vendors_id'] = $vid;
        }
        $relation->addAll($rdata);
        $cdata = $contact->where(array('vendors_id'=>$arr['id']))->select();
        foreach ($cdata as $k => $v) {
            unset($cdata[$k]['id']);
            $cdata[$k]['vendors_id'] = $vid;
        }
        $contact->addAll($cdata);
        $uid = is_admin();
        $user = M('user');
        $userData = $user->where(array('id'=>$uid))->find();
        $this->resultMsg('success','复制服务商成功',array('id' =>$vid,'upname'=>$userData['username']));
    }
}
