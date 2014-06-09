/**
 * Funktional helper methods simmilar to
 * underscore.js or low_dash.js
 *
 * @type {Object}
 */
var _ = {};

// Add underscore cleanup
sketch.addCleanupFunction(function () {
  _ = null;
});

_.a = function (array, wrap) {
  if (typeof array.length === "number") {
    return array;
  }

  var result = [];
  var enumerator = array.objectEnumerator(),
    ele = {};

  ele = enumerator.nextObject();
  while (ele) {
    if (ele.className().toString().indexOf("String") !== -1) {
      ele = ele.toString();
    }

    // wrap the element if wrap is true
    if (wrap !== undefined && wrap && typeof $ !== "undefined") {
      ele = $(ele);
    }

    result.push(ele);
    ele = enumerator.nextObject();
  }

  return result;
};

_.each = _.forEach = function (obj, iterator, context) {
  obj.forEach(iterator, context);
};

_.extend = function (obj) {
  _.each(Array.prototype.slice.call(arguments, 1), function (source) {
    var prop;

    if (source) {
      for (prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

/**
 * Test for a Sketch element
 *
 * MSLayerGroup, MSShapeGroup, MSShapes, MSShapePathLayer, MSTextLayer
 *
 * First check if the element has the "className" property. Alle
 * Sketch elements have this property, JavaScript eleemnts don't.
 * Second check if the className contains "MS" and either
 * "Shape" or "Layer".
 *
 * "MSSlice", "MSPage" and "MSArtboard" elements are excluded.
 *
 * @param  {mixed}  obj The element to test
 * @return {Boolean}    True if the element is a Sketch element
 */
_.isSketchElement = function (obj) {
  var result = false,
    className;

  if ( obj.className ) {
    className = obj.className().toString();
    if (className.indexOf("MS") !== -1 &&
        (className.indexOf("Shape") !== -1 || className.indexOf("Layer") !== -1)) {
      result = true;
    }
  }

  return result;
};
