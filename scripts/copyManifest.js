const fs = require('fs')
const path = require('path')

const pkg = require('../package.json')
const manifest = pkg.sketch
Object.assign({}, manifest, {
  description: pkg.description,
  author: pkg.author,
  version: pkg.version,
})

fs.writeFileSync(path.join(__dirname, '../Contents/Sketch/manifest.json'), JSON.stringify(manifest, null, 2))
