var path = require('path'),
	wrench = require('wrench');

namespace('test', function () {

	/*
	phantomTask({
		script: './lib/phantomjs-runner.js',
		output: './TestResults',
		inputs: './*-/*.{test,spec}.htm',
	});
	*/

	desc('remove the existing Test Output Folder');
	task('prepare', function() {
		if (path.existsSync('TestResults')) {
			wrench.rmdirSyncRecursive('TestResults');
		}
	});

	desc('create the Test Output Folder');
	directory('TestResults', ['test:prepare']);

	task('js', ['test:TestResults'], function() {
		var params = [];
		var g = new require("glob").Glob('./tests/*.qunit.htm');

		g.on('end', function(files) {
			files.forEach(function(file) {
				params.push( file );
			});

			phantomTestRunnerTask(params);
		});
	}, { async: true });

});

function phantomTestRunnerTask(params) {
	var command = './lib/PhantomJS/phantomjs.exe';

	params.unshift('./TestResults'); // output
	params.unshift('./lib/phantomjs-runner.js'); // script

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