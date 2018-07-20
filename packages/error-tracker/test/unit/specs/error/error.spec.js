/* eslint-disable */
import ErrorTracker from 'root/src/index'
jest.mock('detector')
const errorTracker = ErrorTracker.config({
  concat: false,
  url: 'http://localhost:10086/demo/demo/vertical.jpg'
})
describe('errorHandle测试', () => {
  it('测试JS错误--SyntaxError', (done) => {
    errorTracker.once("jserror", function (jserror) {
      expect(jserror[0]['type']).toEqual(1)
      expect(jserror[0]['desc']).toEqual('message at source:10:10')
      expect(jserror[0]['stack']).toEqual(expect.stringMatching('Invalid or unexpected token'))
      done()
    })
    try {
      eval("var 1a")
    } catch (e) {
      window.onerror('message', 'source', 10, 10, e)
    }
  })
  it('测试JS错误--ReferenceError', (done) => {
    errorTracker.once("jserror", function (jserror) {
      expect(jserror[0]['type']).toEqual(1)
      expect(jserror[0]['desc']).toEqual('message at source:10:10')
      expect(jserror[0]['stack']).toEqual(expect.stringMatching('ReferenceError: a is not defined'))
      done()
    })
    try {
      eval("a()")
    } catch (e) {
      window.onerror('message', 'source', 10, 10, e)
    }
  })
  it('测试JS错误--TypeError', (done) => {
    errorTracker.once("jserror", function (jserror) {
      expect(jserror[0]['type']).toEqual(1)
      expect(jserror[0]['desc']).toEqual('message at source:10:10')
      expect(jserror[0]['stack']).toEqual(expect.stringMatching('TypeError: 123 is not a function'))
      done()
    })
    try {
      eval("123()")
    } catch (e) {
      window.onerror('message', 'source', 10, 10, e)
    }
  })
  it('测试JS错误--RangeError', (done) => {
    errorTracker.once("jserror", function (jserror) {
      expect(jserror[0]['type']).toEqual(1)
      expect(jserror[0]['desc']).toEqual('message at source:10:10')
      expect(jserror[0]['stack']).toEqual(expect.stringMatching('RangeError: Invalid array length'))
      done()
    })
    try {
      let a = new Array(-1)
    } catch (e) {
      window.onerror('message', 'source', 10, 10, e)
    }
  })
  it('测试JS错误--UrlError', (done) => {
    errorTracker.once("jserror", function (jserror) {
      expect(jserror[0]['type']).toEqual(1)
      expect(jserror[0]['desc']).toEqual('message at source:10:10')
      expect(jserror[0]['stack']).toEqual(expect.stringMatching('URIError: URI malformed'))
      done()
    })
    try {
      decodeURI("%")
    } catch (e) {
      window.onerror('message', 'source', 10, 10, e)
    }
  })
})
