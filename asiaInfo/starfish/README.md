# starfish prioject frontend

#### 代码编写
- 在pages-dev文件夹下编写文件
- html 文件中使用`coolie`语法。[了解coolie](https://coolie.ydr.me/document/coolie.config.js/)

#### 前端可视化开发
- 在pages-dev目录使用命令：`npm start` 或者 `gulp`
- 前提是电脑安装了node、全局gulp，并且使用`cnpm install` OR `npm install` 命令安项目依赖模块

#### 代码发布
1. 全局替换：把`pages-dev/html`文件夹里面的`"$!ctx/pages-dev/static` 替换为 `"../static`
1. 全局替换：把`pages-dev/html/user`文件夹里面的`"../static` 替换为 `"../../static`
1. 发布：`npm run coolie`
1. 全局替换：把`pages-dev/html`文件里面的`"../static` 替换为 `"$!ctx/pages-dev/static`
1. 全局替换：把`pages-dev/html/user`文件里面的`"../../static` 替换为 `"$!ctx/pages-dev/static`
