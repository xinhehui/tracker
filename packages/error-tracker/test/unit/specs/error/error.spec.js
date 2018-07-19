/* eslint-disable */
import ErrorTracker from 'root/src/index'
jest.mock('detector')

describe('errorHandle测试', () => {
  it('测试JS错误--SyntaxError', () => {
    const mockReportCallback = jest.fn()
    const errorTracker = new ErrorTracker({
      concat: false,
      server: 'http://localhost:10086/demo/demo/vertical.jpg',
      report: mockReportCallback
    })
    try {
      eval("var 1a")
    } catch (e) {
      window.onerror('message', 'source', 10, 10, e)
    }
    expect(mockReportCallback).toHaveBeenCalled()
    expect(mockReportCallback.mock.calls[0][0][0]['type']).toEqual(1)
    expect(mockReportCallback.mock.calls[0][0][0]['desc']).toEqual('message at source:10:10')
    expect(mockReportCallback.mock.calls[0][0][0]['stack']).toEqual(expect.stringMatching('Invalid or unexpected token'))
  })

  it('测试JS错误--RangeError', () => {
    const mockReportCallback = jest.fn()
    const errorTracker = new ErrorTracker({
      concat: false,
      server: 'http://localhost:10086/demo/demo/vertical.jpg',
      report: mockReportCallback
    })
    try {
      let a = new Array(-1)
    } catch (e) {
      window.onerror('message', 'source', 10, 10, e)
    }
    expect(mockReportCallback).toHaveBeenCalled()
    expect(mockReportCallback.mock.calls[0][0][0]['type']).toEqual(1)
    expect(mockReportCallback.mock.calls[0][0][0]['desc']).toEqual('message at source:10:10')
    expect(mockReportCallback.mock.calls[0][0][0]['stack']).toEqual(expect.stringMatching('RangeError: Invalid array length'))
  })
})
