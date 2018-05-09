# Kingfisher项目开发规范

## 项目组织结构
为了与老项目路径区分，src下一新建new路径，一下文件均在new路径里

* actions 只能放置redux actions
* reducers 只能放置redux reducers
* rest 只能放置各种fecth
* media 全局媒体文件
  * audio 音频文件
  * video 视频文件
  * img 图片文件
* components 全局组件
* pages 各个页面对应的组件
   * pages/Xxx/Xxx.js 页面js文件
   * pages/Xxx/components.js 该页面内的组件
   * pages/Xxx/Xxx.less 页面less文件
   * pages/Xxx/config.js 页面配置项常量，如表格Columns
   * pages/Xxx/util.js 页面下的函数
   * pages/Xxx/const.js 页面下的普通常量，如Select的Options
   * pages/Xxx/media 存放页面中的媒体资源
     * img 图片
     * video 视频
     * audio 音频
* router 处理路由
* lib 自己封装的全局使用的函数，e.g. fetch.js，util.js, oss.js
* const 全局使用的常量，如权限值

## 命名规范
* 目录名采用全小写`-`分隔。
* 输出react组件的js名称采用Pascal命名, 文件名与组件名称相同, 对应的less文件以及包裹js和less文件的上级目录名称与js文件保持一致, e.g. /NotFound/NotFound.js /NotFound/NotFound.less。其余js采用全小写`-`分隔, e.g. /router/router-helper.js。
* 图片等资源文件名无特殊要求, 由ascii码组成即可。
* 其余文件名, 除特殊原因外, 均采用全小写`-`分隔。
* js文件中class和constructor采用Pascal命名, 其余变量采用驼峰式命名。私有属性可采用`_`开头的驼峰式命名。
* html/css/react className均采用全小写`-`分隔的命名。
* url主体采用全小写`-`分隔, 参数名采用驼峰式命名。
* 采用驼峰式命名时, 常见缩写如`Id` `Url`等仅首字母大写。
* 元素class命名, 对于页面顶层组件应以`page-`开头, 对于公共组件应以`c-`开头, 对于全局公共属性应以`g-`开头。页面内元素不做要求。

## js内容要求

* js文件均采用`.js`扩展名。
* 所有变量声明应使用`const`或`let`声明, 不再使用`var`
* 模块导入应使用`import`语法, 导出使用`export`语法, 不再使用CommonJS规范
* 使用prototype的场景均应使用`class`语法替代
* 匿名函数均应使用lambda表达式替代
* 尽可能使用ES2017提供的新类型和新方法解决问题
* 原则上页面文件内组件嵌套不超过三层
* 除非必须，否则不允许在js文件里修改style
* 推荐使用stateless的组件解决问题
* react组件自己的回调函数一律以onXXX命名，上一级组件的回调函数一律以handleXXX命名

## less内容要求

* 避免使用id选择器
* 最后一级允许使用 标签名 选择器，其余必须使用类名
* 越是上级的类名命名越应该与页面内容相关
* 页面级page-xxx，下一级xxx-wrapper，再下级xxx...如有必要再出现一级容器，使用xxx-container
* 如非必须，不允许书写非`page`和`-g`开头命名的全局样式


