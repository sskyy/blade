const fs = require('fs')
const path = require('path')
var program = require('commander');
const pkg = require('../package.json')

const manifest = pkg.sketch

program.option('-p, --prod', 'production mode').parse(process.argv)

const finalManifest = Object.assign({}, manifest, {
  name: program.prod ? manifest.name : `${manifest.name}-Dev`,
  identifier: program.prod? manifest.identifier : `${manifest.identifier}.dev`,
  description: pkg.description,
  author: pkg.author.replace(/\s<.+>$/, ''),
  authorEmail: pkg.author.replace(/^[\w\s]+<(.+)>$/, '$1'),
  version: pkg.version,
  menu: program.prod? manifest.menu : {
    ...manifest.menu,
    items: [{
      ...manifest.menu.items[0],
      title: `${manifest.menu.items[0].title}-Dev`,
    }]
  }
})

const dest = program.prod ?
  path.join(__dirname, '../dist/blade.sketchplugin/Contents/Sketch/manifest.json'):
  path.join(__dirname, '../Contents/Sketch/manifest.json')

console.log(`writting manifest into ${dest} with mode: ${program.prod}`)
fs.writeFileSync(dest, JSON.stringify(finalManifest , null, 2))
