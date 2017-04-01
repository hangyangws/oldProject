1.cutstr(str, len) 省略多余字符串;str文本内容，len 显示长度。返回值string

2.DeleteSameArrayItem(someArray);  删除数组中存在重复的元素 someArray数组,返回值array

3.confirmRepeat(someArray) 判断数组中是否存在重复的元素 someArray数组,返回值boolean

4.DateFormat(format, date) 格式化日期 DateFormat('yyyy_MM_dd hh:mm:ss:SS 星期w 第q季度'),返回值string

5.getPageHeight() 获取页面高度,返回值number
6.getPageViewHeight() 获取页面可视高度,返回值number

7.getPageWidth() 获取页面宽度,返回值number
8.getPageViewWidth() 获取页面可视宽度,返回值number

9.getPageScrollLeft() 获取页面scrollLeft,返回值number
10.getPageScrollTop() 获取页面scrollTop,返回值number

11.getViewSize() 获取窗体可见范围的宽与高,返回值array [宽,高]

12.vailForm(ele) 验证表单，ele form对象，返回值boolean

13.isemail(str) 验证邮箱，str 字符串,返回值boolean

14.vailNickName(opt) 验证昵称,obj参数,minLen 最小长度,maxLen 最大长度,val 字符串(必须),
返回值对象  obj{message:"",result:""}; result为验证结果 boolean，message为错误提示 string;

15.vailPhone(str) 验证手机号,str参数 字符串或number
返回值对象  obj{message:"",result:""}; result为验证结果 boolean，message为错误提示 string;

16.vailPwd(opt) 验证密码,opt obj参数,val 密码值，minLen 最小长度，maxLen 最大长度
var opt = {
  val: str,
  minLen: minLen,
  maxLen: maxLen
}
返回值对象  obj{message:"",result:""}; result为验证结果 boolean，message为错误提示 string;

17.vailConfirmPwd(opt) 验证确认密码,opt 参数,val 待验证string文本，source 密码文本
var opt = {
  val: "str",
  source:"str",
}
返回值对象  obj{message:"",result:""}; result为验证结果 boolean，message为错误提示 string;

18.vailEmail(str) 验证邮箱,str 待验证文本内容
返回值对象  obj{message:"",result:""}; result为验证结果 boolean，message为错误提示 string;

19.vailCode(str) 验证码验空,str 待验证文本
返回值对象  obj{message:"",result:""}; result为验证结果 boolean，message为错误提示 string;

20.customPos(opt) 上下按键事件,opt参数,ele 对象,cb 处理事件function
opt={
  ele:$("#opt"),
  cb:function(){}
}

21.getDays(y, m) 获取指定年月天数.y 年份,m 月份,返回值number

22。getFirstDay(y,m) 获取当月第一天的星期。y 年份,m 月份,返回值number

23.creatTable(opt) opt参数 data数据,crearTr 生成tr内容,返回值String,table内容
opt={
  data:[{name:1,name1:2,name3:3},{name:1,name1:2,name3:3}],
  crearTr:function(item){}
}

24.getLength(text) 获取长度，text文本,返回值number

25.checkImg(file) 验证上传图片格式(jpg,png,gif)，file，input元素对象  正确格式返回true,错误返回false

26.unicode(s)  普通字符转unicode , 参数为String , 返回unicode字符串

27.runicode(s) unicode反编码 ,参数为unicode编码，返回编码后的字符串

28.selYM 年月选择框,init初始化方法，参数ele 对象元素 selYM.init($("#a"));

29.formateNumber(number) 转化数字，将一位数转化为两位数,number 需转化的数字,返回值String

30.treeModel 树状显示 参数 opt，ele 创建对象节点，edit 是否是编辑，jsonArr 数据 treeModel.init()