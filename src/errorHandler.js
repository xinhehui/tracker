import jstracker from 'jstracker'
import M from './send'
const debug = process.env.NODE_ENV === 'production'
jstracker.init({
  concat: false,
  report: function (errorLogs) {
    M.server = 'http://localhost:10086/demo/demo/vertical.jpg'
    if (debug) {
      console.warn('send', errorLogs)
    } else {
      const stack = errorLogs[0].stack.split(/[\n]/)
      let mapJS = stack[1].match(/\((.*)js/)
      mapJS = mapJS[1] + 'js.map'
      M.log(Object.assign(errorLogs[0], {profile: 'log', mapjs: mapJS}))
    }
  }
})

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
vuePlugin.error = jstracker.error

export default vuePlugin
