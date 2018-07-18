/**
 * Created by xuxin on 2018/5/2.
 */
const path = require('path')
const babel = require('rollup-plugin-babel');
const cjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const node = require('rollup-plugin-node-resolve')
const version = process.env.VERSION || require('../package.json').version

const banner =
  '/*!\n' +
  ' * lucky-es-template.js v' + version + '\n' +
  ' * (c) 2018-' + new Date().getFullYear() + ' xxwade\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const resolve = p => path.resolve(__dirname, '../', p)

const builds = {
  'umd-dev': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/index.dev.js'),
    format: 'umd',
    env: 'development',
    plugins: [node(), cjs()],
    banner
  },
  'umd': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/index.js'),
    format: 'umd',
    env: 'production',
    sourceMap: 'inline',
    plugins: [node(), cjs()],
    banner
  },
  'umd-prod': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/index.min.js'),
    format: 'umd',
    env: 'production',
    sourceMap: 'inline',
    plugins: [node(), cjs()],
    banner
  }
}

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      replace({
        __VERSION__: version
      }),
      babel({
        exclude: 'node_modules/**'
      })
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'JsBridge'
    }
  }

  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}

