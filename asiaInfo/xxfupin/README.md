# 信心扶贫-项目前端代码

> 代码都是用`velocity`模板引擎渲染，需要数据库和服务器支持，不能直接运行

### 代码编写

在pages-dev文件夹下编写文件  
html 文件中使用[coolie](https://coolie.ydr.me/document/coolie.config.js/)语法。

### 前端可视化开发

在pages-dev目录使用命令：`npm start` 或者 `gulp`  
前提是电脑安装了node、全局gulp，并且使用`cnpm install` OR `npm install` 命令安项目依赖模块

### 代码发布

> 需要写个shell脚本支持前端发布，目前太忙没有时间

1. 全局替换把`pages-dev/html`文件夹里面的`"$!ctx/pages-dev/static` 替换为 `"../static`
1. 全局替换把`pages-dev/html/user`文件夹里面的`"../static` 替换为 `"../../static`
1. 发布：`npm run coolie`
1. 全局替换把`pages-dev/html`文件里面的`"../static` 替换为 `"$!ctx/pages-dev/static`
1. 全局替换把`pages-dev/html/user`文件里面的`"../../static` 替换为 `"$!ctx/pages-dev/static`

### 代码风格

由`_`开头的变量为私有变量（不能被全局环境所访问）  
由`_is`开头的变量为布尔值，表示“是否可行”，比如`_is_ajax`表示“是否可以发送ajax”  
由`$`开头的变量为Zepto DOM节点  
HTML文件，除“页内锚点”可以使用ID外只有JavaScript中才能使用  
HTML文件中class为`j-`开头的class名称均只在JavaScript中使用，其他class名称一般不再JavaScript中使用。可以用作`toggle-class`切换class  
函数名使用驼峰命名，普通变量使用简介单词下划线链接
