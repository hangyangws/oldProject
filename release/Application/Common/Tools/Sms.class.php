<?php

namespace Common\Tools;
use Common\Tools\HttpClient;

class Sms
{
    public $sid = '1dba8de4712af631eb6839fa0711592a';
    public $appId = '2ce4bb9c7f3e463793e3e5066f864b03';
    public $tmplId = '8891';
    public $token = 'a3d37978a61cfcfe4814e0265c716332';

    function __construct($mobile,$params)
    {   
        $this->mobile = $mobile;
        $this->params = $params;
    }

    private function param($params){
        $paramStr = implode(",",$params);
        return $paramStr;
    }

    public function sendSms(){

        $param = $this->param($this->params);
        $time = date('YmdHis').'001';
        $token=$this->token;
        $sign = strtolower(md5($this->sid.$time.$token));
        $postArgs = array(
            'sid'=>$this->sid,
            'appId'=>$this->appId,
            'time'=>$time,
            'sign'=>$sign,
            'to'=>$this->mobile,
            'templateId'=>$this->tmplId,
        );

        $getUrl = http_build_query($postArgs);
        $url = 'http://www.ucpaas.com/maap/sms/code?'.$getUrl.'&param=' .$param;
        $response = HttpClient::get($url);
        if($response['resp']['respCode'] =='000000'){
            return array('status'=>'success');
        }else{
            return array('status'=>'error');
        }
    }

}
