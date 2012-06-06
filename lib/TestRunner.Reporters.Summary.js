
(function(Global, undefined) {
	
	if (Global.TestRunner) {
		Global.TestRunner.Reporters.Summary = function() {
			function Reporter() {};
			
			Reporter.prototype = Global.TestRunner.Reporters.Summary.prototype;

			return new Reporter();
		}
		
		Global.TestRunner.Reporters.Summary.prototype = {
			generate: function(report) {
				var consoleMsg = '';

				consoleMsg += '\n';
				consoleMsg += '========================================\n';
				consoleMsg += '\n';

				if (report.failed > 0) {
					consoleMsg += ' JSTest : Error: JS0001 : The following tests failed \n';
					consoleMsg += '\n';
					consoleMsg += '----------------------------------------\n';
					consoleMsg += '\n';
				}

				for (var moduleName in report.modules) {					
					for (var testName in report.modules[moduleName].tests) {						
						if (report.modules[moduleName].tests[testName].failed > 0) {
							consoleMsg += ' FAIL - ' + moduleName + ' : ' + testName + '\n';
						}
					};
				};
					
				if (report.failed > 0) {
					consoleMsg += '\n';
					consoleMsg += '----------------------------------------\n';
					consoleMsg += '\n';
				}

				consoleMsg += ' PASS: ' + report.passed + '  FAIL: ' + report.failed + '  TOTAL: ' + report.total + '\n';
				consoleMsg += ' Finished in ' + report.runtime + ' milliseconds.\n';
				consoleMsg += '\n';

				consoleMsg += '========================================\n';
				consoleMsg += '\n';
				consoleMsg += '\n';

				console.log( consoleMsg );
			}
		};
	}

})(this, undefined);