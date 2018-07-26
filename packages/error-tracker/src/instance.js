import {__config, __init, event, tryJS, handleError, formatTryCatchError} from './index'
import vueHandle from './vueErrorHandler'
import M from './send'

export default class Handle {
  constructor (opts) {
    __config(opts)
    this.init()
  }
  init () {
    __init()
  }
  on (...rest) {
    event.on(...rest)
  }
  once (...rest) {
    event.once(...rest)
  }
  off (...rest) {
    event.off(...rest)
  }
  /*
    对一些需要用try catch包装的地方可以使用这个简单的函数
  */
  wrapErrors (func) {
    return tryJS.wrap(func)()
  }
  static log (...rest) {
    event.emit('jserror', rest)
    M.log(...rest)
  }
  static logConcat (...rest) {
    event.emit('jserror', rest)
    M.logConcat(...rest)
  }
  static error (error) {
    handleError(formatTryCatchError(error))
  }
  static config (opts) {
    if (!Handle.instance) {
      Handle.instance = new Handle(opts)
    }
    return Handle.instance
  }
  useVue (Vue) {
    vueHandle((error) => {
      Handle.error(error)
    }, Vue)
  }
}
