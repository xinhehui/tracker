
/**
 *
 * vue里的插件
 * 用法如下
 * 在html中引入
 * <script type="text/javascript" src="http://npmprivate.xinhehui.com/error-tracker/packages/error-tracker/dist/index.js"></script>
<script>
var errorTracker = new ErrorTracker.Handle({
  concat: false,
  server: 'http://localhost:10086/demo/demo/vertical.jpg',
  report: function (errorLogs) {
    var error = errorLogs[0]
    let mapJS = undefined
    if (error.stack != 'no stack') {
      const stack = error.stack.split(/[\n]/)
      mapJS = stack[1].match(/\((.*)js/)
      if (mapJS) mapJS = mapJS[1] + 'js.map'
    }
    ErrorTracker.Handle.log(Object.assign(error, {profile: 'log', mapjs: mapJS, type: error.type}))
  }
})
在main.js中传入Vue对象
 * window.ErrorTracker.vueHandle((error) => {
  window.ErrorTracker.Handle.error(error)
}, Vue)
**/
function formatComponentName (vm) {
  if (vm.$root === vm) {
    return 'root instance'
  }
  var name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
  )
}

function vuePlugin (cb, Vue) {
  Vue = Vue || window.Vue

  // quit if Vue isn't on the page
  if (!Vue || !Vue.config) return

  Vue.config.errorHandler = function VueErrorHandler (error, vm, info) {
    var metaData = {}

    // vm and lifecycleHook are not always available
    if (Object.prototype.toString.call(vm) === '[object Object]') {
      metaData.componentName = formatComponentName(vm)
      metaData.propsData = vm.$options.propsData
    }

    if (typeof info !== 'undefined') {
      metaData.lifecycleHook = info
    }
    cb(error, metaData)
  }
}
export default vuePlugin
