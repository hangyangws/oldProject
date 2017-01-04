<?php
namespace Admin\Model;
use Think\Model\ViewModel;
class UserViewModel extends ViewModel {
	Protected $viewFields = array(
		'user' => array(
			'id', 'username', 'roles', 'is_lock',
			'_type' => 'LEFT'
			),
		'user_info' => array(
			'*',
			'_on' => 'user.id = user_info.uid'
		)
	);
	public function getUser($uid){
		$where = array('id'=>$uid);
		$result = $this->where($where)->find();
		return $result;
	}

}