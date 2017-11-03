const fs = require('fs')
const path = require('path')
const commands = require('../package.json').sketch.commands
const file = path.join(__dirname, '../Contents/Sketch/plugin.js')

commands.forEach(function (command) {
  var compiled = fs.readFileSync(file);
  compiled += "\n\nvar " + command.handler + " = handlers." + command.handler + ";";
  fs.writeFileSync(file, compiled);
});
