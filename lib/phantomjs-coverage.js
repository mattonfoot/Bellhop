
(function(Global, undefined) {

var outputfolder, testscripts = [];

if (phantom.args.length < 2) {
    console.log('Usage: phantomjs-runner.js OUTPUTFOLDER FIXTURE [, FIXTURE, ...]');

	phantom.exit();
} else {
    phantom.args.forEach(function (arg, i) {
		if (i == 0) {
			outputfolder = arg;
			return;
		}

		testscripts.push(arg);
    });
}

	phantom.injectJs('TestRunner.js');

	phantom.injectJs('TestRunner.Reporters.Verbose.js');
	phantom.injectJs('TestRunner.Reporters.Summary.js');
	phantom.injectJs('TestRunner.Reporters.JUnit.js');

	var testrunner = Global.TestRunner(outputfolder, testscripts);

	testrunner.onComplete = function(status, report) {
		for (var reporter in Global.TestRunner.Reporters) {
			Global.TestRunner.Reporters[reporter](outputfolder).generate(report);
		}

		phantom.exit(status);
	};

	testrunner.onError = function(status) {
		phantom.exit(status);
	};

	testrunner.process();

})(this, undefined);