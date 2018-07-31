import CaptureError, {formatTryCatchError, event} from './index'
import vueHandle from './vueErrorHandler'
import M from './send'
import tryJS from './try'

export default class Handle {
  constructor (opts) {
    this.CaptureError = new CaptureError(opts)
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
  log (error) {
    if (!error) {
      throw new Error('没有传递error对象')
    }
    if (!error.type) {
      throw new Error('传递的error对象没有type类型')
    }
    event.emit('jserror', error)
    M.log({
      profile: 'log',
      type: error.type,
      channel: 'frontend',
      message: error.desc,
      data: error
    })
  }
  error (error) {
    if (Object.prototype.toString.call(error) === '[object Error]') {
      this.CaptureError.handleError(formatTryCatchError(error))
    }
  }
  static config (opts) {
    if (!Handle.instance) {
      Handle.instance = new Handle(opts)
    }
    return Handle.instance
  }
  useVue (Vue) {
    vueHandle((error) => {
      this.error(error)
    }, Vue)
  }
}
