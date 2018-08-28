import tryJS, { setting } from './try'
import EventEmitter from 'event-emitter'
import M from './send'
import {
  debounce,
  merge
} from './util'
import vueHandle from './vueErrorHandler'
setting({ handleTryCatchError: handleTryCatchError })

// 忽略错误监听
window.ignoreError = false
// 错误日志列表
let errorList = []
// 错误处理回调
let report = function () {}

const config = {
  concat: true,
  delay: 2000, // 错误处理间隔时间
  maxError: 16, // 异常报错数量限制
  sampling: 1 // 采样率
}

// 定义的错误类型码
const ERROR_RUNTIME = 1
const ERROR_SCRIPT = 2
const ERROR_STYLE = 3
const ERROR_IMAGE = 4
const ERROR_AUDIO = 5
const ERROR_VIDEO = 6
const ERROR_CONSOLE = 7
const ERROR_TRY_CATHC = 8

const LOAD_ERROR_TYPE = {
  SCRIPT: ERROR_SCRIPT,
  LINK: ERROR_STYLE,
  IMG: ERROR_IMAGE,
  AUDIO: ERROR_AUDIO,
  VIDEO: ERROR_VIDEO
}
const debug = process.env.NODE_ENV === 'development'

class Handle {
  constructor (opts) {
    __config(opts)
    this.init()
    this.event = EventEmitter()
  }
  init () {
    __init()
  }
  on (...rest) {
    this.event.on(...rest)
  }
  once (...rest) {
    this.event.once(...rest)
  }
  off (...rest) {
    this.event.off(...rest)
  }
  /*
    对一些需要用try catch包装的地方可以使用这个简单的函数
  */
  wrapErrors (func) {
    return tryJS.wrap(func)()
  }
  static log (...rest) {
    Handle.instance.event.emit('jserror', rest)
    M.log(...rest)
  }
  static logConcat (...rest) {
    Handle.instance.event.emit('jserror', rest)
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
function __config (opts) {
  merge(opts, config)
  if (!opts.url) throw new Error('不存在url参数')
  M.server = opts.url

  if (debug) {
    config.report = function (error) { console.warn(error) }
  } else if (config.concat && config.delay) {
    config.report = function (error) {
      const errMsg = error.map(function (item) {
        return Object.assign(item, {profile: 'log', type: item.type})
      })
      Handle.logConcat(errMsg)
    }
  } else {
    config.report = function (error) {
      error = error[0]
      Handle.log(Object.assign(error, {profile: 'log', type: error.type}))
    }
  }
  report = debounce(config.report, config.delay, function () {
    errorList = []
  })
}

function __init () {
  // 监听 JavaScript 报错异常(JavaScript runtime error)
  window.onerror = function () {
    if (window.ignoreError) {
      window.ignoreError = false
      return
    }
    handleError(formatRuntimerError.apply(null, arguments))
  }

  // 监听资源加载错误(JavaScript Scource failed to load)
  window.addEventListener('error', function (event) {
    // 过滤 target 为 window 的异常，避免与上面的 onerror 重复
    var errorTarget = event.target
    if (errorTarget !== window && errorTarget.nodeName && LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()]) {
      handleError(formatLoadError(errorTarget))
    }
  }, true)
}

// 处理 try..catch 错误
function handleTryCatchError (error) {
  handleError(formatTryCatchError(error))
}

/**
 * 生成 runtime 错误日志
 *
 * @param  {String} message 错误信息
 * @param  {String} source  发生错误的脚本 URL
 * @param  {Number} lineno  发生错误的行号
 * @param  {Number} colno   发生错误的列号
 * @param  {Object} error   error 对象
 * @return {Object}
 */
function formatRuntimerError (message, source, lineno, colno, error) {
  return {
    type: ERROR_RUNTIME,
    desc: message + ' at ' + source + ':' + lineno + ':' + colno,
    stack: error && error.stack ? error.stack : 'no stack' // IE <9, has no error stack
  }
}

/**
 * 生成 laod 错误日志
 *
 * @param  {Object} errorTarget
 * @return {Object}
 */
function formatLoadError (errorTarget) {
  return {
    type: LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()],
    desc: errorTarget.baseURI + '@' + (errorTarget.src || errorTarget.href),
    stack: 'no stack'
  }
}

/**
 * 生成 try..catch 错误日志
 *
 * @param  {Object} error error 对象
 * @return {Object} 格式化后的对象
 */
function formatTryCatchError (error) {
  return {
    type: ERROR_TRY_CATHC,
    desc: error.message,
    stack: error.stack
  }
}

/**
 * 错误数据预处理
 *
 * @param  {Object} errorLog    错误日志
 */
function handleError (errorLog) {
  // 是否延时处理
  if (!config.concat) {
    !needReport(config.sampling) || config.report([errorLog])
  } else {
    pushError(errorLog)
    report(errorList)
  }
}

/**
 * 往异常信息数组里面添加一条记录
 *
 * @param  {Object} errorLog 错误日志
 */
function pushError (errorLog) {
  if (needReport(config.sampling) && errorList.length < config.maxError) {
    errorList.push(errorLog)
  }
}

/**
 * 设置一个采样率，决定是否上报
 *
 * @param  {Number} sampling 0 - 1
 * @return {Boolean}
 */
function needReport (sampling) {
  return Math.random() < (sampling || 1)
}

export default Handle
