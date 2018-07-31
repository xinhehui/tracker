## 简介
[https://www.yuque.com/rx36r5/qahuie/df1pgq]
通过对 error 事件的监听，获取异常相关信息并缓存，在一定时间之后报告处理。

## 功能

捕获页面 JavaScript 异常报错，捕获异常类型包含:

1. JavaScript runtime 异常捕捉 √
2. 静态资源 load faided 异常捕捉 √
3. console.error 的异常捕获 √
4. try..catch 错误捕获 √

## 实现概述

* 通过对 [`window.onerror`](https://developer.mozilla.org/en/docs/Web/API/GlobalEventHandlers/onerror) 进行监听，捕获 JavaScript 的运行时异常，记录错误：event + 错误来源(source) + 错误行数 + 错误列数等数据
* 通过对 `window.addEventListener` 监听 `error` 事件类型，获取静态资源报错，包含 JavaScript 文件，CSS 文件，图片，视频，音频。
* 主要针对 vue 的异常捕获，重写了 `console.error` 事件，在捕获异常先记录错误信息的描述，再 `next` 到原始的 `console.error`
* 提供包装函数对其进行 try..catch 包装，捕获异常并处理

## 使用指南

#### script mode
```html
<script src="../dist/error-tracker.js"></script>

<script>
  ErrorTracker.config({
    name: 'example_site'
    url: 'https://xxx.xxxxx.xx'
  })
</script>
```

#### module mode

1.安装

```sh
npm install error-tracker --save
```

2.在文件中添加

```javascript
import ErrorTracker from 'error-tracker'

ErrorTracker.config({
    name: 'example_site'
    url: 'https://xxx.xxxxx.xx'
})
```

#### vue
```
import Vue from 'vue'
import ErrorTracker from 'error-tracker'
import VuePlugin from 'error-tracker/plugins/vue'

ErrorTracker.config({
    name: 'example_site'
    url: 'https://xxx.xxxxx.xx'
}).useVue(Vue)
```

### API

| 字段       | 描述                | 类型       | 默认值                                     | 备注                      |
| -------- | ----------------- | -------- | --------------------------------------- | ----------------------- |
| url       |    日志上传地址  |  String  |  无   |  必传，否则抛出提示|
| name       |    应用名  |  String  |  无   |  必传，否则抛出提示|
| concat   | 是否延时处理，默认延时 2s 处理 | Boolean  | `true`                                  |                         |
| delay    | 错误处理间隔时间，单位 ms    | Number   | `2000`                                  | 当 `concat` 为 `false` 无效 |
| maxError | 一次处理的异常报错数量限制     | Number   | `16`                                    | 当 `concat` 为 `false` 无效 |
| sampling | 采样率               | Number   | `1`                                     | 0 - 1 之间                |

#### 关于 errorLogs（及上传的日志文件）：
格式
```javascript
{
  errors: [
  { 
      type: 1, // 参考错误类型
      desc: '', // 错误描述信息
      time: 18666900,
      stack: 'no stack', // 堆栈信息。无堆栈信息时返回 'no stack'         
  },
  // ...
  ],
  platform: 'ios',   //哪个平台   ios, android, weixin, web, 是否可获取platform的version
  sessid: '',
  app_version: '',  // 可选
  uid: '',
  url: ''    //当前页面  
}

```

#### 后端额外存储
client_ip

#### 错误类型

```javascript
var ERROR_RUNTIME = 1
var ERROR_SCRIPT = 2
var ERROR_STYLE = 3
var ERROR_IMAGE = 4
var ERROR_AUDIO = 5
var ERROR_VIDEO = 6
var ERROR_CONSOLE = 7
var ERROR_TRY_CATCH = 8
```

#### 接口 
**on 可以监听错误的暴露** 
```
window.errorTracker.on("jserror", function (jserror) {
  console.log(jserror)
})
```
这个接口在使用时应该不会用到，加上去是因为在测试时或者本地情况不会真正发送请求，通过这个接口得到真实传递的数据
#### **once 仅可以监听一次**
#### **off 取消错误监听事件**
#### **wrapErrors  对一些需要用try catch包装的地方可以使用这个简单的函数**
【使用方法】
```
window.errorTracker.wrapErrors(function () {
  new Array(-1)
})
```
**log 通用发送接口**
【使用方法】这个例子是说某些情况我们记录一些特定的异常事件来发送到远端
```
if (location.search.indexOf("hmsr") === -1) {
  window.errorTracker.log({
    type: 'NOHMSR',
    desc: '没有hmsr参数'
  })
}
```
**error 类似于log，不过这个需要传递的是error对象**
