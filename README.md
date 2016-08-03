# modulejs.


- **作者：kpxu、jimyan、wowowang**
- **联系：xukaipeng@qq.com**

modulejs是一款比seajs、commonjs更加简洁、小巧的javascript模块化开发管理工具。
思路更加精巧优雅，包含注释在内只有222行，同时也吸收了seajs和requirejs的一些优点！

## 优点

* 文件压缩后只有3kb，gzip后只有1kb.
* 实现中不涉及任何浏览器特性，所以不存在浏览器兼容性问题.
* 能够对module定义文件进行自由合并，不需要额外打包部署工具.
* 代码结构极其简洁明了，你可以轻易的阅读，并按照你的实际情况进行适配定制.
* modulejs要求对所有module都定一个id，且需要明文在alias中描述module的实现文件路径

## 开始使用

只需要在入口的html里引入module.js,并对所有需要用到的module进行明文配置,可以参见[demo](https://github.com/TC-FE/modulejs/tree/master/example)

```html
<script src="../module.js"></script>
<script type="text/javascript">
    modulejs.config({
        /**
         初始化配置,alias为必选参数,在这里设置所有声明的模块名和对应的路径,路径除了支持相对路径外，还支持http方式的路径
         */
        alias: {
            "log": "./log.js",//格式为模块名:地址
            "debug": "./debug.js",
            "error": "./handle.js",
            "warn": "./handle.js"
        }
    });
    modulejs(["log", "debug"], function(log, debug) {
        log.warn('something warn.');
        log.err('somethin error.');
        debug('debug here.');
    });
    // output example(in Chrome):
    // Sat Jul 30 2016 00:06:44 GMT+0800 (中国标准时间)
    // ==warn==
    // something warn.
    // debug.js:3 Sat Jul 30 2016 00:06:52 GMT+0800 (中国标准时间)
    // ==error==
    // somethin error.
    // debug.js:3 Sat Jul 30 2016 00:06:52 GMT+0800 (中国标准时间)
    // debug here.
</script>
```

## API
### modulejs.config(obj)
用来对modulejs进行配置，目前只支持对alias进行配置，且alias为必须配置，框架要求对使用中所有需要用到的module进行明文描述,
描述中module id可以多个id指向到同一个url。
定义完成后，可以将module id作为唯一标识，自由的引用module。

```js
modulejs.config({
  alias:{
    "module1":"http://www.demo.com/js/modules.js",
    "module2":"http://www.demo.com/js/modules.js",
    "module3":"http://www.demo2.com/js/xxx.js"
  }
});
```

在某些情况下可能有需要在框架载入前进行配置输出的情况，这时只需要使用如下变量进行配置即可：

```js
_moduleConfig={
  alias:{
    "module1":"http://www.demo.com/js/modules.js",
    "module2":"http://www.demo.com/js/modules.js",
    "module3":"http://www.demo2.com/js/xxx.js"
  }
};
```
将在模块require的时候异步发起请求对应模块。

### modulejs(desp, callback)
作为框架入口，用来加载需要的模块，并执行指定的回调,执行时会把相关依赖的model按照依赖顺序传入。
这里的模块为已经配置好模块路径的（modulejs.config或者_moduleConfig）
```js
modulejs(["module1","module2"], function(m1,m2) {
    m1.dosomething();
    m2.dosomething();
})
```

### define(moduleid, [desp], factory)
用来定义模块。modulejs中可以把多个define放在一个文件里面，自由组合。

参数 | 解释
------------ | -------------
moduleid | 模块id，必选，modulejs根据这个id来查找模块
desp | 模块依赖，可选，这里可以明文指定依赖，也可以让modulejs自己进行静态分析
factory | 模块实现，必选，factory如果为一个json的时候，这个模块将直接把json返回。当为一个function的时候，function会收到三个参数

#### **factory(require,exports,module)**

参数 | 解释
------------ | -------------
require  | require方法，通过这个，模块可以调用其他的模块
exports  | 接口对象，模块通过对exports赋值来提供外部接口
module   | 本身module对象，一般用不上

exports和module的关系可以参考[此文](http://cnodejs.org/topic/5231a630101e574521e45ef8)

**使用举例**
```js
define("module",[],function(require, exports, module) {
  // 模块代码
  exports.do1=function(){};
  exports.do2=function(){};
});
//简化写法
define("module",function(require, exports) {
  // 模块代码
  exports.do1=function(){};
  exports.do2=function(){};
});

```

### require(id, [callback])
用来获取指定模块的接口，基本用法：

```js
define("module1",function(require) {
  // 获取模块 a 的接口
  var a = require('module');
  // 调用模块 a 的方法
  a.do1();
});
```

### require.async(id, callback)
```js
modulejs.config({
    alias: {
        "inf": "http://static.gtimg.com/js/version/201412/inf.201412202042.js?t=1" //这里只是配置了模块和路径，但是modulejs没依赖就没下载，用到的时候才下载——LazyLoad特性
    }
});
modulejs([someModules], function(log, debug) {
    require.async("inf",function(inf){ //异步加载inf模块
        console.log(inf);
    });
});
```

### require.css(path, callback)
```js
require.css("./pCss.css",function(event){
    console.log(event)
});
```
### _cacheThisModule_

在模块中定义```var _cacheThisModule_;```，modulejs会在localstorage里缓存该模块



### window["_moduleConfig"]
内部cfg对象配置，可以控制台输出查看

- window["_moduleConfig"].timing['loadcache'] 为_loadCache()函数执行的时间
- window["_moduleConfig"].timing[url] 为对应模块的加载时间
- window["_moduleConfig"].timing[moduleName] 为对应模块的执行时间
- window["_moduleConfig"].uris 保存对应URL的加载状态，1为正在加载，2为已加载
- 

### mdebug参数
url如果有 **mdebug=1** 参数会开启debug模式，不会缓存

## modulejs开启模块缓存条件

1. 支持JSON且window.localStorage
2. 内部isCache开关为true(默认为true)
3. url不包含 **mdebug=1** 参数
4. ie版本不为ie6及以下版本（这里无法检测ie11的UA）
5. 模块id不包含下划线'_'
6. 模块代码包含`_cacheThisModule_`字符串(通常写在模块开头效率会高一点)

## Change Log
### v1.0.1
* 4月1日发布的seajs2.0让我们产生了自己开发一套模块加载和管理工具的冲动。主要解决了几个在我们项目中用着不太爽的部分：
* 所有的模块定义文件可以自由的进行合并、组合，不限定一个define一个文件或者部署的时候需要相关的配置工具支持。
* 把alias作为了配置核心，框架需要明文声明每个module id所对应的url，不再依赖路径规则进行分析
* **支持在modulejs文件加载前预设置配置，通过_moduleConfig全局变量赋值即可。**
* define的时候可以明文指定依赖和静态分析依赖，最终会进行合并
* 深入的分析了一下模块加载和管理原理，发现模块管理根本可以不依赖于浏览器那不靠谱的onload事件。我们实现了。
* 本库使用了requirejs里面的依赖分析正则。特此感谢。

### v1.0.2
* 支持require.css
