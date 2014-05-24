// --------------------------------------------------------------------------
// Miscellaneous Sketch utilities.
//
//  Copyright 2014 Sam Deane, Elegant Chaos. All rights reserved.
//  This source code is distributed under the terms of Elegant Chaos's
//  liberal license: http://www.elegantchaos.com/license/liberal
// --------------------------------------------------------------------------

var com = com || {};

com.elegantchaos = (function() {
	var my = {};

	// it's helpful to have somewhere to store values in a way that will persist across invocations of
	// the script, so you can store something on one run, and pick it up again on the next
	// as luck would have it, there's a dictionary associated with each thread, so we can use the main thread's
	// dictionary to keep out persistent values in
	var persistent = [[NSThread mainThread] threadDictionary];

	// an example of something we might want to persist is the contents of the console
	var console = persistent["console"];

	// perform a come code inside a try/catch block, and log out the error if something goes wrong
	my.execute = function(block) {
		try
		{
			block();
		}
		catch (e)
		{
			my.log(e);
		}
	}

	// export the first slice from a doc, as a given kind
	my.export = function(document, kind){
		var slices = [[document currentPage] allSlices];
		if ([slices count] > 0) {
			var slice = slices[0];
			var file_url = [document fileURL];
			var file_name = [[file_url URLByDeletingPathExtension] lastPathComponent];
			var export_folder = [[[file_url URLByDeletingLastPathComponent] URLByDeletingLastPathComponent] URLByAppendingPathComponent:"Exported"]
			var export_url = [[export_folder URLByAppendingPathComponent:file_name] URLByAppendingPathExtension:kind];
			var export_path = [export_url path];
			[document saveArtboardOrSlice:slice toFile:export_path];
			my.log("Exported " + export_path);
		} else {
			my.log("No slices");
		}
	};

	// return the Sketch version number
	// (we fish this out of the main info dictionary for the application)
	my.version = function() {
		var items = my.versionComponents();

		var result = items[0] + "." + items[1];
		if (items[2] != 0)
			result += "." + items[2];

		return result;
	}

	// return the Sketch version number, split into three components
	// (we fish this out of the main info dictionary for the application)
	my.versionComponents = function() {
		var info = [[NSBundle mainBundle] infoDictionary];
		var items = [[(info["CFBundleShortVersionString"]) componentsSeparatedByString:"."] mutableCopy];

		while(items.length() < 3)
			[items addObject:"0"];

		return items;
	}

	// return the main Sketch version number (eg 2 in 2.4.3)
	my.majorVersion = function() {
		var items = my.versionComponents();

		return items[0];
	}

	// return the minor Sketch version number (eg 4 in 2.4.3)
	my.minorVersion = function() {
		var items = my.versionComponents();

		return items[1];
	}

	// return the fix Sketch version number (eg 3 in 2.4.3)
	my.fixVersion = function() {
		var items = my.versionComponents();

		return items[2];
	}

	// return the exact Sketch build number
  // (we fish this out of the main info dictionary for the application)
	my.buildNumber = function() {
		var info = [[NSBundle mainBundle] infoDictionary];
		var result = info["CFBundleVersion"];

		return result;
	}

	// perform an action (in the way that a menu or button typically does)
	// what we're doing here is sending a command (an Objective-C method call)
	// down a chain of objects (the current window,
	// the current document, the application, etc) until one responds
	my.sendAction = function(commandToPerform) {
		try {
			[NSApp sendAction:commandToPerform to:nil from:doc]
		} catch(e) {
			my.log(e)
		}
	};

	// safe implementation of selection, which checks for it being nil
	// (which it can be before the user first selected anything)
	my.selection = function() {
		var selection = doc.selectedLayers();
		if (selection == null) {
			selection = [[NSArray alloc] init]
		}

		return selection;
	};

	// return a persistent window
	// this will make the window the first time it's called, but return the
	// same window next time (even if the next time is during a later execution of the script)
	my.persistentWindow = function(title, persistName, level, setup) {
		var window = persistent[persistName];
		if (window == null) {
			window = my.makeWindow(title, persistName, level, setup);
			persistent[persistName] = window;
		}

		return window;
	}

	// return a persistent panel
	// this will make the window the first time it's called, but return the
	// same window next time (even if the next time is during a later execution of the script)
	my.persistentPanel = function(title, persistName, setup) {
		var window = persistent[persistName];
		if (window == null) {
			window = my.makePanel(title, persistName, setup);
			persistent[persistName] = window;
		}

		return window;
	}

	// make a new window
	// this uses native Cocoa code to create a new window object, and set up various properties on it
	// for more details on NSWindow, see https://developer.apple.com/library/mac/documentation/cocoa/reference/applicationkit/classes/NSWindow_Class/Reference/Reference.html
	my.makeWindow = function(title, autosave, level, setup) {
		var frame = NSMakeRect(0,0,512,128);
		var mask = NSTitledWindowMask + NSClosableWindowMask + NSMiniaturizableWindowMask + NSResizableWindowMask;
		var window = [[NSWindow alloc] initWithContentRect:frame styleMask:mask backing:NSBackingStoreBuffered defer:true];
		window.title = title;
		window.level = level;
		[window setFrameAutosaveName:autosave];

		setup(window);

		[window setReleasedWhenClosed:false];
		[window makeKeyAndOrderFront:nil];

		return window;
	}

	// make a new panel
	// this uses native Cocoa code to create a new panel object, and set up various properties on it
	// for more details on NSPanel, see https://developer.apple.com/library/mac/documentation/Cocoa/Reference/ApplicationKit/Classes/NSPanel_Class/Reference/Reference.html
	my.makePanel = function(title, autosave, setup) {
		var frame = NSMakeRect(0,0,512,128);
		var mask = NSTitledWindowMask + NSClosableWindowMask + NSMiniaturizableWindowMask + NSResizableWindowMask + NSUtilityWindowMask;
		var window = [[NSPanel alloc] initWithContentRect:frame styleMask:mask backing:NSBackingStoreBuffered defer:true];
		window.title = title;
		window.floatingPanel = true;
		[window setFrameAutosaveName:autosave];

		setup(window);

		[window setReleasedWhenClosed:false];
		[window makeKeyAndOrderFront:nil];

		return window;
	}

	// make a new log window
	// we use Cocoa here to create a native window, and then we create a scrollview+textview combination
	// as the context, which gives us a scrolling text field
	// as luck would have it, Apple have some documentation describing this process:
	// https://developer.apple.com/library/mac/documentation/cocoa/conceptual/TextUILayer/Tasks/TextInScrollView.html#//apple_ref/doc/uid/20000938-CJBBIAAF
	my.logWindow = function() {
		var window = my.persistentPanel("Console", "LogWindow", function(window) {
			var scrollview = [[NSScrollView alloc] initWithFrame:[[window contentView] frame]];
			var contentSize = [scrollview contentSize];

			[scrollview setBorderType:NSNoBorder];
			[scrollview setHasVerticalScroller:true];
			[scrollview setHasHorizontalScroller:true];
			[scrollview setAutoresizingMask:NSViewWidthSizable | NSViewHeightSizable];

			var FLT_MAX = 3.40282347e+38;
			var view = [[NSTextView alloc] initWithFrame:NSMakeRect(0, 0, contentSize.width, contentSize.height)];
			[view setMinSize:NSMakeSize(0.0, contentSize.height)];
			[view setMaxSize:NSMakeSize(FLT_MAX, FLT_MAX)];
			[view setVerticallyResizable:true];
			[view setHorizontallyResizable:true];
			[view setAutoresizingMask:NSViewWidthSizable | NSViewHeightSizable];
			[[view textContainer] setContainerSize:NSMakeSize(FLT_MAX, FLT_MAX)];
			[[view textContainer] setWidthTracksTextView:false];

			[scrollview setDocumentView:view];
			[window setContentView:scrollview];
			[window makeFirstResponder:view];
		});

		return window;
	};

	// log something to our console window
	// we set the window up first if necessary, then
	// append the log message to the bottom of it and scroll the new line into view
	my.log = function(message) {
		var logWindow = my.logWindow();
		[logWindow makeKeyAndOrderFront:nil];

		var text = message;
		//var text = JSON.stringify(message);

		view = [[logWindow contentView] documentView];
		if (console == null)
			console = "";

		var now = new Date();
		var time = now.toLocaleTimeString().split(" ")[0];
		console = console + time + " " + text + "\n";
		[view setString:console];
		log(text);
		persistent["console"] = console;
		[view scrollRangeToVisible: NSMakeRange(view.string.length, 0)];

	};

	my.launch = function(cmd, arguments) {
	    var task = [[NSTask alloc] init];
	    [task setLaunchPath:cmd];

		if (arguments)
			[task setArguments:arguments];
  
	    var pipe = [NSPipe pipe];
	    [task setStandardOutput: pipe];
  
	    var file = [pipe fileHandleForReading];
		
	    [task launch];

	    var data = [file readDataToEndOfFile];
	    var output = [[NSString alloc] initWithData: data encoding:NSUTF8StringEncoding];

	    log(output);  
	};
	
	return my;
}());
