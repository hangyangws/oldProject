<?php
use Common\Tools\Page;
use Common\Tools\HttpClient;
/**
 * 检测用户是否登录
 * @return integer 0-未登录，大于0-当前登录用户ID
 * @author kerry.gao
 */
function is_login() {
    $uid = session('uid');
    if (empty($uid)) {
        return false;
    } else {
       return $uid;
    }
}

/**
 * [is_admin 是否为管理员]
 */
function is_admin() {
    $uid = session('aid');
    if (empty($uid)) {
        return false;
    } else {
       return $uid;
    }
}

/**
 * TODO 基础分页的相同代码封装，使前台的代码更少
 * @param $count 要分页的总记录数
 * @param int $pagesize 每页查询条数
 * @return \Think\Page
 */
function getpage($count, $pagesize = 10) {
    $page = new Page($count, $pagesize);
    $page->rollPage = 6;
    $page->lastSuffix = false;
    $page->setConfig('last','…&emsp;%TOTAL_PAGE%');
    $page->setConfig('first','1&emsp;…');
    $page->setConfig('prev','<');
    $page->setConfig('next','>');
    $page->setConfig('theme','%UP_PAGE% %FIRST% %LINK_PAGE% %END% %DOWN_PAGE%');
    return $page;
}

/**
 * [notRepeatSubmission 防止重复提交]
 * @return [type] [description]
 */
function notRepeatSubmission(){
    $hash = hash('sha256',md5(mt_rand(0,1000000)));
    session('fromhash',$hash);
    return $hash;
}

/**
 * 邮件发送函数
 */
function sendMail($to, $title, $content) {
    Vendor('PHPMailer.PHPMailerAutoload');     
    $mail = new PHPMailer(); //实例化
    $mail->IsSMTP(); // 启用SMTP
    $mail->SMTPDebug = C('MAIL_DEBUG');
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->Host=C('MAIL_HOST'); //smtp服务器的名称（这里以QQ邮箱为例）
    $mail->SMTPAuth = C('MAIL_SMTPAUTH'); //启用smtp认证
    $mail->Username = C('MAIL_USERNAME'); //你的邮箱名
    $mail->Password = C('MAIL_PASSWORD') ; //邮箱密码
    $mail->From = C('MAIL_FROM'); //发件人地址（也就是你的邮箱地址）
    $mail->FromName = C('MAIL_FROMNAME'); //发件人姓名
    $mail->AddAddress($to,"尊敬的客户");
    $mail->WordWrap = 50; //设置每行字符长度
    $mail->IsHTML(C('MAIL_ISHTML')); // 是否HTML格式邮件
    $mail->CharSet=C('MAIL_CHARSET'); //设置邮件编码
    $mail->Subject =$title; //邮件主题
    $mail->Body = $content; //邮件内容
    return($mail->Send());
}

/**
 * [usdtosny 美元转人民币]
 * @return [type] [description]
 */
function usdtosnyApi(){
    $ch = curl_init();
    $url = 'http://apis.baidu.com/apistore/currencyservice/currency?fromCurrency=USD&toCurrency=CNY&amount=1';
    $header = array(
        'apikey: 972dc199d328ec00fb49b3e05f94eb2f',
    );
    // 添加apikey到header
    curl_setopt($ch, CURLOPT_HTTPHEADER  , $header);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    // 执行HTTP请求
    curl_setopt($ch , CURLOPT_URL , $url);
    $res = curl_exec($ch);
    $arr = json_decode($res, true); 
    return round($arr['retData']['currency'],2);
}


function usdtosny($amount = 0){
    $system = M('system_seting');
    $where = array('name'=>'rate');
    $res = $system->where($where)->find();
    return ceil($res['value']*$amount);
}

function getMobileArea($mobile){
    $url = 'http://apistore.baidu.com/microservice/mobilephone?tel='.$mobile;
    $response = HttpClient::get($url);
    return $response['retData']['carrier'];
}

/**
 * [deCodeMd5 密码加密]
 * @return [type] [description]
 */
function deCodeMd5($password){
    return md5('wdf:'.$password);
}

/**
 * [i_array_column 二维数组转一维数组]
 * @param  [type] $input     [description]
 * @param  [type] $columnKey [description]
 * @param  [type] $indexKey  [description]
 * @return [type]            [description]
 */
function i_array_column($input, $columnKey, $indexKey=null){
    if(!function_exists('array_column')){ 
        $columnKeyIsNumber  = (is_numeric($columnKey))?true:false; 
        $indexKeyIsNull            = (is_null($indexKey))?true :false; 
        $indexKeyIsNumber     = (is_numeric($indexKey))?true:false; 
        $result                         = array(); 
        foreach((array)$input as $key=>$row){ 
            if($columnKeyIsNumber){ 
                $tmp= array_slice($row, $columnKey, 1); 
                $tmp= (is_array($tmp) && !empty($tmp))?current($tmp):null; 
            }else{ 
                $tmp= isset($row[$columnKey])?$row[$columnKey]:null; 
            } 
            if(!$indexKeyIsNull){ 
                if($indexKeyIsNumber){ 
                  $key = array_slice($row, $indexKey, 1); 
                  $key = (is_array($key) && !empty($key))?current($key):null; 
                  $key = is_null($key)?0:$key; 
                }else{ 
                  $key = isset($row[$indexKey])?$row[$indexKey]:0; 
                } 
            } 
            $result[$key] = $tmp; 
        } 
        return $result; 
    }else{
        return array_column($input, $columnKey, $indexKey);
    }
}


/**
 * 将闭包函数转为字符串
 * @param Closure $c
 * @param boolen $escape
 * @return string
 */
function closure_dump(Closure $c, $escape = true) {
    $str = 'function (';
    $r = new ReflectionFunction($c);
    $params = array();
    foreach($r->getParameters() as $p) {
        $s = '';
        if($p->isArray()) {
            $s .= 'array ';
        } else if($p->getClass()) {
            $s .= $p->getClass()->name . ' ';
        }
        if($p->isPassedByReference()){
            $s .= '&';
        }
        $s .= '$' . $p->name;
        if($p->isOptional()) {
            $s .= ' = ' . var_export($p->getDefaultValue(), TRUE);
        }
        $params []= $s;
    }
    $str .= implode(', ', $params);
    $str .= '){' . PHP_EOL;
    $lines = file($r->getFileName());
    for($l = $r->getStartLine(); $l < $r->getEndLine(); $l++) {
        $str .= $lines[$l];
    }
    if($escape){
        $str = preg_replace('/[\r\n\t]/', '', $str);
    }
    $str = preg_replace('/}[,;]$/', '}', $str);
    return $str;
}

/**
 * 将变量转为输出到字符串
 * @param mixed $expression
 * @param boolen $escape
 * @return string 
 */
function custom_var_export($expression, $escape = true){
    $str = '';
    if(is_array($expression)){
        $str .= 'array(';
        foreach ($expression as $key => $val){
            $str .= "'".$key."' => ".custom_var_export($val).',';
        }
        $str .= ')';
    }else if($expression instanceof \Closure){
        $str .= closure_dump($expression);
    }else{
        $str .= var_export($expression, true);
    }
    return $str;
}