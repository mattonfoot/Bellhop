app = (function(Global, document, undefined) {
	var modules = {};
	var running = {};
	var sandbox = {};

	function registerModule(moduleName, module) {
		if (module && !modules[moduleName]) {
			modules[moduleName] = module;
		}
	}

	function unregisterModule(moduleName) {
		if (!moduleName) {
			return unregisterAllModules();
		}

		unregisterSpecificModule(moduleName);
	}

	function unregisterAllModules() {
		for (var module in modules) {
			unregisterSpecificModule(module);
		}
	}

	function unregisterSpecificModule(moduleName) {
		if (modules[moduleName]) {
			stopSpecificModule(moduleName);

			delete modules[moduleName];
		}
	}

	function startModule(moduleName) {
		if (!moduleName) {
			return startAllModules();
		}

		startSpecificModule(moduleName);
	}

	function startAllModules() {
		for (var module in modules) {
			startSpecificModule(module);
		}
	}

	function startSpecificModule(moduleName) {
		if (!running[moduleName] && modules[moduleName]) {
			running[moduleName] = modules[moduleName];

			running[moduleName] = running[moduleName].call({}, sandbox) || modules[moduleName];

			if (running[moduleName].domready && sandbox.mq) {
				sandbox.mq.subscribe('domready', running[moduleName].domready);
			}

			if (running[moduleName].start) {
				running[moduleName].start();
			}
		}
	}

	function stopModule(moduleName) {
		if (!moduleName) {
			return stopAllModules();
		}

		stopSpecificModule(moduleName);
	}

	function stopAllModules() {
		for (var module in modules) {
			stopSpecificModule(module);
		}
	}

	function stopSpecificModule(moduleName) {
		if (running[moduleName]) {
			if (running[moduleName].stop) {
				running[moduleName].stop();
			}

			delete running[moduleName];
		}
	}

	function getSpecificModule(moduleName) {
		return {
			module: modules[moduleName],
			instance: running[moduleName]
		};
	}

	function extendSandbox(feature, extensions) {
		if (sandbox[feature]) {
			throw 'Sandbox extension already defined';
		}

		sandbox[feature] = extensions;
	}

	var Application = function() {};
	/*
	function createNewApplication() {
		return new Application();
	}
	*/

	// exports

	Application.prototype = {
		sandbox: sandbox,
		register: registerModule,
		unregister: unregisterModule,
		module: getSpecificModule,
		extend: extendSandbox,
		start: startModule,
		stop: stopModule
	};

	return new Application();

})(this, this.document, undefined);