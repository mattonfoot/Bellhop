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
		for (module in modules) {
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
		for (module in modules) {
			startSpecificModule(module);
		}
	}
	
	function startSpecificModule(moduleName) {
		if (!running[moduleName] && modules[moduleName]) {			
			running[moduleName] = modules[moduleName];

			if (modules[moduleName].start) {
				running[moduleName].start.call({}, sandbox);
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
		for (module in modules) {
			stopSpecificModule(module);
		}
	}
	
	function stopSpecificModule(moduleName) {
		if (running[moduleName]) {
			if (running[moduleName].stop) {
				running[moduleName].stop.call({}, sandbox);
			}
			
			delete running[moduleName];
		}
	}
	
	function getSpecificModule(moduleName) {
		return modules[moduleName];
	}
	
	function extendSandbox(scope) {
		for (feature in scope) {
			if (!sandbox[feature]) { 
				sandbox[feature] = scope[feature];
			}
		}
	}
	
	var Application = function() {};
	
	function createNewApplication() {
		return new Application();
	}

	// exports

	Application.prototype = {			
		register: registerModule,		
		unregister: unregisterModule,		
		module: getSpecificModule,		
		extend: extendSandbox,		
		start: startModule,		
		stop: stopModule
	};
	
	return new Application();
	
})(this, this.document, undefined);