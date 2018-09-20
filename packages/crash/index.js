// https://zhuanlan.zhihu.com/p/40273861?utm_source=qq&utm_medium=social&utm_oi=27920756113408
// 页面 JavaScript 代码
if (navigator.serviceWorker.controller !== null) {
  let HEARTBEAT_INTERVAL = 5 * 1000; // 每五秒发一次心跳
  let sessionId = uuid();
  let heartbeat = function () {
    navigator.serviceWorker.controller.postMessage({
      type: 'heartbeat',
      id: sessionId,
      data: {} // 附加信息，如果页面 crash，上报的附加数据
    });
  }
  window.addEventListener("beforeunload", function() {
    navigator.serviceWorker.controller.postMessage({
      type: 'unload',
      id: sessionId
    });
  });
  setInterval(heartbeat, HEARTBEAT_INTERVAL);
  heartbeat();
}

const CHECK_CRASH_INTERVAL = 10 * 1000; // 每 10s 检查一次
const CRASH_THRESHOLD = 15 * 1000; // 15s 超过15s没有心跳则认为已经 crash
const pages = {}
let timer
function checkCrash() {
  const now = Date.now()
  for (var id in pages) {
    let page = pages[id]
    if ((now - page.t) > CRASH_THRESHOLD) {
      // 上报 crash
      delete pages[id]
    }
  }
  if (Object.keys(pages).length == 0) {
    clearInterval(timer)
    timer = null
  }
}

worker.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === 'heartbeat') {
    pages[data.id] = {
      t: Date.now()
    }
    if (!timer) {
      timer = setInterval(function () {
        checkCrash()
      }, CHECK_CRASH_INTERVAL)
    }
  } else if (data.type === 'unload') {
    delete pages[data.id]
  }
})
