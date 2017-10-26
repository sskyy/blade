var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var execSync = require('child_process').execSync;

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

function escape (string) {
  return string.replace(/ /g, '\\ ').replace(/\n/g, '');
}

function exec (command) {
  return execSync(command).toString();
}

var binaryPath = null;
function getBinaryPath () {
  if (binaryPath) {
    return binaryPath;
  }
  // Get path to binary using type command
  binaryPath = exec('type -P sketchtool');
  if (!binaryPath) {
    return null;
  }
  binaryPath = escape(binaryPath);
  return binaryPath;
}

function check () {
  return !!getBinaryPath();
}

function sketchExec (command) {
  return exec(getBinaryPath() + ' ' + command);
}

function getVersion () {
  return sketchExec('--version');
}

function loadFile (path) {
  return JSON.parse(sketchExec('dump ' + escape(resolveApp(path))));
}

function runPluginWithIdentifier (identifier) {
}

module.exports = {
  check: check,
  exec: sketchExec,
  getVersion: getVersion,
  loadFile: loadFile,
  runPluginWithIdentifier: runPluginWithIdentifier
};
