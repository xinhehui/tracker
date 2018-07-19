## jsbridge 是什么
![一图胜千言](./images/jsbridge.png)

jsbridge的**核心是构建 Native 和非 Native 间消息通信的通道**，而且是双向通信的通道。
* JS 向 Native 发送消息 : 调用相关功能、通知 Native 当前 JS 的相关状态等。
* Native 向 JS 发送消息 : 回溯调用结果、消息推送、通知 JS 当前 Native 的状态等。

## jsbridge 的实现原理
JavaScript 是运行在一个单独的 JS Context 中（例如，WebView 的 Webkit 引擎、JSCore）。
由于这些 Context 与原生运行环境的天然隔离，我们可以将这种情况与 RPC（Remote Procedure Call，远程过程调用）
通信进行类比，将 Native 与 JavaScript 的每次互相调用看做一次 RPC 调用。

#### JavaScript 调用 Native
JavaScript 调用 Native 的方式，主要有两种：注入 API 和 拦截 URL SCHEME。

**1. 注入api**

注入 API 方式的主要原理是，通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法,
让 JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的。

**2. 拦截 URL SCHEME**

URL SCHEME是一种类似于url的链接，是为了方便app直接互相调用设计的，形式和普通的 url 近似，主要区别是 protocol
 和 host 一般是自定义的，例如: qunarhy://hy/url?url=ymfe.tech，protocol 是 qunarhy，host 则是 hy。

拦截 URL SCHEME 的主要流程是：Web 端通过某种方式（例如 iframe.src）发送 URL Scheme 请求，
之后 Native 拦截到请求并根据 URL SCHEME（包括所带的参数）进行相关操作。

在时间过程中，这种方式有一定的 缺陷：
* 使用 iframe.src 发送 URL SCHEME 会有 url 长度的隐患。
* 创建请求，需要一定的耗时，比注入 API 的方式调用同样的功能，耗时会较长。


但它 支持 iOS6。


#### Native 调用 JavaScript

Native 调用 JavaScript，其实就是执行拼接 JavaScript 字符串，从外部调用 JavaScript 中的方法，
因此 JavaScript 的方法必须在全局的 window 上。


## 我们的方案
1. 使用注入api的方式
2. ios 兼容wkwebview和uiwebview

