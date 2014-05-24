// Set the basic variables for an externally run script
// which are set by default when the script is run
// as a plugin from within Sketch. "doc" is defined when the script
// is called from within Sketch.
if (doc === undefined) {
  var doc, selection;
}
var sketch = null;

/**
 * Sketch connector - is helpful when the script is run
 * form an external editior and not from within Sketch.
 * (is executed automatically)
 * Set the sketch object and detect if the script is run
 * from within Sketch or external.
 * Add cleanup methods to delete objects which may use a lot
 * of memory - avoids Sketch crashes. With the addCleanupFunction
 * method functions are added to a stack which set objects/variables
 * to null to trigger garbage collection.
 * With the method "sketch.cleanup();" all saved functions are executed.
 *
 * The underscore clenup example sets the "_" object to null
 * to trigger garbage collection for the object.
 * // Add underscore cleanup
 * sketch.addCleanupFunction(function () {
 *   _ = null;
 * });
 *
 * @method init               Set the basic variables
 * @method activate           Bring Sketch to the front
 * @method addCleanupFunction Add a cleanup function to a stack
 * @method cleanup            Executes all cleanup functions from the stack
 */
(function () {
  sketch = {
    app: null,
    extern: false,
    cleanupHash: [],

    init: function () {
      if (doc === undefined) {
        this.extern = true;
        this.app = JSTalk.application("Sketch");
        doc = this.app.orderedDocuments()[0];
        selection = doc.selectedLayers();
        log = print;
      } else {
        this.app = NSApplication.sharedApplication();
        if (selection === null) {
          log("Selection has not been defined yet.");
          selection = NSArray.alloc().init();
        }
      }
    },
    activate: function () {
      this.app.activate();
    },
    /**
     * checkSelection
     *
     * Check for a given number of selected eleemnts.
     *
     * @param {int} amount     The amount of elemnts
     * @param {string} message The error message
     * @return {boolean}       True/False
     */
    checkSelection: function (amount, message) {
      if (selection.length() !== amount) {
        log(message);
        return false;
      }

      return true;
    },
    addCleanupFunction: function (func) {
      this.cleanupHash.push(func);
    },
    cleanup: function () {
      this.cleanupHash.forEach(function (func) {
        func();
      });
      sketch = null;
    }
  };
  sketch.init();
}());

/**
 * jlog - print object details
 *
 * If the indent level is given then print the output not in one line
 * but structured with the given indent.
 *
 * @param  {string} what    The object to be printed
 * @param  {integer} indent The indent level
 */
var jlog = function (what, indent) {
  if (indent === undefined) {
    log(JSON.stringify(what));
  } else {
    log(JSON.stringify(what, null, indent));
  }
};
