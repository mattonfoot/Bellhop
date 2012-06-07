var jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	gzip = require('gzip'),
	fs = require('fs'),
	wrench = require('wrench'),
	path = require('path');

var files = [
		'src/core.js'
	, 	'src/sandbox.mq.js'
	, 	'src/sandbox.mq.domready.mootools.js'
	, 	'src/sandbox.ajax.js'
	, 	'src/sandbox.dom.mootools.js'
	, 	'src/sandbox.domevents.mootools.js'
	, 	'src/sandbox.domstyle.mootools.js'
	, 	'src/sandbox.effects.mootools.js'
];

desc('Run the JavaScript tests and then build the distributable file')
task('default', ['test:js', 'build:dist/app.min.js.gz']);

namespace('build', function () {

	desc('remove the existing distribution folder');
	task('prepare', function() {
		if (path.existsSync('dist')) {
			wrench.rmdirSyncRecursive('dist');
		}
	});

	desc('create the distribution folder');
	directory('dist', ['build:prepare']);

	desc('concatenate all src files into a single script');
	file({'dist/app.js': ['build:prepare', 'build:dist']}, function () {
		var output = files.map(function(file) {
			return fs.readFileSync(file);
		});

		fs.writeFileSync('dist/app.js', output.join('\n\n'));
	});

	desc('minify the concatenated files');
	file({'dist/app.min.js': ['build:dist/app.js']}, function () {
		var data = fs.readFileSync('dist/app.js', 'utf8');

		var ast = jsp.parse(data);

		ast = pro.ast_mangle(ast);
		ast = pro.ast_squeeze(ast);
		ast = pro.ast_lift_variables(ast);

		var final_code = pro.gen_code(ast);

		fs.writeFileSync('dist/app.min.js', final_code);
	});

	desc('gzip the minified file');
	file({'dist/app.min.js.gz': ['build:dist/app.min.js']}, function () {
		var data = fs.readFileSync('dist/app.min.js', 'utf8');

		gzip(data, function(err, data) {
			if (err) {
				throw err;
			}

			fs.writeFileSync('dist/app.min.js.gz', data);

			complete();
		});

	}, {async: true});

});

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
		var command = './lib/PhantomJS/phantomjs.exe';
		var params = [];

		params.push('./lib/phantomjs-runner.js'); // script
		params.push('./TestResults'); // output

		var g = new require("glob").Glob('./tests/*.qunit.htm');

		g.on('end', function(files) {
			files.forEach(function(file) {
				params.push( file );
			});

			phantomTestRunnerTask(command, params);
		});
	}, { async: true });

});

function phantomTestRunnerTask(command, params) {
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