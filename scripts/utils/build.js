var update = require('log-update');
var chalk = require('chalk');
var watch = require('watch');

function observe (options) {
  var start = new Date();
  console.log(chalk.yellow('Start watching...'));

  if (options.watching) {
    // HACK
    // for some reason on re-painting update deletes
    // the line before it, so we throw an empty one in here
    console.log();
  }

  // Initialize timer text
  update(chalk.grey('Just now'));

  // Set interval to update the timer text, so we can
  // see more easily if a rebuild has just happened
  var timer = setInterval(() => {
    update(chalk.grey(getTimerText(start)));
  }, options.interval);

  if (!options.watching) {
    options.paths.forEach(function (root) {
      watch.createMonitor(root, function (monitor) {
        monitor.on("created", options.callback);
        monitor.on("changed", options.callback);
        monitor.on("removed", options.callback);
      });
    });
  }

  return timer;
}

function logError (error) {
  console.log(chalk.bgRed('Compilation failed'));
  console.log(chalk.grey(error));
  console.log();
}

function getTimerText (start) {
  var diff = (new Date() - start) / 1000;
  if (diff < 60) {
    txt = 'Moments ago'
  } else if (diff < 60 * 60) {
    txt = Math.round(diff / 60) + 'mins ago';
  } else if (diff < 60 * 60 * 10) {
    txt = Math.round(diff / (60 * 60 * 10)) + 'hrs ago';
  } else {
    txt = 'A long time ago'
  }
  return txt;
}

module.exports = {
  observe,
  logError,
  getTimerText
};