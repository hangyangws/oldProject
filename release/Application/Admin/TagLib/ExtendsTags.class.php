<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: kerry.gao <1509699669@vip.qq.com> <http://weibo.com/coderzero>
// +----------------------------------------------------------------------

namespace Admin\TagLib;
use Think\Template\TagLib;

class ExtendsTags extends TagLib {

	    // 标签定义
    protected $tags   =  array(
        // 标签定义： attr 属性列表 close 是否闭合（0 或者1 默认1） alias 标签别名 level 嵌套层次
        'getusername'    =>  array('attr'=>'uid','close'=>0),
        'getregion'    =>  array('attr'=>'destination','close'=>0),
        'geticonurl'    =>  array('attr'=>'iconid','close'=>0)
    );


   public function _getusername ($tag, $content) {
        $uid = $tag['uid'];
        $uid   =  $this->autoBuildVar($uid);
        $str = '<?php ';
        $str.= '$table = M("user");';
        $str.= '$where = array("id"=>'.$uid.');';
        $str.= '$user = $table->where($where)->field("username")->find();';
        $str.= 'echo $user["username"];';
        $str.= '?>';
        return $str;
    }

    public function _getregion($tag, $content){
        $destinationId = $tag['destination'];
        $destination = $this->autoBuildVar($destinationId);
        $str = '<?php ';
        $str.= '$table = M("destination");';
        $str.= '$whereOne = array("id"=>'.$destination.');';
        $str.= '$oneRet = $table->where($whereOne)->find();';
        $str.= '$whereTwo = array("id"=>$oneRet["parent_id"]);';
        $str.= '$twoRet = $table->where($whereTwo)->find();';
        $str.= '$str = $oneRet["name"];';
        $str.= 'if($twoRet["name"])
        {
            $str=$twoRet["name"]."-".$oneRet["name"];
        }';
        $str.= 'echo $str;';
        $str.= '?>';
        return $str;
    }

    public function _geticonurl($tag, $content){
        $iconid = $tag['iconid'];
        $iconid = $this->autoBuildVar($iconid);
        $str = '<?php ';
        $str.= '$table = M("icon_area_manager");';
        $str.= '$where = array("id"=>'.$iconid.');';
        $str.= '$res = $table->where($where)->find();';

        $str.= 'if($res["icon_url"]){
            $str = "<img class=\"icon_id pr z1\" class=\"db\" src=\"__PUBLIC__/Admin/images/icon_area/".$res["icon_url"]."\" />";
        }else{
            $str = "<img class=\"icon_id pr z1\" class=\"db\" src=\"__PUBLIC__/Admin/images/icon_area/choice_photo.png\" />";
        }';
        $str.= 'echo $str;';
        $str.= '?>';
        return $str;
    }
}