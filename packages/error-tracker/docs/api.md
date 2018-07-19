## 配置
* name

    挂载的全局对象名

* triggerExtend

    app调用js的方法扩展

* extend
    js调用app方法的扩展

* plugins

    插件

* debug

    默认false，为true时默认会开启printMsg插件，打印app和web的信息

## 实例方法
* trigger (type, params)

    app调用js方法

* putData (type, params)

    传值给app

* getData (type, params, cb)

    从app获取数据

* goToNative (page, params)

    跳转到原生页面

* goToExtraNative (params)

    ```
    params:
    {
        ios:{
             class:         //原生页面的类名
             isHandleClose: //要不要关闭当前webView(true/false)
             ... 其他参数
        },
        android: {
        }
    }
    ```

    自定义类名，参数(App端提供)泛型跳转到App的原生页面（应对突发情况）

* doAction (type, params)

    调用app的方法

* getCallBack (key)

    获取回调函数

* addCallback (cb)

    添加回调函数, cb 是函数类型

* on (eventName, callback)

    监听jsbridge触发的事件

    回调函数若为箭头函数，可使用this
    ```
    instance.on('event', function(d){})
    ```

## 事件
#### 使用方法
[示例](/simple-use.html#示例)

#### 事件类型
* appLoaded

    app webview 加载结束会 trigger('loaded'), javascript 触发 appLoaded 事件。
    对于 wkwebview， 此时 cookie 已加载成功

* subTitleClick

    点击头部副标题，触发 subTitleClick 事件

* jsLoaded

    javascript第一次调用app方法(appData)成功，触发 jsLoaded 事件， 表明交互可用

* cookieLoaded

    默认获取app的cookie，成功触发 cookieLoaded 事件

#### 关于cookie的说明
**ios**

uiwebview 默认在所有请求中加入cookie

wkwebview 默认会在 document 对象中注入 cookie ，对于页面初始化需要发送 ajax 请求的页面，
需在 cookie 注入成功后加载。可在 appLoaded 和 cookieLoaded 中去启动webapp

