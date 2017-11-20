var handlers =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["f"] = toCSSRGBA;
/* harmony export (immutable) */ __webpack_exports__["b"] = extractEffectStyle;
/* unused harmony export extractBoxStyle */
/* harmony export (immutable) */ __webpack_exports__["c"] = extractPositionStyle;
/* harmony export (immutable) */ __webpack_exports__["a"] = extractBoxRelatedStyle;
/* unused harmony export extractStyle */
/* harmony export (immutable) */ __webpack_exports__["e"] = layerToBase64;
/* harmony export (immutable) */ __webpack_exports__["d"] = iteratorToArray;
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function map(arr, handler) {
  var result = [];
  for (var i = 0; i < arr.count(); i++) {
    result.push(handler(arr[i]));
  }
  return result;
}

function toCSSRGBA(RGBAStr) {
  return 'rgba(' + String(RGBAStr).replace(/[\(\)]/g, '').split(' ').map(function (v) {
    var _v$split = v.split(':'),
        _v$split2 = _slicedToArray(_v$split, 2),
        type = _v$split2[0],
        value = _v$split2[1];

    if (type !== 'a') {
      return Math.round(Number(value) * 256);
    }
    return Number(value);
  }).join(',') + ')';
}

function makeShadowCSS(shadow, inset) {
  return '' + (inset ? 'inset ' : '') + shadow.offsetX() + 'px ' + shadow.offsetY() + 'px ' + shadow.blurRadius() + 'px ' + shadow.spread() + 'px ' + toCSSRGBA(shadow.color());
}

function extractEffectStyle(layer) {
  var result = {};
  var fills = layer.sketchObject.style().fills();
  var borders = layer.sketchObject.style().borders();
  var shadows = layer.sketchObject.style().shadows();
  var innerShadows = layer.sketchObject.style().innerShadows();
  if (fills.count() > 0) {
    Object.assign(result, {
      background: map(fills, function (fill) {
        return toCSSRGBA(fill.color());
      }).join(',')
    });
  }

  if (borders.count() > 0) {
    var firstBorder = borders[0];
    Object.assign(result, {
      border: firstBorder.thickness() + 'px solid ' + toCSSRGBA(firstBorder.color())
    });
  }

  if (shadows.count() + innerShadows.count() > 0) {
    var totalShadows = map(shadows, makeShadowCSS).concat(map(innerShadows, function (s) {
      return makeShadowCSS(s, true);
    }));

    Object.assign(result, {
      boxShadow: totalShadows.join(',')
    });
  }

  return result;
}

function extractBoxStyle(layer) {
  return {
    width: layer.frame.width,
    height: layer.frame.height
  };
}

function extractPositionStyle(layer) {
  return {
    position: 'absolute',
    left: layer.sketchObject.absoluteRect().rulerX() - layer.container.sketchObject.absoluteRect().rulerX(),
    top: layer.sketchObject.absoluteRect().rulerY() - layer.container.sketchObject.absoluteRect().rulerY()
  };
}
function extractBoxRelatedStyle(layer) {
  return Object.assign(extractBoxStyle(layer), extractPositionStyle(layer));
}

function extractStyle(layer) {
  return Object.assign(extractBoxRelatedStyle(layer), extractEffectStyle(layer));
}

function layerToBase64(layer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var fileFolder = NSTemporaryDirectory();

  var finalOptions = _extends({}, options, {
    'use-id-for-name': true,
    scales: '3',
    formats: 'png',
    output: fileFolder
  });

  var fullPath = fileFolder + '/' + layer.id + '@' + finalOptions.scales + 'x.png';

  layer.export(finalOptions);

  var url = NSURL.fileURLWithPath(fullPath);
  var data = NSData.alloc().initWithContentsOfURL(url);
  var base64 = data.base64EncodedStringWithOptions(0);

  NSFileManager.defaultManager().removeItemAtURL_error(url, null);
  return 'data:image/png;base64,' + base64;
}

function iteratorToArray(iter) {
  var result = [];
  iter.iterate(function (item) {
    return result.push(item);
  });
  return result;
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = initWithContext;
/* unused harmony export loadFramework */
/* unused harmony export context */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return document; });
/* unused harmony export selection */
/* unused harmony export sketch */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return pluginFolderPath; });
var context = null;
var document = null;
var selection = null;
var sketch = null;

var pluginFolderPath = null;
var frameworkFolderPath = '/Contents/Resources/frameworks/';

function getPluginFolderPath() {
  // Get absolute folder path of plugin
  var split = context.scriptPath.split('/');
  split.splice(-3, 3);
  return split.join('/');
}

function initWithContext(ctx) {
  // This function needs to be called in the beginning of every entry point!
  // Set all env variables according to current context
  context = ctx;
  document = ctx.document || ctx.actionContext.document || MSDocument.currentDocument();
  selection = document ? document.selectedLayers() : null;
  pluginFolderPath = getPluginFolderPath();

  // Here you could load custom cocoa frameworks if you need to
  // loadFramework('FrameworkName', 'ClassName');
  // => would be loaded into ClassName in global namespace!
}

function loadFramework(frameworkName, frameworkClass) {
  // Only load framework if class not already available
  if (Mocha && NSClassFromString(frameworkClass) == null) {
    var frameworkDir = '' + pluginFolderPath + frameworkFolderPath;
    var mocha = Mocha.sharedRuntime();
    return mocha.loadFrameworkWithName_inDirectory(frameworkName, frameworkDir);
  }
  return false;
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export BridgeMessageHandler */
/* unused harmony export initBridgedWebView */
/* unused harmony export getFilePath */
/* harmony export (immutable) */ __webpack_exports__["a"] = createWebView;
/* harmony export (immutable) */ __webpack_exports__["b"] = sendAction;
/* unused harmony export receiveAction */
/* unused harmony export windowIdentifier */
/* unused harmony export panelIdentifier */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_cocoascript_class__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_cocoascript_class___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_cocoascript_class__);




// These are just used to identify the window(s)
// Change them to whatever you need e.g. if you need to support multiple
// windows at the same time...
var windowIdentifier = 'sketch-plugin-boilerplate--window';
var panelIdentifier = 'sketch-plugin-boilerplate--panel';

// Since we now create the delegate in js, we need the enviroment
// to stick around for as long as we need a reference to that delegate
coscript.setShouldKeepAround(true);

// This is a helper delegate, that handles incoming bridge messages
var BridgeMessageHandler = new __WEBPACK_IMPORTED_MODULE_1_cocoascript_class___default.a({
  'userContentController:didReceiveScriptMessage:': function userContentControllerDidReceiveScriptMessage(controller, message) {
    try {
      var bridgeMessage = JSON.parse(String(message.body()));
      receiveAction(bridgeMessage.name, bridgeMessage.data);
    } catch (e) {
      log('Could not parse bridge message');
      log(e.message);
    }
  }
});

log('BridgeMessageHandler');
log(BridgeMessageHandler);
log(BridgeMessageHandler.userContentController_didReceiveScriptMessage);

function initBridgedWebView(frame) {
  var bridgeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'SketchBridge';

  var config = WKWebViewConfiguration.alloc().init();
  var messageHandler = BridgeMessageHandler.alloc().init();
  config.userContentController().addScriptMessageHandler_name(messageHandler, bridgeName);
  config.preferences().setValue_forKey(true, 'developerExtrasEnabled');
  return WKWebView.alloc().initWithFrame_configuration(frame, config);
}

function getFilePath(file) {
  return __WEBPACK_IMPORTED_MODULE_0__core__["c" /* pluginFolderPath */] + '/Contents/Resources/webview/' + file;
}

function createWebView(path, frame) {
  var webView = initBridgedWebView(frame, 'Sketch');
  var url = path.slice(0, 4) === 'http' ? NSURL.URLWithString(path) : NSURL.fileURLWithPath(getFilePath(path));
  log('File URL');
  log(url);

  webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
  webView.loadRequest(NSURLRequest.requestWithURL(url));

  return webView;
}

function sendAction(webView, name) {
  var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!webView || !webView.evaluateJavaScript_completionHandler) {
    return;
  }
  // `sketchBridge` is the JS function exposed on window in the webview!
  var script = 'sketchBridge(' + JSON.stringify({ name: name, payload: payload }) + ');';
  webView.evaluateJavaScript_completionHandler(script, null);
}

function receiveAction(name) {
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  __WEBPACK_IMPORTED_MODULE_0__core__["a" /* document */].showMessage('I received a message! 😊🎉🎉');
}



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["i"] = parseNameAndQuery;
/* harmony export (immutable) */ __webpack_exports__["m"] = sendCommandToPanel;
/* harmony export (immutable) */ __webpack_exports__["n"] = sendCommandToWindow;
/* harmony export (immutable) */ __webpack_exports__["p"] = showWindow;
/* harmony export (immutable) */ __webpack_exports__["o"] = showPanel;
/* harmony export (immutable) */ __webpack_exports__["f"] = hidePanel;
/* harmony export (immutable) */ __webpack_exports__["k"] = recursiveParse;
/* harmony export (immutable) */ __webpack_exports__["h"] = isWindowOpened;
/* harmony export (immutable) */ __webpack_exports__["b"] = createFolder;
/* harmony export (immutable) */ __webpack_exports__["e"] = getPluginFolderPath;
/* harmony export (immutable) */ __webpack_exports__["d"] = getCurrentFilePath;
/* harmony export (immutable) */ __webpack_exports__["g"] = isFileExist;
/* harmony export (immutable) */ __webpack_exports__["a"] = copyFile;
/* harmony export (immutable) */ __webpack_exports__["q"] = writeToFile;
/* harmony export (immutable) */ __webpack_exports__["l"] = removeFile;
/* harmony export (immutable) */ __webpack_exports__["c"] = exportLayer;
/* harmony export (immutable) */ __webpack_exports__["j"] = parseRawName;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_webview__ = __webpack_require__(4);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();




function parseNameAndQuery(inputName) {
  var getDefaultValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return {};
  };

  var defaultValues = getDefaultValues();
  var result = { name: '', query: defaultValues, hash: {} };
  var name = String(inputName);
  if (name[0] !== '[') return result;

  // name/query/hash
  var state = 'none';
  var stack = '';

  function clearLastStack() {
    if (state === 'name') {
      result.name = stack;
    } else if (state === 'query') {
      stack.split('&').forEach(function (subStack) {
        var _subStack$split = subStack.split('='),
            _subStack$split2 = _slicedToArray(_subStack$split, 2),
            queryName = _subStack$split2[0],
            queryValue = _subStack$split2[1];

        var defaultValue = defaultValues[queryName];
        result.query[queryName] = typeof defaultValue === 'boolean' ? Boolean(queryValue) : typeof defaultValue === 'number' ? Number(queryValue) : queryValue;
      });
    } else {
      // hash
      stack.split('&').forEach(function (subStack) {
        var _subStack$split3 = subStack.split('='),
            _subStack$split4 = _slicedToArray(_subStack$split3, 2),
            queryName = _subStack$split4[0],
            queryValue = _subStack$split4[1];

        var defaultValue = defaultValues[queryName];
        result.hash[queryName] = typeof defaultValue === 'boolean' ? Boolean(queryValue) : typeof defaultValue === 'number' ? Number(queryValue) : queryValue;
      });
    }
    stack = '';
  }

  for (var i = 0; i < name.length; i++) {
    var c = name[i];
    if (c === '[' && state === 'none') {
      state = 'name';
    } else if (c === '?' && (state === 'name' || state === 'hash')) {
      clearLastStack();
      state = 'query';
    } else if (c === '#' && (state === 'name' || state === 'query')) {
      clearLastStack();
      state = 'hash';
    } else if (c === ']' && (state === 'name' || state === 'query' || state === 'hash')) {
      clearLastStack();
      state = 'end';
      return result;
    } else {
      stack += c;
    }
  }

  throw new Error('tag not closed: ' + inputName);
}

function sendCommandToPanel(path, command, argv) {
  __WEBPACK_IMPORTED_MODULE_0__utils_webview__["e" /* sendPanelAction */](path, command, argv);
}

function sendCommandToWindow(path, command, argv) {
  __WEBPACK_IMPORTED_MODULE_0__utils_webview__["f" /* sendWindowAction */](path, command, argv);
}

function showWindow(path) {
  // CAUTION use path as identifier
  __WEBPACK_IMPORTED_MODULE_0__utils_webview__["c" /* openWindow */](path, path);
}

function showPanel(path) {
  __WEBPACK_IMPORTED_MODULE_0__utils_webview__["g" /* showPanel */](path, path);
}

function hidePanel(path) {
  __WEBPACK_IMPORTED_MODULE_0__utils_webview__["b" /* hidePanel */](path, path);
}

function recursiveParse(entry, parsers) {
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _parseNameAndQuery = parseNameAndQuery(entry.name),
      name = _parseNameAndQuery.name,
      _parseNameAndQuery$qu = _parseNameAndQuery.query,
      query = _parseNameAndQuery$qu === undefined ? {} : _parseNameAndQuery$qu,
      hash = _parseNameAndQuery.hash;

  var resolvedName = name;
  if (resolvedName === '') {
    if (entry.isArtboard) {
      resolvedName = 'App';
    } else if (entry.isGroup) {
      resolvedName = 'Group';
    } else if (entry.isText) {
      resolvedName = 'Text';
    } else {
      // resolvedName = 'Unknown'
      resolvedName = 'Img';
    }
  }

  if (parsers[resolvedName] === undefined) {
    log('unknown parser ' + resolvedName + ', entry: ' + entry.name + ', parsers: ' + Object.keys(parsers).join(','));
    throw new Error('unknown parser ' + resolvedName);
  }

  var _parsers$resolvedName = parsers[resolvedName](entry, context),
      _parsers$resolvedName2 = _slicedToArray(_parsers$resolvedName, 2),
      result = _parsers$resolvedName2[0],
      next = _parsers$resolvedName2[1];

  if (next && next.length !== 0) {
    result.children = next.map(function (child) {
      return recursiveParse(child, parsers, context);
    });
  }
  return Object.assign(result, {
    state: Object.assign(result.state || {}, query),
    props: Object.assign(result.props || {}, hash)
  });
}

function isWindowOpened(path) {
  return Boolean(__WEBPACK_IMPORTED_MODULE_0__utils_webview__["a" /* findWebView */](path));
}

function createFolder(path) {
  var manager = NSFileManager.defaultManager();
  manager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(path, true, null, null);
  // [file_manager createDirectoryAtPath:[folders objectAtIndex:i] withIntermediateDirectories:true attributes:nil error:nil];
}

function getPluginFolderPath(context) {
  // Get absolute folder path of plugin
  var split = context.scriptPath.split('/');
  split.splice(-3, 3);
  return split.join('/');
}

function getCurrentFilePath(context) {
  return context.document.fileURL().path().replace(/\.sketch$/, '');
}

function isFileExist(source) {
  var manager = NSFileManager.defaultManager();
  return manager.fileExistsAtPath(source);
}

function copyFile(source, target) {
  var manager = NSFileManager.defaultManager();
  if (!manager.fileExistsAtPath(source)) throw new Error('file not exist ' + source);
  // [file_manager copyItemAtPath:org toPath:tar error:nil];
  manager.copyItemAtPath_toPath_error(source, target, null);
}

function writeToFile(path, content) {
  var resultStr = NSString.stringWithFormat('%@', content);
  resultStr.writeToFile_atomically(path, true);
}

function removeFile(path) {
  var manager = NSFileManager.defaultManager();
  // [file_manager removeItemAtPath:folder error:nil]
  manager.removeItemAtPath_error(path, null);
}

function exportLayer(layer, targetFolder, name) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var finalOptions = _extends({}, options, {
    'use-id-for-name': true,
    scales: '3',
    formats: 'png',
    output: targetFolder
  });

  var tmpFullPath = targetFolder + '/' + layer.id + '@' + finalOptions.scales + 'x.' + finalOptions.formats;
  layer.export(finalOptions);
  log('generating image: ' + tmpFullPath);
  var manager = NSFileManager.defaultManager();
  var targetPath = targetFolder + '/' + name + '.' + finalOptions.formats;
  log('renaming image to ' + targetPath);
  manager.moveItemAtURL_toURL_error(NSURL.fileURLWithPath(tmpFullPath), NSURL.fileURLWithPath(targetPath), null);
}

function parseRawName(inputName) {
  var name = String(inputName);
  return name.replace(/^\[.+\]/, '');
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webview__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__window__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__panel__ = __webpack_require__(11);
/* unused harmony reexport windowIdentifier */
/* unused harmony reexport panelIdentifier */
/* unused harmony reexport getFilePath */
/* unused harmony reexport createWebView */
/* unused harmony reexport sendActionToWebView */
/* unused harmony reexport receiveAction */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__window__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_1__window__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__window__["a"]; });
/* unused harmony reexport togglePanel */
/* unused harmony reexport openPanel */
/* unused harmony reexport closePanel */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_2__panel__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__panel__["a"]; });
/* unused harmony reexport isPanelOpen */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_2__panel__["b"]; });








/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Text;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



function Text(layer) {
  var node = {
    type: 'Text',
    state: {
      text: String(layer.sketchObject.stringValue()),
      style: _extends({
        fontSize: layer.sketchObject.fontSize(),
        color: Object(__WEBPACK_IMPORTED_MODULE_0__common__["f" /* toCSSRGBA */])(layer.sketchObject.textColor())
      }, Object(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* extractBoxRelatedStyle */])(layer), {
        // TODO align 翻译
        align: layer.sketchObject.textAlignment(),
        // TODO line spacing 翻译成 line height
        // lineHeight: layer.sketchObject.lineSpacing(),
        letterSpacing: layer.sketchObject.characterSpacing() || 'inherit',
        fontFamily: String(layer.sketchObject.fontPostscriptName())
      })
    }
  };

  return [node, []];
}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Group;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Group__ = __webpack_require__(17);




var BG_NAME = 'Bg';

function Group(group, _ref) {
  var createImgRef = _ref.createImgRef;

  var next = [];
  var bgLayer = null;
  group.iterate(function (layer) {
    // TODO 从节点上读数据
    if (Object(__WEBPACK_IMPORTED_MODULE_0__common__["i" /* parseNameAndQuery */])(layer.name).name === BG_NAME) {
      bgLayer = layer;
    } else {
      next.push(layer);
    }
  });

  var _parseNameAndQuery = Object(__WEBPACK_IMPORTED_MODULE_0__common__["i" /* parseNameAndQuery */])(group.name, __WEBPACK_IMPORTED_MODULE_2__components_Group__["a" /* getDefaultState */]),
      query = _parseNameAndQuery.query;

  var node = {
    type: 'Group',
    state: Object.assign(query, { style: Object(__WEBPACK_IMPORTED_MODULE_1__common__["a" /* extractBoxRelatedStyle */])(group) })
  };

  if (bgLayer) {
    if (bgLayer.isImage || bgLayer.isGroup) {
      node.state.style.background = createImgRef(bgLayer);
    } else {
      Object.assign(node.state.style, Object(__WEBPACK_IMPORTED_MODULE_1__common__["b" /* extractEffectStyle */])(bgLayer));
    }
  }

  return [node, next];
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["openRunner"] = openRunner;
/* harmony export (immutable) */ __webpack_exports__["sendDataToRunner"] = sendDataToRunner;
/* harmony export (immutable) */ __webpack_exports__["exportCurrentLayer"] = exportCurrentLayer;
/* harmony export (immutable) */ __webpack_exports__["onSelectionChanged"] = onSelectionChanged;
/* harmony export (immutable) */ __webpack_exports__["testSendAction"] = testSendAction;
/* harmony export (immutable) */ __webpack_exports__["parseLayer"] = parseLayer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_webview__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__parser__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__parser_createParserContext__ = __webpack_require__(24);







var RUNNER_URL = 'http://127.0.0.1:8080/runner.html';
var parserContext = Object(__WEBPACK_IMPORTED_MODULE_4__parser_createParserContext__["b" /* default */])();

function openRunner() {
  Object(__WEBPACK_IMPORTED_MODULE_2__common__["p" /* showWindow */])(RUNNER_URL);
}

function sendDataToRunner(context) {
  Object(__WEBPACK_IMPORTED_MODULE_0__utils_core__["b" /* initWithContext */])(context);
  if (!context.api) return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('error context.api!');
  if (!Object(__WEBPACK_IMPORTED_MODULE_2__common__["h" /* isWindowOpened */])(RUNNER_URL)) {
    return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('please open runner first!');
  }

  var firstArtboard = void 0;
  context.api().selectedDocument.selectedPage.iterate(function (page) {
    if (!firstArtboard) firstArtboard = page;
  });

  if (!firstArtboard || !firstArtboard.isArtboard) return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMEssage('please select an artboard');
  // const resultStr = NSString.stringWithFormat('%@', JSON.stringify(recursiveParse(firstArtboard, parsers)))
  // resultStr.writeToFile_atomically(context.document.fileURL().path().replace(/\.sketch$/, '.json'), true)
  var result = Object(__WEBPACK_IMPORTED_MODULE_2__common__["k" /* recursiveParse */])(firstArtboard, __WEBPACK_IMPORTED_MODULE_3__parser__["a" /* default */], parserContext);
  Object(__WEBPACK_IMPORTED_MODULE_2__common__["n" /* sendCommandToWindow */])(RUNNER_URL, 'config', result);
  return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('done!');
}

function exportCurrentLayer(context) {
  Object(__WEBPACK_IMPORTED_MODULE_0__utils_core__["b" /* initWithContext */])(context);
  if (!context.api) return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('error context.api!');
  if (!context.document.fileURL()) return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('please save your file first!');

  var sketch = context.api();

  var firstArtboard = void 0;
  sketch.selectedDocument.selectedPage.iterate(function (page) {
    if (!firstArtboard) firstArtboard = page;
  });

  if (!firstArtboard || !firstArtboard.isArtboard) return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('please select an artboard');

  var exportFolder = Object(__WEBPACK_IMPORTED_MODULE_2__common__["d" /* getCurrentFilePath */])(context);
  if (Object(__WEBPACK_IMPORTED_MODULE_2__common__["g" /* isFileExist */])(exportFolder)) Object(__WEBPACK_IMPORTED_MODULE_2__common__["l" /* removeFile */])(exportFolder);

  Object(__WEBPACK_IMPORTED_MODULE_2__common__["b" /* createFolder */])(exportFolder);
  var runnerPath = Object(__WEBPACK_IMPORTED_MODULE_2__common__["e" /* getPluginFolderPath */])(context) + '/Contents/Resources/runner';
  Object(__WEBPACK_IMPORTED_MODULE_2__common__["a" /* copyFile */])(runnerPath + '/index.js', exportFolder + '/index.js');
  Object(__WEBPACK_IMPORTED_MODULE_2__common__["a" /* copyFile */])(runnerPath + '/index.html', exportFolder + '/index.html');
  // TODO add error message
  var result = void 0;
  try {
    result = Object(__WEBPACK_IMPORTED_MODULE_2__common__["k" /* recursiveParse */])(firstArtboard, __WEBPACK_IMPORTED_MODULE_3__parser__["a" /* default */], parserContext);
  } catch (e) {
    log('parseError: ' + e.message);
    return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('error: ' + e.message);
  }

  Object(__WEBPACK_IMPORTED_MODULE_2__common__["q" /* writeToFile */])(exportFolder + '/config.js', 'sketchBridge({ payload: ' + JSON.stringify(result) + ' })');

  // handle images
  var imageFolder = exportFolder + '/' + __WEBPACK_IMPORTED_MODULE_4__parser_createParserContext__["a" /* IMAGE_FOLDER */];
  Object(__WEBPACK_IMPORTED_MODULE_2__common__["b" /* createFolder */])(imageFolder);
  parserContext.getImgRefs(function (_ref) {
    var id = _ref.id,
        name = _ref.name,
        options = _ref.options;

    Object(__WEBPACK_IMPORTED_MODULE_2__common__["c" /* exportLayer */])(sketch.selectedDocument.layerWithID(id), imageFolder, name, options);
  });

  return __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('done!');
}

function onSelectionChanged(context) {
  Object(__WEBPACK_IMPORTED_MODULE_0__utils_core__["b" /* initWithContext */])(context);
  var currentDocument = context.actionContext.document;
  var selectedLayers = currentDocument.selectedLayers();

  if (!selectedLayers.containsLayers() || selectedLayers.containsMultipleLayers()) {
    return Object(__WEBPACK_IMPORTED_MODULE_2__common__["f" /* hidePanel */])();
  }

  var selectedLayer = selectedLayers.firstLayer();
  var directiveName = Object(__WEBPACK_IMPORTED_MODULE_2__common__["i" /* parseNameAndQuery */])(selectedLayer.name()).name;

  if (directiveName == null) {
    return Object(__WEBPACK_IMPORTED_MODULE_2__common__["f" /* hidePanel */])();
  }

  var command = context.command;
  var lastProps = command.valueForKey_onLayer('props', selectedLayer);
  var finalProps = lastProps == null ? {} : lastProps;

  Object(__WEBPACK_IMPORTED_MODULE_2__common__["o" /* showPanel */])();
  Object(__WEBPACK_IMPORTED_MODULE_2__common__["m" /* sendCommandToPanel */])('showProps', finalProps);
}

// for debug
function testSendAction(context) {
  Object(__WEBPACK_IMPORTED_MODULE_0__utils_core__["b" /* initWithContext */])(context);
  __WEBPACK_IMPORTED_MODULE_1__utils_webview__["sendAction"]('aaa', { value: true });
}

function parseLayer(context) {
  Object(__WEBPACK_IMPORTED_MODULE_0__utils_core__["b" /* initWithContext */])(context);
  var first = void 0;
  context.api().selectedDocument.selectedLayers.iterate(function (layer) {
    if (!first) first = layer;
  });
  var result = NSString.stringWithFormat('%@', JSON.stringify(__WEBPACK_IMPORTED_MODULE_3__parser__["a" /* default */].Group(first)));

  result.writeToFile_atomically(context.document.fileURL().path().replace(/\.sketch$/, '.json'), true);
  __WEBPACK_IMPORTED_MODULE_0__utils_core__["a" /* document */].showMessage('done!');
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperCall = undefined;
exports.default = ObjCClass;

var _runtime = __webpack_require__(9);

exports.SuperCall = _runtime.SuperCall;

// super when returnType is id and args are void
// id objc_msgSendSuper(struct objc_super *super, SEL op, void)

const SuperInit = (0, _runtime.SuperCall)(NSStringFromSelector("init"), [], { type: "@" });

// Returns a real ObjC class. No need to use new.
function ObjCClass(defn) {
  const superclass = defn.superclass || NSObject;
  const className = (defn.className || defn.classname || "ObjCClass") + NSUUID.UUID().UUIDString();
  const reserved = new Set(['className', 'classname', 'superclass']);
  var cls = MOClassDescription.allocateDescriptionForClassWithName_superclass_(className, superclass);
  // Add each handler to the class description
  const ivars = [];
  for (var key in defn) {
    const v = defn[key];
    if (typeof v == 'function' && key !== 'init') {
      var selector = NSSelectorFromString(key);
      cls.addInstanceMethodWithSelector_function_(selector, v);
    } else if (!reserved.has(key)) {
      ivars.push(key);
      cls.addInstanceVariableWithName_typeEncoding(key, "@");
    }
  }

  cls.addInstanceMethodWithSelector_function_(NSSelectorFromString('init'), function () {
    const self = SuperInit.call(this);
    ivars.map(name => {
      Object.defineProperty(self, name, {
        get() {
          return getIvar(self, name);
        },
        set(v) {
          (0, _runtime.object_setInstanceVariable)(self, name, v);
        }
      });
      self[name] = defn[name];
    });
    // If there is a passsed-in init funciton, call it now.
    if (typeof defn.init == 'function') defn.init.call(this);
    return self;
  });

  return cls.registerClass();
};

function getIvar(obj, name) {
  const retPtr = MOPointer.new();
  (0, _runtime.object_getInstanceVariable)(obj, name, retPtr);
  return retPtr.value().retain().autorelease();
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperCall = SuperCall;
exports.CFunc = CFunc;
const objc_super_typeEncoding = '{objc_super="receiver"@"super_class"#}';

// You can store this to call your function. this must be bound to the current instance.
function SuperCall(selector, argTypes, returnType) {
  const func = CFunc("objc_msgSendSuper", [{ type: '^' + objc_super_typeEncoding }, { type: ":" }, ...argTypes], returnType);
  return function (...args) {
    const struct = make_objc_super(this, this.superclass());
    const structPtr = MOPointer.alloc().initWithValue_(struct);
    return func(structPtr, selector, ...args);
  };
}

// Recursively create a MOStruct
function makeStruct(def) {
  if (typeof def !== 'object' || Object.keys(def).length == 0) {
    return def;
  }
  const name = Object.keys(def)[0];
  const values = def[name];

  const structure = MOStruct.structureWithName_memberNames_runtime(name, Object.keys(values), Mocha.sharedRuntime());

  Object.keys(values).map(member => {
    structure[member] = makeStruct(values[member]);
  });

  return structure;
}

function make_objc_super(self, cls) {
  return makeStruct({
    objc_super: {
      receiver: self,
      super_class: cls
    }
  });
}

// Due to particularities of the JS bridge, we can't call into MOBridgeSupport objects directly
// But, we can ask key value coding to do the dirty work for us ;)
function setKeys(o, d) {
  const funcDict = NSMutableDictionary.dictionary();
  funcDict.o = o;
  Object.keys(d).map(k => funcDict.setValue_forKeyPath(d[k], "o." + k));
}

// Use any C function, not just ones with BridgeSupport
function CFunc(name, args, retVal) {
  function makeArgument(a) {
    if (!a) return null;
    const arg = MOBridgeSupportArgument.alloc().init();
    setKeys(arg, {
      type64: a.type
    });
    return arg;
  }
  const func = MOBridgeSupportFunction.alloc().init();
  setKeys(func, {
    name: name,
    arguments: args.map(makeArgument),
    returnValue: makeArgument(retVal)
  });
  return func;
}

/*
@encode(char*) = "*"
@encode(id) = "@"
@encode(Class) = "#"
@encode(void*) = "^v"
@encode(CGRect) = "{CGRect={CGPoint=dd}{CGSize=dd}}"
@encode(SEL) = ":"
*/

function addStructToBridgeSupport(key, structDef) {
  // OK, so this is probably the nastiest hack in this file.
  // We go modify MOBridgeSupportController behind its back and use kvc to add our own definition
  // There isn't another API for this though. So the only other way would be to make a real bridgesupport file.
  const symbols = MOBridgeSupportController.sharedController().valueForKey('symbols');
  if (!symbols) throw Error("Something has changed within bridge support so we can't add our definitions");
  // If someone already added this definition, don't re-register it.
  if (symbols[key] !== null) return;
  const def = MOBridgeSupportStruct.alloc().init();
  setKeys(def, {
    name: key,
    type: structDef.type
  });
  symbols[key] = def;
};

// This assumes the ivar is an object type. Return value is pretty useless.
const object_getInstanceVariable = exports.object_getInstanceVariable = CFunc("object_getInstanceVariable", [{ type: "@" }, { type: '*' }, { type: "^@" }], { type: "^{objc_ivar=}" });
// Again, ivar is of object type
const object_setInstanceVariable = exports.object_setInstanceVariable = CFunc("object_setInstanceVariable", [{ type: "@" }, { type: '*' }, { type: "@" }], { type: "^{objc_ivar=}" });

// We need Mocha to understand what an objc_super is so we can use it as a function argument
addStructToBridgeSupport('objc_super', { type: objc_super_typeEncoding });

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = open;
/* harmony export (immutable) */ __webpack_exports__["a"] = findWebView;
/* harmony export (immutable) */ __webpack_exports__["c"] = sendAction;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webview__ = __webpack_require__(2);


function open(identifier) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'index.html';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Sensible defaults for options
  var _options$width = options.width,
      width = _options$width === undefined ? 800 : _options$width,
      _options$height = options.height,
      height = _options$height === undefined ? 350 : _options$height,
      _options$title = options.title,
      title = _options$title === undefined ? 'Sketch Plugin Boilerplate' : _options$title;


  var frame = NSMakeRect(0, 0, width, height);
  var masks = NSTitledWindowMask | NSWindowStyleMaskClosable | NSResizableWindowMask;
  var window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, masks, NSBackingStoreBuffered, false);
  window.setMinSize({ width: 200, height: 200 });

  // We use this dictionary to have a persistant storage of our NSWindow/NSPanel instance
  // Otherwise the instance is stored nowhere and gets release => Window closes
  var threadDictionary = NSThread.mainThread().threadDictionary();
  threadDictionary[identifier] = window;

  var webView = Object(__WEBPACK_IMPORTED_MODULE_0__webview__["a" /* createWebView */])(path, frame);

  window.title = title;
  window.center();
  window.contentView().addSubview(webView);

  window.makeKeyAndOrderFront(null);
}

function findWebView(identifier) {
  var threadDictionary = NSThread.mainThread().threadDictionary();
  var window = threadDictionary[identifier];
  return window && window.contentView().subviews()[0];
}

function sendAction(identifier, name) {
  var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return Object(__WEBPACK_IMPORTED_MODULE_0__webview__["b" /* sendAction */])(findWebView(identifier), name, payload);
}

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export toggle */
/* unused harmony export open */
/* harmony export (immutable) */ __webpack_exports__["c"] = show;
/* unused harmony export close */
/* unused harmony export isOpen */
/* unused harmony export findWebView */
/* harmony export (immutable) */ __webpack_exports__["b"] = sendAction;
/* harmony export (immutable) */ __webpack_exports__["a"] = hide;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__formatter__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__webview__ = __webpack_require__(2);





function toggle(identifier, path, width) {
  if (isOpen(identifier)) {
    close(identifier);
  } else {
    open(identifier, path, width);
  }
}

function open(identifier) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'index.html';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var width = options.width;

  var frame = NSMakeRect(0, 0, width || 250, 600); // the height doesn't really matter here
  var contentView = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* document */].documentWindow().contentView();
  if (!contentView || isOpen()) {
    return false;
  }

  var stageView = contentView.subviews().objectAtIndex(0);
  var webView = Object(__WEBPACK_IMPORTED_MODULE_2__webview__["a" /* createWebView */])(path, frame);
  webView.identifier = identifier;

  // Inject our webview into the right spot in the subview list
  var views = stageView.subviews();
  var finalViews = [];
  var pushedWebView = false;
  for (var i = 0; i < views.count(); i++) {
    var view = views.objectAtIndex(i);
    finalViews.push(view);
    // NOTE: change the view identifier here if you want to add
    //  your panel anywhere else
    if (!pushedWebView && view.identifier() == 'view_canvas') {
      finalViews.push(webView);
      pushedWebView = true;
    }
  }
  // If it hasn't been pushed yet, push our web view
  // E.g. when inspector is not activated etc.
  if (!pushedWebView) {
    finalViews.push(webView);
  }
  // Finally, update the subviews prop and refresh
  stageView.subviews = finalViews;
  stageView.adjustSubviews();
}

function show(identifier) {
  var viewToShow = findWebView(identifier);

  if (viewToShow == undefined) {
    return open(identifier);
  }

  var contentView = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* document */].documentWindow().contentView();
  if (!contentView) {
    return false;
  }
  var stageView = contentView.subviews().objectAtIndex(0);

  viewToShow.hidden = false;
  stageView.adjustSubviews();
}

function close(identifier) {
  var contentView = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* document */].documentWindow().contentView();
  if (!contentView) {
    return false;
  }

  var stageView = contentView.subviews().objectAtIndex(0);
  stageView.subviews = Object(__WEBPACK_IMPORTED_MODULE_1__formatter__["a" /* toArray */])(stageView.subviews()).filter(function (view) {
    return view.identifier() != identifier;
  });
  stageView.adjustSubviews();
}

function isOpen(identifier) {
  return !!findWebView(identifier);
}

function findWebView(identifier) {
  var contentView = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* document */].documentWindow().contentView();
  if (!contentView) {
    return false;
  }
  var splitView = contentView.subviews().objectAtIndex(0);
  var views = Object(__WEBPACK_IMPORTED_MODULE_1__formatter__["a" /* toArray */])(splitView.subviews());
  return views.find(function (view) {
    return view.identifier() == identifier;
  });
}

function sendAction(identifier, name) {
  var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return Object(__WEBPACK_IMPORTED_MODULE_2__webview__["b" /* sendAction */])(findWebView(identifier), name, payload);
}

function hide(identifier) {
  var contentView = __WEBPACK_IMPORTED_MODULE_0__core__["a" /* document */].documentWindow().contentView();
  if (!contentView) {
    return false;
  }
  // Search for web view panel
  var stageView = contentView.subviews().objectAtIndex(0);
  var viewToHide = findWebView(identifier);

  if (viewToHide == undefined) return;

  viewToHide.hidden = true;
  stageView.adjustSubviews();
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toArray;
function toArray(object) {
  if (Array.isArray(object)) {
    return object;
  }
  var arr = [];
  for (var j = 0; j < object.count(); j++) {
    arr.push(object.objectAtIndex(j));
  }
  return arr;
}

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__A__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Button__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Case__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Group__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Unknown__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Ignore__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Img__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Input__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Text__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Textarea__ = __webpack_require__(23);












/* harmony default export */ __webpack_exports__["a"] = ({
  A: __WEBPACK_IMPORTED_MODULE_0__A__["a" /* default */],
  Button: __WEBPACK_IMPORTED_MODULE_1__Button__["a" /* default */],
  Case: __WEBPACK_IMPORTED_MODULE_3__Case__["a" /* default */],
  Group: __WEBPACK_IMPORTED_MODULE_4__Group__["a" /* default */],
  App: __WEBPACK_IMPORTED_MODULE_2__App__["a" /* default */],
  Unknown: __WEBPACK_IMPORTED_MODULE_5__Unknown__["a" /* default */],
  Ignore: __WEBPACK_IMPORTED_MODULE_6__Ignore__["a" /* default */],
  Img: __WEBPACK_IMPORTED_MODULE_7__Img__["a" /* default */],
  Input: __WEBPACK_IMPORTED_MODULE_8__Input__["a" /* default */],
  Text: __WEBPACK_IMPORTED_MODULE_9__Text__["a" /* default */],
  Textarea: __WEBPACK_IMPORTED_MODULE_10__Textarea__["a" /* default */]
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = A;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Text__ = __webpack_require__(5);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };




function A(layer, context) {
  var node = layer.isText ? _extends({}, Object(__WEBPACK_IMPORTED_MODULE_1__Text__["a" /* default */])(layer, context)[0], { type: 'A' }) : {
    type: 'A',
    state: {
      style: Object(__WEBPACK_IMPORTED_MODULE_0__common__["c" /* extractPositionStyle */])(layer)
    }
  };

  var next = layer.isText ? [] : Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* iteratorToArray */])(layer);

  return [node, next];
}

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Button;
function Button() {}

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = App;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Group__ = __webpack_require__(6);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();



function App() {
  var _Group = __WEBPACK_IMPORTED_MODULE_0__Group__["a" /* default */].apply(undefined, arguments),
      _Group2 = _slicedToArray(_Group, 2),
      result = _Group2[0],
      next = _Group2[1];

  return [Object.assign(result, {
    type: 'App'
  }), next];
}

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getDefaultState;
/* unused harmony export render */
// import { createElement } from 'react'

function getDefaultState() {
  return {
    style: {},
    center: false
  };
}

function render(_ref) {
  // const style = {
  //   ...state.style
  // }
  //
  // if (state.center) {
  //   Object.assign(style, {
  //     position: 'relative',
  //     marginLeft: 'auto',
  //     marginRight: 'auto'
  //   })
  // }
  // return <div style={style}>{children}</div>

  var state = _ref.state,
      children = _ref.children;
}

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Case;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);


function Case(layer) {
  var node = {
    type: 'Case',
    state: {
      style: Object(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* extractBoxRelatedStyle */])(layer)
    }
  };
  var next = [];
  layer.iterate(function (sub) {
    next.push(sub);
  });

  return [node, next];
}

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Unknown;
function Unknown(layer) {
  return [{
    type: 'Unknown',
    state: {
      originName: String(layer.name)
    }
  }, []];
}

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Ignore;
function Ignore() {
  return [{
    type: 'Ignore'
  }, []];
}

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Img;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);


function Img(layer, _ref) {
  var createImgRef = _ref.createImgRef;

  return [{
    type: 'Img',
    state: {
      src: createImgRef(layer),
      style: Object(__WEBPACK_IMPORTED_MODULE_0__common__["a" /* extractBoxRelatedStyle */])(layer)
    }
  }, []];
}

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Input;
function Input() {}

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Textarea;
function Textarea() {}

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IMAGE_FOLDER; });
/* harmony export (immutable) */ __webpack_exports__["b"] = createParserContext;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__(3);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };




function makeResourcePath(id, name) {
  var idStr = String(id);
  return '' + new Array(4 - idStr.length).fill('0').join('') + idStr + '_' + name;
}

var IMAGE_FOLDER = 'image';

function createParserContext() {
  var imageRefs = [];
  var imgSrcId = 0;
  var imgNameId = 0;

  function generateName() {
    imgNameId += 1;
    return String(imgNameId);
  }

  return {
    createImgRef: function createImgRef(layer) {
      // TODO 生成真实的图片并且做重名检测
      var options = _extends({
        scales: '2',
        formats: 'png'
      }, Object(__WEBPACK_IMPORTED_MODULE_1__common__["i" /* parseNameAndQuery */])(layer.name).query);
      if (options.formats === 'base64') return Object(__WEBPACK_IMPORTED_MODULE_0__common__["e" /* layerToBase64 */])(layer);
      imgSrcId += 1;
      var name = makeResourcePath(imgSrcId, Object(__WEBPACK_IMPORTED_MODULE_1__common__["j" /* parseRawName */])(layer.name) || generateName());
      imageRefs.push({ id: layer.id, name: name, options: options });
      log('get iamge name ' + name);
      log('returing image ref: ' + IMAGE_FOLDER + '/' + name + '.' + options.formats);
      return IMAGE_FOLDER + '/' + name + '.' + options.formats;
    },
    getImgRefs: function getImgRefs(handler) {
      imageRefs.forEach(handler);
    }
  };
}

/***/ })
/******/ ]);

var openRunner = handlers.openRunner;

var onSelectionChanged = handlers.onSelectionChanged;

var exportCurrentLayer = handlers.exportCurrentLayer;

var sendDataToRunner = handlers.sendDataToRunner;

var undefined = handlers.undefined;