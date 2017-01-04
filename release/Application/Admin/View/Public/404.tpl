<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta charset="UTF-8" />
    <title>404 - wederful</title>
    <link rel="shortcut icon" href="__PUBLIC__/Home/images/shutPng.png" type="image/png" sizes="16x16 32x32" />
    <style>
        html,
        body {
            height: 100%;
            width: 100%;
            overflow: hidden;
        }
        body {
            margin: 0;
            background: url('http://7xo7hn.com1.z0.glb.clouddn.com/wederful-404-bg.jpg') no-repeat center center;
            background-size: cover;
        }
        .main {
            width: 201px;
            height: 160px;
            display: block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }
        .tit {
            margin: 0;
            display: block;
            height: 97px;
            background: url('http://7xo7hn.com1.z0.glb.clouddn.com/wederful-404-title.png') no-repeat;
        }
        .btn {
            -webkit-transition: background-color .4s, color .4s;
            -moz-transition: background-color .4s, color .4s;
            -o-transition: background-color .4s, color .4s;
            transition: background-color .4s, color .4s;
            font-family: Helvetica, Tahoma, Arial, STXihei, '华文细黑', 'Microsoft YaHei', '微软雅黑', sans-serif;
            color: #bdb099;
            width: 100px;
            padding: 5px 0;
            text-align: center;
            font-size: 16px;
            text-decoration: none;
            border: 1px solid #bdb099;
            border-radius: 4px;
            display: block;
            margin-top: 30px;
            margin-left: auto;
            margin-right: auto;
        }
        .btn:hover {
            background-color: #bdb099;
            color: #fff;
        }
    </style>
</head>
<body>
    <main class="main">
        <figure class="tit"></figure>
        <a class="btn" href="{:U('Index/index/')}">返回首页</a>
    </main>
</body>
</html>