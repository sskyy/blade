const commands = require('../src/plugin/manifest.json').commands
const fs = require('fs')
const file = './Contents/Sketch/plugin.js'

function attachHandlers() {
  commands.forEach(function (command) {
    var compiled = fs.readFileSync(file);
    compiled += "\n\nvar " + command.handler + " = handlers." + command.handler + ";";
    fs.writeFileSync(file, compiled);
  });
}

attachHandlers()
