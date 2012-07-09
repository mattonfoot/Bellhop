
(function(Global, undefined) {

	var consoleReporter = './CoverageRunner.Reporter.js';
	var screenshotFormat = '.coverage.pdf';
	var suiteCleaningRegEx = /\.(test|spec|qunit|jasmine)\.htm/ig;

	var blankreport = { };

	Global.CoverageRunner = function(outputfolder, runners) {
		function F() {
			this.outputfolder = outputfolder;
			this.runners = runners;
			this.currentRunnerIndex = -1;

			this.onComplete = function(status, report) {};

			this.report = blankreport;

			this.status;
		};

		F.prototype = Global.CoverageRunner.prototype;

		return new F();
	};

	Global.CoverageRunner.Reporters = { };

	Global.CoverageRunner.prototype = {

		process: function() {
			this.currentRunnerIndex++;

			var nextRunner = getNextRunner(this.currentRunnerIndex, this.runners);

			if (nextRunner !== null) {
				this.run(nextRunner);
				return;
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
					logConsoleOutput( 'CoverageRunner is unable to load: ' + runner );

					self.process();

				} else {
					fixture.injectJs(consoleReporter);

					function testState() {
						return fixture.evaluate(function(){
							return Reporter.done;
						});
					};

					function onReady() {
						aggregateTestResults(self.report, suiteName, getFixtureResults(fixture));

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
			return Reporter.results;
		});
	};

	function aggregateTestResults(report, suiteName, results) {
		for (var file in results) {
			report[file] = report[file] || {};

			report[file].file = results[file].file
			report[file].source = results[file].source;

			for (var line in results[file].coverage) {
				report[file].coverage = report[file].coverage || {};

				report[file].coverage[line] = (report[file].coverage[line] || 0) + results[file].coverage[line];
			};
		};
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
					logConsoleOutput("'CoverageRunner.waitFor()' timeout");
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

})(this, undefined);