<?php

namespace Common\Tools;

abstract class HttpClient
{
    public static function get($url)
    {      
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $returnVal = curl_exec($ch);
        $jsonVal = json_decode($returnVal,true);
        return $jsonVal;
    }

    public static function post($url, $data = null){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $returnVal = curl_exec($ch);
        curl_close($ch);
        $jsonVal = json_decode($returnVal,true);
        return $jsonVal;
    }
}