//Global Logger Object, for use during development, configurable logger.
var SmartLogger = function(options) {

	var sl = {}; // Logger Object

	// Accepting passed params.
	options = options || {};
	sl.enableLogger = options.enableLogger !== undefined ? options.enableLogger
	        : true;
	sl.enableAssert = options.enableAssert !== undefined ? options.enableAssert
	        : true;
	sl.loggerOutput = options.loggerOutput !== undefined ? options.loggerOutput
	        : undefined; // 'console', 'alert', undefined
	sl.selectiveEnable = options.selectiveEnable !== undefined ? options.selectiveEnable
	        : '';
	sl.selectiveDisable = options.selectiveDisable !== undefined ? options.selectiveDisable
	        : '';

	// Logger properties
	sl.name = "SmartLogger";
	sl.whoami = function() {
		return "SmartLogger_" + sl.enableLogger + "_" + sl.enableAssert + "_"
		        + sl.loggerOutput + "_" + sl.selectiveEnable + "_"
		        + sl.selectiveDisable;
	}
	sl.version = '0.7';

	// Checks if console object is defined. Checked only at the time of
	// instantiation.
	var hasConsole = (typeof console === "object");

	// Checks if logging should be done to console.
	function logToConsole() {
		if (sl.loggerOutput) {
			if (sl.loggerOutput === 'console')
				return true;
		} else {
			if (hasConsole)
				return true;
		}
		return false;
	}

	// Handles the logging intelligence
	function handleLogging(logMethod, logString, strId) {
		if (!sLog(strId)) {
			return;
		}
		// Decides if to log and logs or alerts appropriately.
		if (sl.enableLogger) {
			if (logToConsole()) { // && hasConsole
				if (hasConsole)
					console[logMethod](logString);
			} else {
				alert(logString);
			}
		}
	}
	;

	// Handles the selective logging functionality
	function sLog(strId) {
		var allowLog = true;
		if (sl.selectiveEnable) {
			allowLog = strId === sl.selectiveEnable;
		} else if (sl.selectiveDisable) {
			allowLog = !(strId === sl.selectiveDisable);
		}

		return allowLog;
	}
	;

	// Returns a formatted object structure with current values to complete
	// depth.
	function printString(obj, name, str, strEnd) {
		var stringified;
		name = name ? name : "Object", str = str ? str : "";
		strEnd = strEnd ? strEnd : "";
		stringified = str + name + " : {\n";
		for ( var a in obj) {
			if (typeof obj[a] === 'object') {
				stringified += printString(obj[a], a, "\t", ",");
			} else {
				stringified += str + "\t" + a + " : " + obj[a] + ",\n";
			}
		}
		stringified += str + "}" + strEnd + "\n";
		return stringified;
	}
	;

	// Exposed methods of the object
	// log a string to console/alert
	sl.log = function(str, strId) {
		handleLogging('log', str, strId);
	};

	// debug logging a string to console/alert
	sl.debug = function(str, strId) {
		handleLogging('debug', str, strId);
	};

	// write an information string to console/alert
	sl.info = function(str, strId) {
		handleLogging('info', str, strId);
	};

	// throw error string to console/alert
	sl.error = function(str, strId) {
		handleLogging('error', str, strId);
	};

	// Assert an assumption
	sl.assert = function(str, strId) {
		if (sl.enableAssert) {
			handleLogging('log', 'Assumption: ' + str, strId);
			if (!str) {
				handleLogging('error', 'Assumption failed: ' + str, strId);
				debugger;
			}
		}
	};

	// Logs the formatted object structure with current values to console/alert
	sl.stringToConsole = function(obj, str) {
		sl.log(printString(obj, str));
	};

	sl.profile = function(profileId, strId) {
		if (sLog(strId)
		        && sl.enableLogger
		        && ((sl.loggerOutput) ? sl.loggerOutput === 'console'
		                && typeof console === "object"
		                : typeof console === "object")) {
			console.profile(profileId);
		}
		;
	};

	sl.profileEnd = function(strId) {
		if (sLog(strId)
		        && sl.enableLogger
		        && ((sl.loggerOutput) ? sl.loggerOutput === 'console'
		                && typeof console === "object"
		                : typeof console === "object")) {
			console.profileEnd();
		}
		;
	};

	return sl;
};

var sl = new SmartLogger();
