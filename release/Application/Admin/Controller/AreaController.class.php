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

class AreaController extends BaseController {

  public function index(){
    $arr = I();
    $table = M('destination');
    $count = $table->count();
    $pagesize = C('BACKEND_PAGESIZE');
    $page = getpage($count,$pagesize);
    $result = $table->limit($page->firstRow.','.$page->listRows)->select();
    $totalSize = $count;
    $totalPage = ceil($count/$pagesize);
    $nowPage = $arr['p'] && $arr['p'] > 1 ? $arr['p'] : 1;

    $this->assign('page',$page->show());
    $this->assign('result', $result); // 赋值数据集
    $this->assign('nowPage',$nowPage);
    $this->assign('totalSize',$totalSize);
    $this->assign('totalPage',$totalPage);
    $this->display();
  }

    public function addArea(){
    	$icon = M('iconAreaManager');
    	$icons = $icon->select();
		  $this->assign('icons',$icons);
      $this->display();
    }

    public function addAreaMethod(){
    	$arr = I();
    	$destination = M('destination');
        $destinationInfo = M('destinationInfo');
        $name = $arr['name'];
        $name_en = $arr['name_en'];
        $bigpic = $arr['bigpic'];
        $smallpic = $arr['smallpic'];
        $visa_pic = $arr['visa_pic'];
        $traffic_pic = $arr['traffic_pic'];
        $stay_pic = $arr['stay_pic'];
        $consumption_pic = $arr['consumption_pic'];
        $climate_pic = $arr['climate_pic'];
        $other_pic = $arr['other_pic'];
        $visa_pic_title = $arr['visa_pic_title'];
        $traffic_pic_title = $arr['traffic_pic_title'];
        $stay_pic_title = $arr['stay_pic_title'];
        $consumption_pic_title = $arr['consumption_pic_title'];
        $climate_pic_title = $arr['climate_pic_title'];
        $other_pic_title = $arr['other_pic_title'];

        $array = array(
            'name' => $name,
            'name_en' => $name_en,
            'short_name' => $name_en,
            'type_id' => '0',
            'bigpic' =>$bigpic,
            'smallpic'=>$smallpic,
            'visa_pic'=>$visa_pic,
            'traffic_pic'=>$traffic_pic,
            'stay_pic'=>$stay_pic,
            'consumption_pic'=>$consumption_pic,
            'climate_pic' =>$climate_pic,
            'other_pic'=>$other_pic,
            'uid' =>is_admin(),
            'createtime'=>date('Y-m-d H:i:s'),
            'visa_pic_title'=>$visa_pic_title,
            'traffic_pic_title'=>$traffic_pic_title,
            'stay_pic_title'=>$stay_pic_title,
            'consumption_pic_title'=>$consumption_pic_title,
            'climate_pic_title'=>$climate_pic_title,
            'other_pic_title'=>$other_pic_title
        );

        $destId = $destination->data($array)->add();

        foreach ($arr['content']['\'visa\''] as $a => $b) {
            $data = array('content'=>$b,'icon_area_id'=>$arr['iconId']['\'visa\''][$a],'type'=>'visa','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'traffic\''] as $c => $d) {
            $data = array('content'=>$d,'icon_area_id'=>$arr['iconId']['\'traffic\''][$c],'type'=>'traffic','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'stay\''] as $e => $f) {
            $data = array('content'=>$f,'icon_area_id'=>$arr['iconId']['\'stay\''][$e],'type'=>'stay','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'consumption\''] as $g => $h) {
            $data = array('content'=>$h,'icon_area_id'=>$arr['iconId']['\'consumption\''][$g],'type'=>'consumption','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'climate\''] as $i => $j) {
            $data = array('content'=>$j,'icon_area_id'=>$arr['iconId']['\'climate\''][$i],'type'=>'climate','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'other\''] as $k => $l) {
            $data = array('content'=>$l,'icon_area_id'=>$arr['iconId']['\'other\''][$k],'type'=>'other','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        $this->redirect('Area/editArea/', array(
            'destid' => $destId
        ));
    }

    public function editArea(){
        $arr = I();
        $destination = M('destination');
        $destinationInfo = M('destinationInfo');
        $data = $destination->where(array('id'=>$arr['destid']))->find();

        $visaData =$destinationInfo->where(array('dest_id'=>$arr['destid'],'type'=>'visa'))->select();
        $trafficData =$destinationInfo->where(array('dest_id'=>$arr['destid'],'type'=>'traffic'))->select();
        $stayData =$destinationInfo->where(array('dest_id'=>$arr['destid'],'type'=>'stay'))->select();
        $consumptionData =$destinationInfo->where(array('dest_id'=>$arr['destid'],'type'=>'consumption'))->select();
        $climateData =$destinationInfo->where(array('dest_id'=>$arr['destid'],'type'=>'climate'))->select();
        $otherData =$destinationInfo->where(array('dest_id'=>$arr['destid'],'type'=>'other'))->select();

        $icon = M('iconAreaManager');
        $icons = $icon->select();
        $this->assign('visaData',$visaData);
        $this->assign('trafficData',$trafficData);
        $this->assign('stayData',$stayData);
        $this->assign('consumptionData',$consumptionData);
        $this->assign('climateData',$climateData);
        $this->assign('otherData',$otherData);
        $this->assign('icons',$icons);
        $this->assign('id',$arr['destid']);
        $this->assign('data',$data);
        $this->display();
    }


    public function editAreaMethod(){
        $arr = I();
        $destination = M('destination');
        $destinationInfo = M('destinationInfo');
        $id = $arr['id'];
        $name = $arr['name'];
        $name_en = $arr['name_en'];
        $bigpic = $arr['bigpic'];
        $smallpic = $arr['smallpic'];
        $visa_pic = $arr['visa_pic'];
        $traffic_pic = $arr['traffic_pic'];
        $stay_pic = $arr['stay_pic'];
        $consumption_pic = $arr['consumption_pic'];
        $climate_pic = $arr['climate_pic'];
        $other_pic = $arr['other_pic'];
        $visa_pic_title = $arr['visa_pic_title'];
        $traffic_pic_title = $arr['traffic_pic_title'];
        $stay_pic_title = $arr['stay_pic_title'];
        $consumption_pic_title = $arr['consumption_pic_title'];
        $climate_pic_title = $arr['climate_pic_title'];
        $other_pic_title = $arr['other_pic_title'];

        $array = array(
            'name' => $name,
            'name_en' => $name_en,
            'short_name' => $name_en,
            'type_id' => '0',
            'bigpic' =>$bigpic,
            'smallpic'=>$smallpic,
            'visa_pic'=>$visa_pic,
            'traffic_pic'=>$traffic_pic,
            'stay_pic'=>$stay_pic,
            'consumption_pic'=>$consumption_pic,
            'climate_pic' =>$climate_pic,
            'other_pic'=>$other_pic,
            'uid' =>is_admin(),
            'createtime'=>date('Y-m-d H:i:s'),
            'visa_pic_title'=>$visa_pic_title,
            'traffic_pic_title'=>$traffic_pic_title,
            'stay_pic_title'=>$stay_pic_title,
            'consumption_pic_title'=>$consumption_pic_title,
            'climate_pic_title'=>$climate_pic_title,
            'other_pic_title'=>$other_pic_title
        );

        $destination->where(array('id'=>$id))->data($array)->save();
        $destinationInfo->where(array('dest_id'=>$id))->delete();
        $destId = $id;
        foreach ($arr['content']['\'visa\''] as $a => $b) {
            $data = array('content'=>$b,'icon_area_id'=>$arr['iconId']['\'visa\''][$a],'type'=>'visa','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'traffic\''] as $c => $d) {
            $data = array('content'=>$d,'icon_area_id'=>$arr['iconId']['\'traffic\''][$c],'type'=>'traffic','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'stay\''] as $e => $f) {
            $data = array('content'=>$f,'icon_area_id'=>$arr['iconId']['\'stay\''][$e],'type'=>'stay','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'consumption\''] as $g => $h) {
            $data = array('content'=>$h,'icon_area_id'=>$arr['iconId']['\'consumption\''][$g],'type'=>'consumption','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'climate\''] as $i => $j) {
            $data = array('content'=>$j,'icon_area_id'=>$arr['iconId']['\'climate\''][$i],'type'=>'climate','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        foreach ($arr['content']['\'other\''] as $k => $l) {
            $data = array('content'=>$l,'icon_area_id'=>$arr['iconId']['\'other\''][$k],'type'=>'other','dest_id'=>$destId);
            $destinationInfo->data($data)->add();
        }

        $this->redirect('Area/editArea/', array(
              'destid' => $destId
        ));
    }

    /**
     * [delArea 删除地区]
     * @return [type] [description]
     */
    public function delArea(){
        $arr = I();
        $id = $arr['id'];
        $destination = M('destination');
        $destinationInfo = M('destinationInfo');
        $destination->where(array('id'=>$id))->delete();
        $destinationInfo->where(array('dest_id'=>$id))->delete();
        $this->resultMsg('success','删除地区成功','1');
    }

    /**
     * [delArea 复制地区]
     * @return [type] [description]
     */
    public function copyArea(){
        $arr = I();
        $id = $arr['id'];
        $nowTime = date('Y-m-d H:i:s');
        $destination = M('destination');
        $user = M('user');
        $uid = is_admin();

        $destinationInfo = M('destinationInfo');
        $descriptiondata =$destination->where(array('id'=>$id))->find();
        $descriptiondata['createtime'] = $nowTime;
        $descriptiondata['uid'] = $uid;
        unset($descriptiondata['id']); //删除数据id
        $destid = $destination->add($descriptiondata);

        $info = $destinationInfo->where(array('dest_id'=>$id))->select();
        foreach ($info as $key => $value) {
            unset($info[$key]['id']);
            $info[$key]['dest_id'] = $destid;
        }
        $destinationInfo->addAll($info);
        $userData = $user->where(array('id'=>$uid))->find();
        $this->resultMsg('success','复制地区成功',array('id' =>$destid,'createtime'=>$nowTime,'upname'=>$userData['username']));
    }

}
