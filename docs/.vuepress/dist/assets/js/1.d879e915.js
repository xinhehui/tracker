(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{150:function(n,t,e){"use strict";e.r(t);var s=e(0),a=Object(s.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"content"},[e("h2",{attrs:{id:"安装"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#安装","aria-hidden":"true"}},[n._v("#")]),n._v(" 安装")]),e("p",[e("strong",[n._v("1. 设置私有库地址")])]),e("p",[n._v("npm set registry http://npm.xinhehui.com")]),e("p",[e("strong",[n._v("2. npm i --save @xhh/jsbridge")])]),e("h2",{attrs:{id:"示例"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#示例","aria-hidden":"true"}},[n._v("#")]),n._v(" 示例")]),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[n._v("const instance = new JsBridge({\n    name: 'WAP',    //app调用的全局变量名字, 将WAP挂在到window下\n    //app调用js的方法扩展\n    triggerExtend: (jsBridge) => {\n            return {\n                test () {}\n            }\n        },\n    //js调用app方法的扩展\n    extend: (jsBridge) => {\n            return {\n                test () {}\n            }\n        },\n    //插件\n    plugins: []\n})\n\n//默认从app获取cookie信息\ninstance.on('getCookie', function (d) {\n    //....\n})\n\n")])])])])}],!1,null,null,null);t.default=a.exports}}]);