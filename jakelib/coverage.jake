var path = require('path'),
	wrench = require('wrench');

namespace('coverage', function () {

	desc('remove the existing Temporary Output Folder');
	task('prepare', function() {
		if (path.existsSync('instrumented')) {
			wrench.rmdirSyncRecursive('instrumented');
		}
	});

	task('js', ['coverage:prepare'], function() {
		// generate annotated files
		var jscoverage_task = require('child_process').execFile('./lib/JSCoverage/jscoverage.exe', ['src', 'instrumented']);

		var g = new require("glob").Glob('./tests/*.qunit.htm');

		/*
		var params = [];

		params.push('./lib/coverage-runner.js'); // script
		params.push('./Coverage'); // output

		g.on('end', function(files) {
			files.forEach(function(file) {
				params.push( file );
			});

			phantomTestRunnerTask(params);
		});

		, { async: true }
		*/
	});

});

function phantomTestRunnerTask(params) {
	var command = './lib/PhantomJS/phantomjs.exe';

	var phantom_task = require('child_process').execFile(command, params);

	phantom_task.stderr.on('data', function (data) {
		fail( data );
	});

	phantom_task.stdout.on('data', function (data) {
		console.log( data );
	});

	phantom_task.on('exit', function (code, signal) {
		if (code === 0) {
			complete();
			return;
		}

		fail('PhantomTask exited with code ' + code);
	});

}