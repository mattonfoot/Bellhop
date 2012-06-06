
(function(Global, undefined) {
	
	if (Global.TestRunner) {
		Global.TestRunner.Reporters.Verbose = function() {
			function Reporter() {};
			
			Reporter.prototype = Global.TestRunner.Reporters.Verbose.prototype;

			return new Reporter();
		}
		
		Global.TestRunner.Reporters.Verbose.prototype = {
			generate: function(report) {			
				var consoleMsg = '';
				var moduleCount = 0;
				
				for (var moduleName in report.modules) {
					moduleCount++;
						
					if (moduleCount == 1) {
						consoleMsg += '\n';
						consoleMsg += ' >> ' + report.modules[moduleName].suite + '\n';
						consoleMsg += '\n';
					}
					
					for (var testName in report.modules[moduleName].tests) {
						
						if (report.modules[moduleName].tests[testName].failed > 0) {
							consoleMsg += ' FAIL - ' + moduleName + ' : ' + testName + '\n';
						} else {
							consoleMsg += ' PASS - ' + moduleName + ' : ' + testName + '\n';
						}
					};
				};

				consoleMsg += '\n';
				consoleMsg += ' PASS: ' + report.passed + '  FAIL: ' + report.failed + '  TOTAL: ' + report.total + '\n';
				consoleMsg += ' Finished in ' + report.runtime + ' milliseconds.\n';

				console.log( consoleMsg );
			}
		};
	}

})(this, undefined);