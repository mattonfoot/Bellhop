
(function(Global, undefined) {

	var consoleReporter = './phantomjs-reporter.js';
	var screenshotFormat = '.results.pdf';
	var suiteCleaningRegEx = /\.(test|spec)\.htm/ig;

	var blankreport = {
		modules: {},
		failed: 0,
		passed: 0,
		total: 0,
		runtime: 0
	};

	Global.TestRunner = function(outputfolder, runners) {
		function F() {
			this.outputfolder = outputfolder;
			this.runners = runners;
			this.currentRunnerIndex = -1;

			this.onComplete = function(status, report) {};

			this.report = blankreport;

			this.status;
		};

		F.prototype = Global.TestRunner.prototype;

		return new F();
	};

	Global.TestRunner.Reporters = { };

	Global.TestRunner.prototype = {

		process: function() {
			this.currentRunnerIndex++;

			var nextRunner = getNextRunner(this.currentRunnerIndex, this.runners);

			if (nextRunner !== null) {
				this.run(nextRunner);
				return;
			}

			if (this.report.failed > 0) {
				this.status = 1;
			}

			this.onComplete.call(this, this.status, this.report);
		},

		error: function() {
			this.status = 1;

			this.onError.call(this);
		},

		run: function(runner) {
			var self = this,
				suiteName = getSuiteName(runner),
				fixture = require('webpage').create();

			fixture.onConsoleMessage = logConsoleOutput;

			fixture.onError = logFixtureError;

			fixture.viewportSize = { width: 1024, height: 768 };

			fixture.open(runner, function(status) {
				if (status !== 'success') {
					logConsoleOutput( 'TestRunner is unable to load: ' + runner );

					self.process();

				} else {
					fixture.injectJs(consoleReporter);

					function testState() {
						return fixture.evaluate(function(){
							return PhantomJSReporter.done;
						});
					};

					function onReady() {
						aggregateTestResults(self.report, suiteName, getFixtureResults(fixture));

						fixture.render(screenshotOutputFilename(self.outputfolder, suiteName));

						self.process();
					};

					function onTimeout() {
						self.error();
					};

					waitFor(testState, onReady, onTimeout, 5001);
				}
			});
		}

	};

	function getFixtureResults(fixture) {
		return fixture.evaluate(function() {
			return {
				modules: PhantomJSReporter.results.modules,
				failed: PhantomJSReporter.results.failed,
				passed: PhantomJSReporter.results.passed,
				total: PhantomJSReporter.results.total,
				runtime: PhantomJSReporter.results.runtime
			};
		});
	};

	function aggregateTestResults(report, suiteName, results) {
		for (module in results.modules) {
			report.modules[module] = results.modules[module];
			report.modules[module].suite = suiteName;
		};

		report.failed += results.failed;
		report.passed += results.passed;
		report.total += results.total;
		report.runtime += results.runtime;
	};

	function screenshotOutputFilename(outputfolder, suiteName) {
		return outputfolder +'/'+ removeInvalidFileChars(suiteName) + screenshotFormat;
	};

	function getSuiteName(runner) {
		return runner.substr(runner.lastIndexOf('/') + 1).replace(suiteCleaningRegEx, '');
	};

	function getNextRunner(runnerIndex, runners) {
		return ( runnerIndex < runners.length ) ? runners[runnerIndex] : null;
	};

	function waitFor(testFx, onReady, onTimeout, timeOutMillis) {
		var runStatus = false;
		var start = new Date().getTime();

		function hasTimedOut() {
			return (new Date().getTime() - start < timeOutMillis);
		}

		var interval = setInterval(function() {
			if ( hasTimedOut() && !runStatus ) {
			  runStatus = testFx();

			} else {
				clearInterval(interval);

				if ( !runStatus ) {
					logConsoleOutput("'TestRunner.waitFor()' timeout");
					onTimeout();
					return;
				}

				onReady();
			}
		}, 100);
	};

	function logFixtureError(msg, trace) {
		console.log('Fixture caused an Error: ' + msg);

		trace.forEach(function(item) {
			console.log('  ', item.file, ':', item.line);
		});
	};

	function logConsoleOutput(msg) {
		console.log(msg);
	};

	function removeInvalidFileChars(str) {
		return str.replace(/\s/g, "-")
					.replace(/\\/g, "")
					.replace(/\//g, "")
					.replace(/:/g, "")
					.replace(/\*/g, "")
					.replace(/\?/g, "")
					.replace(/\"/g, "")
					.replace(/\'/g, "")
					.replace(/</g, "")
					.replace(/\>/g, "")
					.replace(/\|/g, "");
	};

})(this, undefined);