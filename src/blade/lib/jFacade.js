/**
 * JSON replacer
 *
 * Prints:
 * _ the Obj-C class description for Obj-C classes
 * _ {} for functions
 * _ "not available" for properties that are not available
 *     in the element in the current mode in the JSON output.
 * _ the value as is for all others
 *
 * @param  {string} key   The key name
 * @param  {mixed} value  The value
 * @return {mixed}        The value or a special return value
 */
var objcJSONReplacer = function (key, value) {
  /*jslint unparam: true */
  if (typeof value === "object" && value.hasOwnProperty("className") &&
      value.hasOwnProperty("description")) {
    value = value.description().toString();
  } else if (typeof value === "function") {
    value = {};
  } else if (value === undefined) {
    value = "not available";
  }
  return value;
};


var blendModeByNumber = {
  0: "Normal",
  1: "Darken",
  2: "Multiply",
  3: "Color Burn",
  4: "Lighten",
  5: "Screen",
  6: "Color Dodge",
  7: "Overlay",
  8: "Soft Light",
  9: "Hard Light",
  10: "Difference",
  11: "Exclusion",
  12: "Hue",
  13: "Saturation",
  14: "Color",
  15: "Luminosity",
  16: "Source In",
  17: "Source Out",
  18: "Source Atop",
  19: "Destination Over",
  20: "Destination In",
  21: "Destination Out",
  22: "Destination Atop"
};

var blendModeByName = {
  "Normal": 0,
  "Darken": 1,
  "Multiply": 2,
  "Color Burn": 3,
  "Lighten": 4,
  "Screen": 5,
  "Color Dodge": 6,
  "Overlay": 7,
  "Soft Light": 8,
  "Hard Light": 9,
  "Difference": 10,
  "Exclusion": 11,
  "Hue": 12,
  "Saturation": 13,
  "Color": 14,
  "Luminosity": 15,
  "Source In": 16,
  "Source Out": 17,
  "Source Atop": 18,
  "Destination Over": 19,
  "Destination In": 20,
  "Destination Out": 21,
  "Destination Atop": 22
};

// Define a layer stack to avoid to wrap a Sketch layer
// again when the same layer has been wrapped already.
var jFacadeLayerStack = {};

// Create the basic facade function and the
// init function to create the layer facade from the
// layer passed into. Check if the layer is cached.
var jFacade = function (element) {
  // Check if the element is an Obj-C element
  // if not return the element
  var hash,
    result;

  // If the element is an Obj-C element
  // check if the element is saved in the stack
  // and return the element from the stack if so.
  // Return a new element if not.
  if (_.isSketchElement(element)) {
    hash = element.hash().toString(16);

    if (!jFacadeLayerStack.hasOwnProperty(hash)) {
      result = new jFacade.prototype.init(element);
        egUtil.log( "init" + result.toString())

        jFacadeLayerStack[hash] = result;
      // log("not in stack");
    } else {
      result = jFacadeLayerStack[hash];
      // log("in stack");
    }
  } else {
    result = element;
    //log("no layer");
  }
    egUtil.log( "result" + result)
  return result;
};

var init = jFacade.prototype.init = function (ele) {
  this._layer = ele;
  var self = this;
  // this.toString = jFacade.prototype.toString;
  this.toString = function () {
    var out = [], i, j, l, funcName;

    for (i in self.functionList) {
      funcName = self.functionList[i];
      // If the function name ends with "-" this is a class with
      // several possible elements and its toString() method:
      // call this toString() method on each element.
      if (funcName.indexOf("-") === funcName.length - 1) {
        funcName = funcName.substr(0, funcName.length - 1);
        // Check for elements
        if (funcName in self && self[funcName]() !== undefined &&
            self[funcName]().length()) {
          for (j = 0, l = self[funcName]().length(); j < l; j++) {
            // Call toString() on all elements
            out.push(funcName + "[" + j + "]: " +
              JSON.stringify(self[funcName](j).toString(), objcJSONReplacer, 2));
          }
        }
      } else if (typeof self[funcName]() === "object") {
        out.push(funcName + ": " +
            JSON.stringify(self[funcName](), objcJSONReplacer, 2));
      } else {
        out.push(funcName + ": " + self[funcName]());
      }
    }

    return out.join("\n");
  };

  Object.defineProperty(this, "_layer", {enumerable: false});

    return this;
};

init.prototype = jFacade.prototype;

Object.defineProperty(jFacade.prototype, "init", {enumerable: false});

// Set the $ shorthand for the facade function
var $ = jFacade;

// Add jFacade cleanup
sketch.addCleanupFunction(function () {
  $ = null;
  jFacade = null;
  jFacadeLayerStack = null;
  init = null;
  objcJSONReplacer = null;
  blendModeByName = null;
  blendModeByNumber = null;
});


// internal hash and methods
_.extend(jFacade.prototype, {
  functionList: [],

  // Trigger the layerDidChange state to get Sketch redraw the layer.
  // How can a page redraw be triggered?
  updateChanges: function () {
    this._layer.layerDidChange();
    if (this.isSelected) {
      this.isSelected = 0;
      this.isSelected = 1;
    }

    return this;
  },
  _roundFloat: function (float, places) {
    var _p = places !== undefined ? Math.pow(10, places) : 10;

    return Math.round(float * _p) / _p;
  }
});

Object.defineProperty(jFacade.prototype, "functionList", {enumerable: false});
Object.defineProperty(jFacade.prototype, "_roundFloat", {enumerable: false});


// Add layer methods to the jFacade prototype
// and add the function names to the function list
// which is used for the toString() method to output
// the listed values.
jFacade.prototype.functionList = jFacade.prototype.functionList.concat([
  "get", "parentGroup", "frame", "style",
  "CSSAttributes", "CSSRotation",
  "type", "kind", "className", "editing",
  "name", "nameIsFixed", "shouldBreakMaskChain",
  "isVisible", "isLocked", "isFlippedHorizontal",
  "isFlippedVertical", "rotation", "isSelected",
  "opacity", "blendMode",
  "rectangleFixedRadius", "polygonNumberOfPoints", "triangleIsEquilateral",
  "spiralBegin", "spiralSize", "spiralStrength",
  "starRadius", "starNumberOfPoints"
]);
_.extend(jFacade.prototype, {
  get: function () {
    return this._layer;
  },
  properties: function () {
    var prop,
      out = [];

    for (prop in this) {
      out.push(prop);
    }

    return out.sort();
  },
  parentGroup: function () {
    return this._layer.parentGroup();
  },
  duplicate: function () {
    return jFacade(this._layer.duplicate());
  },
  style: function () {
    if (this._layer.hasOwnProperty("style")) {
      return this._layer.style();
    }
  },
  frame: function () {
    if (this._layer.hasOwnProperty("frame")) {
      return this._layer.frame();
    }
  },
  className: function () {
    return this._layer.className().toString();
  },
  CSSAttributes: function () {
    if (this._layer.hasOwnProperty("CSSAttributeString")) {
      return this._layer.CSSAttributeString().split("\n");
    }
  },
  CSSRotation: function () {
    if (this._layer.hasOwnProperty("CSSRotation")) {
      return this._layer.CSSRotation().toString()
          .replace(/^\n/, "").split("\n") || [];
    }
  },
  editing: function () {
    var val = 0;

    if (this._layer.hasOwnProperty("isEditing")) {
      val = this._layer.isEditing() || 0;
    } else if (this._layer.hasOwnProperty("isEditingText")) {
      val = this._layer.isEditingText() || 0;
    }

    return val;
  },
  type: function () {
    var _type = "Path";

    if (this.className() === "MSLayerGroup") {
      _type = "LayerGroup";
    } else if (this.className() === "MSShapeGroup" ||
        this.className().indexOf("Layer") !== -1) {
      _type = "Layer";
    }
    return _type;
  },
  kind: function () {
    var _class = this.className(),
      _isShape = /^MS\w*Shape$/.test(_class),
      _kind = "Other",
      _path;
    egUtil.log( "class:" + _class)

    if (_class.indexOf("MSText") !== -1) { // text layer
      _kind = "Text";
    } else if (_class.indexOf("MSBitmap") !== -1) { // text layer
      _kind = "Bitmap";
    } else if (_isShape) { // any shape layer
      _kind = _class.replace("MS", "").replace("Shape", "");
    } else if (_class === "MSShapePathLayer") { // shape path layer
      _path = this._layer.path(); // get the layer path
      if (_path.isLine()) { // check with the path method
        _kind = "Line";
      } else if (_path.isRectangle()) { // check with the path method
        _kind = "Rectangle";
      } else if (_path.isPolygon()) { // check with the path method
        _kind = "Polygon";
      } else {
        _kind = "Vector";
      }
    } else if (_class.indexOf("Group") !== -1) { // group layer
      if (this._layer.children().length() === 2) {
        var _lay = this._layer.children()[0],
          _class1 = _lay.className().toString(),
          _isShape1 = /^MS\w*Shape$/.test(_class1);

        if (_class1.indexOf("MSShapePath") !== -1) { // shape path
          _path = _lay.path(); // get the path on the layer
          if (_path.isLine()) { // check with the path method
            _kind = "Line";
          }
        } else if (_isShape1) {
          _kind = _class1.replace("MS", "").replace("Shape", "");
        }
      } else {
        _kind = _class.replace("MS", ""); // get the class name without "MS"
      }
    }

    return _kind;
  },
  name: function (val) {
    var returnVal;

    if (!arguments.length) {
      returnVal = this._layer.name().toString();
    } else {
      this._layer.setName(val);
      returnVal = this;
    }

    return returnVal;
  },
  _layerProperty: function (property, setProperty, val) {
    var returnVal;

    if (val === undefined) {
      if (this._layer.hasOwnProperty(property)) {
        returnVal = this._layer[property]() || 0;
      }
    } else {
      if (this._layer.hasOwnProperty(setProperty)) {
        this._layer[setProperty](val);
      }
      returnVal = this;
    }

    return returnVal;
  },
  nameIsFixed: function (val) {
    return this._layerProperty("nameIsFixed", "setNameIsFixed", val);
  },
  shouldBreakMaskChain: function (val) {
    return this._layerProperty("shouldBreakMaskChain",
        "setShouldBreakMaskChain", val);
  },
  isVisible: function (val) {
    return this._layerProperty("isVisible", "setIsVisible", val);
  },
  isLocked: function (val) {
    return this._layerProperty("isLocked", "setIsLocked", val);
  },
  isFlippedHorizontal: function (val) {
    return this._layerProperty("isFlippedHorizontal", "setIsFlippedHorizontal", val);
  },
  isFlippedVertical: function (val) {
    return this._layerProperty("isFlippedVertical", "setIsFlippedVertical", val);
  },
  rotation: function (val) {
    return this._layerProperty("rotation", "setRotation", val);
  },
  isSelected: function (val) {
    return this._layerProperty("isSelected", "setIsSelected", val);
  },
  opacity: function (val) {
    var returnVal;

    if (!arguments.length) {
      if (this._layer.hasOwnProperty("style")) {
        returnVal = this._layer.style().contextSettings().opacity();
      }
    } else {
      if (this._layer.hasOwnProperty("style")) {
        this._layer.style().contextSettings().setOpacity(val);
      }
      returnVal = this;
    }

    return returnVal;
  },
  blendMode: function (val) {
    var returnVal;

    if (!arguments.length) {
      if (this._layer.hasOwnProperty("style")) {
        val = this._layer.style().contextSettings().blendMode() || 0;
        returnVal = blendModeByNumber[val];
      }
    } else {
      if (this._layer.hasOwnProperty("style")) {
        if (typeof val === "string") {
          val = blendModeByName[val];
        }
        if (val < 0 || val > 22) {
          val = 0;
        }
        this._layer.style().contextSettings().setBlendMode(val);
      }
      returnVal = this;
    }

    return returnVal;
  },
  // Handle shape specific properties
  _shapeSpecificProperty: function (kind, property, setProperty, val) {
    var returnVal;

    if (val === undefined) {
      if (this.kind() === kind) {
        if (this.editing()) {
          returnVal = this._layer[property]() || 0;
        } else {
          returnVal = this._layer.children()[0][property]() || 0;
        }
      }
    } else {
      if (this.kind() === kind) {
        if (this.editing()) {
          this._layer[setProperty](val);
        } else {
          this._layer.children()[0][setProperty](val);
        }
      }
      returnVal = this;
    }

    return returnVal;
  },
  // Special rectangle property
  rectangleFixedRadius: function (val) {
    return this._shapeSpecificProperty("Rectangle", "fixedRadius",
      "setFixedRadius", val);
  },
  // Special polygon property
  polygonNumberOfPoints: function (val) {
    return this._shapeSpecificProperty("Polygon", "numberOfPoints",
      "setNumberOfPoints", val);
  },
  // Special trianle property
  triangleIsEquilateral: function (val) {
    return this._shapeSpecificProperty("Triangle", "isEquilateral",
      "setIsEquilateral", val);
  },
  // Special spiral property
  spiralBegin: function (val) {
    return this._shapeSpecificProperty("Spiral", "start",
      "setStart", val);
  },
  // Special spiral property
  spiralSize: function (val) {
    return this._shapeSpecificProperty("Spiral", "size",
      "setSize", val);
  },
  // Special spiral property
  spiralStrength: function (val) {
    return this._shapeSpecificProperty("Spiral", "compactness",
      "setCompactness", val);
  },
  // Special star property
  starRadius: function (val) {
    return this._shapeSpecificProperty("Star", "radius",
      "setRadius", val);
  },
  // Special polygon property
  starNumberOfPoints: function (val) {
    return this._shapeSpecificProperty("Star", "numberOfPoints",
      "setNumberOfPoints", val);
  }
});

Object.defineProperty(jFacade.prototype, "_layerProperty", {enumerable: false});
Object.defineProperty(jFacade.prototype, "_shapeSpecificProperty",
    {enumerable: false});



// Add size and position methods to the jFacade prototype
// and add the function names to the function list
// which is used for the toString() method to output
// all values.
jFacade.prototype.functionList = jFacade.prototype.functionList.concat([
  "x", "y", "height", "width",
  "constrainProportions",
  "position", "size"
]);
_.extend(jFacade.prototype, {
  x: function (val) {
    var returnVal;

    if (!arguments.length) {
      returnVal = this._roundFloat(this._layer.absoluteRect().rulerX()) || 0.0;
    } else {
      this._layer.absoluteRect().setRulerX(val);
      returnVal = this;
    }

    return returnVal;
  },
  y: function (val) {
    var returnVal;

    if (!arguments.length) {
      returnVal = this._roundFloat(this._layer.absoluteRect().rulerY()) || 0.0;
    } else {
      this._layer.absoluteRect().setRulerY(val);
      returnVal = this;
    }

    return returnVal;
  },
  height: function (val) {
    var returnVal;

    if (!arguments.length) {
      if (this._layer.hasOwnProperty("frame")) {
        returnVal = this._roundFloat(this._layer.frame().height()) || 0.0;
      }
    } else {
      if (this._layer.hasOwnProperty("frame")) {
        this._layer.frame().setHeight(val);
      }
      returnVal = this;
    }

    return returnVal;
  },
  width: function (val) {
    var returnVal;

    if (!arguments.length) {
      if (this._layer.hasOwnProperty("frame")) {
        returnVal = this._roundFloat(this._layer.frame().width()) || 0.0;
      }
    } else {
      if (this._layer.hasOwnProperty("frame")) {
        this._layer.frame().setWidth(val);
      }
      returnVal = this;
    }

    return returnVal;
  },
  constrainProportions: function (val) {
    var returnVal;

    if (!arguments.length) {
      if (this._layer.hasOwnProperty("frame")) {
        returnVal = this._layer.frame().shouldConstrainProportions() || 0.0;
      }
    } else {
      if (this._layer.hasOwnProperty("frame")) {
        this._layer.frame().setConstrainProportions(val);
      }
      returnVal = this;
    }

    return returnVal;
  },
  position: function (position) {
    var returnVal;

    if (!arguments.length) {
      if (!this.editing() && this.kind() === "Line"
            && this._layer.hasOwnProperty("x1")) {
        returnVal = {
          P1: {
            x1: this._roundFloat(this._layer.x1()) || 0.0,
            y1: this._roundFloat(this._layer.y1()) || 0.0
          },
          P2: {
            x2: this._roundFloat(this._layer.x2()) || 0.0,
            y2: this._roundFloat(this._layer.y2()) || 0.0
          }
        };
      } else {
        returnVal = {
          x: this._roundFloat(this._layer.absoluteRect().rulerX()) || 0.0,
          y: this._roundFloat(this._layer.absoluteRect().rulerY()) || 0.0
        };
      }
    } else {
      // Position parameter:
      // Line {P1: {x1: 10, y1: 10}, P2: {x2: 10, y2: 10}}
      // Others {x: 10, y: 10}
      var _x,
        _y;

      if (!this.editing() && this.kind() === "Line") {
        if (position !== undefined && (position.P1 !== undefined
            || this._layer.hasOwnProperty("x1"))) {
          _x = position.P1.x1 || this._layer.x1() || 0.0;
          _y = position.P1.y1 || this._layer.y1() || 0.0;

          this._layer.setX1(_x);
          this._layer.setY1(_y);
        }
        if (position !== undefined && (position.P2 !== undefined
            || this._layer.hasOwnProperty("x2"))) {
          _x = position.P2.x2 || this._layer.x2() || 0.0;
          _y = position.P2.y2 || this._layer.y2() || 0.0;

          this._layer.setX2(_x);
          this._layer.setY2(_y);
        }
      } else {
        if (position !== undefined && position.x !== undefined) {
          this._layer.absoluteRect().setRulerX(position.x);
        }
        if (position !== undefined && position.y !== undefined) {
          this._layer.absoluteRect().setRulerY(position.y);
        }
      }

      returnVal = this;
    }

    return returnVal;
  },
  size: function (size) {
    var returnVal;

    if (!arguments.length) {
      if (this.kind() === "Line" && this._layer.hasOwnProperty("length")) {
        returnVal = {
          length: this._roundFloat(this._layer.length()) || 0.0
        };
      } else {
        returnVal = {
          width: this._roundFloat(this._layer.frame().width()) || 0.0,
          height: this._roundFloat(this._layer.frame().height()) || 0.0
        };
      }
    } else {
      // Size parameter:
      // Line {length: 100}
      // Others {width: 100, height: 100}
      if (!this.editing() && this.kind() === "Line" &&
          size.length !== undefined) {
        this._layer.setLength(size.length);
      } else if (this.editing() || this.kind() !== "Line") {
        if (size.width !== undefined) {
          this._layer.frame().setWidth(size.width);
        }
        if (size.height !== undefined) {
          this._layer.frame().setHeight(size.height);
        }
      }
      returnVal = this;
    }

    return returnVal;
  }
});


// Add style fill and border methods to the jFacade prototype
// and add the function names to the function list
// which is used for the toString() method to output
// all values.
jFacade.prototype.functionList = jFacade.prototype.functionList.concat([
  "fills", "fills-", "borders", "borders-"
]);
_.extend(jFacade.prototype, {
  color: function (colorObj, colorType, val) {
    var that = this,
      returnVal = colorObj || {};

    var hex2rgb = function (hex) {
      hex = hex.substr(0, 1) === "#" ? hex.substr(1) : hex;
      if (hex.length === 3) {
        hex = hex.replace(/(.)(.)(.)/, "$1$1$2$2$3$3");
      }
      return {
        red: parseInt(hex.substr(0, 2), 16) / 255,
        green: parseInt(hex.substr(2, 2), 16) / 255,
        blue: parseInt(hex.substr(4, 2), 16) / 255,
        alpha: 1
      };
    };

    var rgb2hex = function (c) {
      function hex(x) {
        return ("0" + parseInt(x, 10).toString(16)).slice(-2);
      }
      return "#" + hex(Math.round(c.red() * 255)) +
        hex(Math.round(c.green() * 255)) +
        hex(Math.round(c.blue() * 255));
    };

    if (colorObj !== undefined &&
        colorType !== undefined &&
        val === undefined) {
      switch (colorType) {
      case "red":
      case "green":
      case "blue":
      case "alpha":
        returnVal = that._roundFloat(colorObj[colorType](), 6);
        break;

      case "rgb":
        returnVal = {
          red: that._roundFloat(colorObj.red(), 6),
          green: that._roundFloat(colorObj.green(), 6),
          blue: that._roundFloat(colorObj.blue(), 6),
          alpha: that._roundFloat(colorObj.alpha(), 6)
        };
        break;

      case "hex":
        returnVal = rgb2hex(colorObj);
        break;

      default:
      }
    } else if (colorObj !== undefined &&
        colorType !== undefined &&
        val !== undefined) {
      switch (colorType) {
      case "red":
        colorObj.setRed(val);
        returnVal = colorObj;
        break;

      case "green":
        colorObj.setGreen(val);
        returnVal = colorObj;
        break;

      case "blue":
        colorObj.setBlue(val);
        returnVal = colorObj;
        break;

      case "alpha":
        colorObj.setAlpha(val);
        returnVal = colorObj;
        break;

      case "rgb":
        if (val.red !== undefined) {
          colorObj.setRed(val.red);
        }
        if (val.green !== undefined) {
          colorObj.setGreen(val.green);
        }
        if (val.blue !== undefined) {
          colorObj.setBlue(val.blue);
        }
        if (val.alpha !== undefined) {
          colorObj.setAlpha(val.alpha);
        }
        returnVal = colorObj;
        break;

      case "hex":
        var rgb = hex2rgb(val);

        colorObj.setRed(rgb.red);
        colorObj.setGreen(rgb.green);
        colorObj.setBlue(rgb.blue);
        colorObj.setAlpha(rgb.alpha);
        returnVal = colorObj;
        break;

      default:
        returnVal = colorObj;
      }
    }

    return returnVal;
  },
  fills: function (index) {
    var self = this.fills.methods || {},
      that = this,
      returnVal;

    if (!this._layer.hasOwnProperty("style")) {
      returnVal = self;
    } else if (!arguments.length) {
      returnVal = this._layer.style().fills();
    } else {
      var fill = this._layer.style().fills()[index];

      self.get = function () {
        return fill;
      };

      self.isEnabled = function (val) {
        if (!arguments.length) {
          if (fill.hasOwnProperty("isEnabled")) {
            returnVal = fill.isEnabled() || 0;
          }
        } else {
          if (fill.hasOwnProperty("setIsEnabled")) {
            fill.setIsEnabled(val);
          }
          returnVal = self;
        }

        return returnVal;
      };

      self.fillType = function (val) {
        var filltypeNum = {
            0: "Color",
            1: "Gradient",
            4: "Pattern"
          },
          filltypeString = {
            "Color": 0,
            "Gradient": 1,
            "Pattern": 4
          };

        if (!arguments.length) {
          returnVal = filltypeNum[(fill.fillType() || 0)];
        } else {
          if (typeof val === "string") {
            val = filltypeString[val];
          }
          fill.setFillType(val);
          returnVal = self;
        }

        return returnVal;
      };

      self.gradient = function (val) {
        if (!arguments.length) {
          returnVal = fill.gradient() || 0;
        } else {
          fill.setGradient(val);
          returnVal = self;
        }

        return returnVal;
      };

      self.patternImage = function (val) {
        if (!arguments.length) {
          if (fill.hasOwnProperty("patternImage")) {
            returnVal = fill.patternImage() || 0;
          }
        } else {
          if (fill.hasOwnProperty("setPatternImage")) {
            fill.setPatternImage(val);
          }
          returnVal = self;
        }

        return returnVal;
      };

      self.noiseIntensity = function (val) {
        if (!arguments.length) {
          returnVal = fill.noiseIntensity() || 0;
        } else {
          fill.setNoiseIntensity(val);
          returnVal = self;
        }

        return returnVal;
      };

      self.color = function (colorType, val) {
        if (colorType === undefined && val === undefined) {
          returnVal = fill.color();
        } else if (colorType !== undefined && val === undefined) {
          returnVal = that.color(fill.color(), colorType);
        } else if (colorType !== undefined && val !== undefined) {
          fill.setColor(that.color(fill.color(), colorType, val));
          returnVal = self;
        }

        return returnVal;
      };

      self.toString = function () {
        return {
          isEnabled: self.isEnabled(),
          fillType: self.fillType(),
          gradient: self.gradient(),
          patternImage: self.patternImage(),
          noiseIntensity: self.noiseIntensity(),
          color: self.color("rgb")
        };
      };

      returnVal = self;
    }

    return returnVal;

  },
  borders: function (index) {
    var self = this.borders.methods || {},
      that = this,
      returnVal;

    if (!this._layer.hasOwnProperty("style")) {
      returnVal = self;
    } else if (!arguments.length) {
      returnVal = this._layer.style().borders();
    } else {
      var border = this._layer.style().borders()[index];

      self.get = function () {
        return border;
      };

      self.isEnabled = function (val) {
        if (!arguments.length) {
          returnVal = border.isEnabled() || 0;
        } else {
          border.setIsEnabled(val);
          returnVal = self;
        }

        return returnVal;
      };

      self.fillType = function (val) {
        var filltypeNum = {
            0: "Color",
            1: "Gradient"
          },
          filltypeString = {
            "Color": 0,
            "Gradient": 1
          };

        if (!arguments.length) {
          returnVal = filltypeNum[(border.fillType() || 0)];
        } else {
          if (typeof val === "string") {
            val = filltypeString[val];
          }
          border.setFillType(val);
          returnVal = self;
        }

        return returnVal;
      };

      self.position = function (val) {
        var positionNum = {
            0: "Center",
            1: "Inside",
            2: "Outside"
          },
          positionString = {
            "Center": 0,
            "Inside": 1,
            "Outside": 2
          };

        if (!arguments.length) {
          returnVal = positionNum[(border.position() || 0)];
        } else {
          if (typeof val === "string") {
            val = positionString[val];
          }
          border.setPosition(val);
          returnVal = self;
        }

        return returnVal;
      };

      self.thickness = function (val) {
        if (!arguments.length) {
          returnVal = border.thickness() || 0;
        } else {
          border.setThickness(val);
          returnVal = self;
        }

        return returnVal;
      };

      self.gradient = function (val) {
        if (!arguments.length) {
          returnVal = border.gradient() || 0;
        } else {
          border.setGradient(val);
          returnVal = self;
        }

        return returnVal;
      };

      self.color = function (colorType, val) {
        if (colorType === undefined && val === undefined) {
          returnVal = border.color();
        } else if (colorType !== undefined && val === undefined) {
          returnVal = that.color(border.color(), colorType);
        } else if (colorType !== undefined && val !== undefined) {
          border.setColor(that.color(border.color(), colorType, val));
          returnVal = self;
        }

        return returnVal;
      };

      self.toString = function () {
        return {
          isEnabled: self.isEnabled(),
          fillType: self.fillType(),
          gradient: self.gradient(),
          position: self.position(),
          thickness: self.thickness(),
          color: self.color("rgb")
        };
      };

      returnVal = self;
    }

    return returnVal;
  }
});
