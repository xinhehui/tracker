## 安装
**1. 设置私有库地址**

npm set registry http://npm.xinhehui.com

**2. npm i --save @xhh/jsbridge**

## 示例
```
const instance = new JsBridge({
    name: 'WAP',    //app调用的全局变量名字, 将WAP挂在到window下
    //app调用js的方法扩展
    triggerExtend: (jsBridge) => {
            return {
                test () {}
            }
        },
    //js调用app方法的扩展
    extend: (jsBridge) => {
            return {
                test () {}
            }
        },
    //插件
    plugins: []
})

//默认从app获取cookie信息
instance.on('getCookie', function (d) {
    //....
})

```