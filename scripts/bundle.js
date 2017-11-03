const fs = require('fs')
const path = require('path')
const copyDir = require('copy-dir')
const rimraf = require('rimraf')

const dest = path.join(__dirname, '../dist')
if (fs.existsSync(dest)) {
  rimraf.sync(dest)
}
fs.mkdir(dest)
const src = path.join(__dirname, '../Contents')

copyDir.sync(src, `${dest}/blade.sketchplugin`)