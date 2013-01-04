var wrench = require('wrench'),
	fs = require('fs');

namespace('coverage', function () {

	desc('remove the existing Temporary Output Folder');
	task('prepare', function() {
		if (fs.existsSync('coverage')) {
			wrench.rmdirSyncRecursive('coverage');
		}
	});

	task('js', ['coverage:prepare'], function() {
		var params = [];

		params.push('./lib/phantomjs-coverage.js'); // script
		params.push('./TestResults'); // output

		fs.mkdir('coverage');

		// generate annotated files
		var jscoverage_task = require('child_process')
				.execFile('./lib/JSCoverage/jscoverage.exe', ['src', 'instrumented']);

		jscoverage_task.stderr.on('data', function (data) {
			fail( data );
		});

		jscoverage_task.stdout.on('data', function (data) {
			console.log( data );
		});

		jscoverage_task.on('exit', function (code, signal) {
			wrench.copyDirSyncRecursive('instrumented', 'coverage/src');
			wrench.copyDirSyncRecursive('lib', 'coverage/lib');
			wrench.copyDirSyncRecursive('tests', 'coverage/tests');

			wrench.rmdirSyncRecursive('instrumented');

			var g = new require("glob").Glob('./coverage/tests/*.qunit.htm');

			g.on('end', function(files) {
				files.forEach(function(file) {
					params.push( file );
				});

				phantomTask(params);

			});
		});

	}, { async: true });

});

function phantomTask(params) {
	var command = './lib/PhantomJS/phantomjs.exe';

	var phantom_task = require('child_process')
			.execFile(command, params);

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