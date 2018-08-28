function Fps () {
  this.fpsData = []
}

Fps.prototype.add = function (d) {
  if (this.fpsData.length >= 100) {
    this.fpsData.shift()
  }
  this.fpsData.push(d)
}

Fps.prototype.get = function () {
  return this.fpsData
}

Fps.prototype.getLatest = function () {
  return this.fpsData[this.fpsData.length - 1]
}

Fps.prototype.monitor = function () {
  // fps起始时间
  var lastTime = performance.now();
  // 上次帧触发时间
  // var lastFameTime = performance.now();
  // 帧数
  var frame = 0;

  var self = this
  
  var loop = function() {
      var now =  performance.now();
      // lastFameTime = now;
      frame++;
      if (now > 1000 + lastTime) {
        self.add(frame)
          frame = 0;    
          lastTime = now;
      };           
      window.requestAnimationFrame(loop);   
  }
  loop()
}

