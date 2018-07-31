import { setting } from './try'
import EventEmitter from 'event-emitter'
import M from './send'
import {
  debounce
} from './util'

// 忽略错误监听
window.ignoreError = false

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
const event = EventEmitter()

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
 * 设置一个采样率，决定是否上报
 *
 * @param  {Number} sampling 0 - 1
 * @return {Boolean}
 */
function needReport (sampling) {
  return Math.random() < (sampling || 1)
}
class CaptureErrorAbstract {
  constructor (opts) {
    this.errorList = [] // 错误数据的收集数组
    this.config = {
      debug: 0, //默认是直接输出
      concat: false, // 默认不合并 单条发送
      delay: 2000, // 错误处理间隔时间
      maxError: 16, // 异常报错数量限制
      sampling: 1 // 采样率
    }
    Object.assign(this.config, opts)
  }
  report () {
    throw new Error('该类必须继承后覆盖使用')
  }
}
class CaptureError extends CaptureErrorAbstract {
  constructor (opts) {
    super(opts)
    if (!opts.url) throw new Error('不存在url参数')
    Object.assign(this.config, opts)

    M.server = opts.url

    let report = null
    if (this.config.debug) {
      report = function (error) { error = error[0]; console.warn(error) }
    } else {
      report = function (error) {
        error = error[0]
        event.emit('jserror', error)
        M.log({
          profile: 'log',
          type: error.type,
          channel: 'frontend',
          message: error.desc,
          data: error
        })
      }
    }
    this.report = debounce(report, this.config.delay, () => {
      this.errorList = []
    })
    this.init()
  }
  init () {
    let self = this
    // 监听 JavaScript 报错异常(JavaScript runtime error)
    window.onerror = function () {
      if (window.ignoreError) {
        window.ignoreError = false
        return
      }
      self.handleError(formatRuntimerError.apply(null, arguments))
    }

    // 监听资源加载错误(JavaScript Scource failed to load)
    window.addEventListener('error', function (event) {
    // 过滤 target 为 window 的异常，避免与上面的 onerror 重复
      var errorTarget = event.target
      if (errorTarget !== window && errorTarget.nodeName && LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()]) {
        self.handleError(formatLoadError(errorTarget))
      }
    }, true)

    setting({ handleTryCatchError: function (error) {
      self.handleError(formatTryCatchError(error))
    }})
  }
  /**
 * 错误数据预处理
 *
 * @param  {Object} errorLog    错误日志
 */
  handleError (errorLog) {
  // 是否延时处理
    if (!this.config.concat) {
      !needReport(this.config.sampling) || this.report([errorLog])
    } else {
      this.pushError(errorLog)
      this.report(this.errorList)
    }
  }

  /**
 * 往异常信息数组里面添加一条记录
 *
 * @param  {Object} errorLog 错误日志
 */
  pushError (errorLog) {
    if (needReport(this.config.sampling) && this.errorList.length < this.config.maxError) {
      this.errorList.push(errorLog)
    }
  }
}
export {formatTryCatchError, event}
export default CaptureError
