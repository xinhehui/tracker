/**
 * Created by xuxin on 2018/5/30.
 */
const fs = require('fs')
const pkgPath = require('path').resolve(__dirname + '/../package.json')
const pkg = require(pkgPath),
  version = pkg.version
const argv = require('process').argv,
  v = argv[2]

//todo 校验version的合法性，比较大小  给出参数提示
if (!v) {
  let arr = version.split('.')
  arr[2] = parseInt(arr[2]) + 1
  pkg.version = arr.join('.')


} else {
  pkg.version = v
}

fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), (err) => {
  if (err) throw err
  console.log('The file has been saved!')
})