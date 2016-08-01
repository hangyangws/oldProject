

<?php
    $data = array('name'=>'商家名称', 'address'=>'商家地址', 'contacts'=>'联系人', 'mobile'=>'联系人', 'email'=>'联系人', 'other'=>'其他ff');
    $info = array('status'=>'success', 'message'=>'登陆成功', 'data'=>$data);
    echo json_encode($info);
    // {
    //     'status': 'success',
    //     'message': 'ok',
    //     'data': {
    //         'name': '商家名称',
    //         'address': '商家地址',
    //         'contacts': '联系人',
    //         'mobile': '联系人',
    //         'email': '联系人',
    //         'other': '其他ff'
    //     }
    // }
?>