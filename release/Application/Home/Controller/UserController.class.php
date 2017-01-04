<?php
namespace Home\Controller;
use Think\Controller;

class UserController extends BaseController {
    public function index() {
        $arr = I();
        if($uid = session('uid')){
            $user = D('Admin/UserView');
            $data = $user->getUser($uid);
            if(IS_POST){
                $info = M('userInfo');
                if(empty($arr['nickname'])){
                    $this->error('昵称不能为空');
                }else{
                    $condition['uid']  = array('neq',session('uid'));
                    $condition['nickname'] = $arr['nickname'];
                    $data = $info->where($condition)->find();
                    if($data){
                        $this->error('昵称已经存在');
                    }
                }
                $info->where(array('uid'=>$uid))->save(array('nickname'=>$arr['nickname'],
                'email'=>$arr['email'],'sex'=>$arr['sex'],'wedding_location'=>$arr['wedding_location'],
                'country_id'=>$arr['country_id'],'province_id'=>$arr['province_id'],'city_id'=>$arr['city_id'],
                'wedding_date'=>$arr['wedding_date']));
                $this->redirect('/account');
            }

            $this->assign('data',$data);
            $this->display();
        }else{
            $this->error('尚未登录',U('Home/index'));
        }
    }

    public function collectionPackage(){
    	$arr = I();
    	if($status = is_login()){
    		$collection = M('userCollection');
    		$where = array('uid'=>$status,'package_id'=>$arr['pid']);
    		$data = $collection->where($where)->find();
    		if($data){
    			$collection->where($where)->delete();
				$this->resultMsg('success','取消收藏','0');
    		}
    		else{
    			$collection->data($where)->add();
    			$this->resultMsg('success','收藏成功','1');
    		}
    	}
    	else{
    		$this->resultMsg('error','尚未登录','0');
    	}
    }

    /**
     * [delCollectionPackage 删除收藏]
     * @return [type] [description]
     */
    public function delCollectionPackage(){
        $arr = I();
        if($status = is_login()){
            $collection = M('userCollection');
            $pids = $arr['pids'];
            $where['uid'] = array('EQ',$status);
            $where['package_id'] = array('IN',$pids);
            $collection->where($where)->delete();
            $this->resultMsg('success','删除成功','1');
        }else{
            $this->resultMsg('error','尚未登录','0');
        }
    }

    public function favorites(){
        if($uid = session('uid')){
            $userCollection = M('userCollection');
            $condition = array('uid'=>$uid);
            $count = $userCollection->where($condition)->count();// 查询满足要求的总记录数
            $page = getpage($count,10);
            $data = $userCollection->where($condition)->limit($page->firstRow.','.$page->listRows)->select();
            $package = M('package');
            $product = M('product');
            $iconManage= M('IconManager');
            $option = M('ProductCategoryAttrOption');
            $model = M();
            foreach ($data as $key => $value) {
                $pdata = $package->where(array('id'=>$value['package_id']))->find();
                $iconAttrData = $model->table('product_attr_relational as a')->join('product_category_attr as p on a.attr_id = p.id')->where("a.product_id='%s' and p.is_detail = 1",$pdata['product_id'])->select();
                $proData = $product->where(array('id'=>$pdata['product_id']))->find();
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
                $data[$key]['pro'] = $iconAttrData;
                $data[$key]['price'] = number_format(usdtosny($pdata['price']));
                $data[$key]['pic'] = $proData['thumbnail'];
                $data[$key]['name'] = $pdata['name'];
                $data[$key]['name_en'] = $pdata['name_en'];
                $data[$key]['pid'] = $proData['id'];
                $data[$key]['areaid'] = $pdata['area_id'];
            }
            $this->assign('page',$page->show());
            $this->assign('data',$data);
            $this->display();
        }else{
            $this->error('尚未登录');
        }
    }

}
