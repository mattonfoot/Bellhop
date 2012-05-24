var jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	gzip = require('gzip'),
	fs = require('fs'),
	wrench = require('wrench'),
	path = require('path');

var files = [
		'src/core.js'
	, 	'src/sandbox.mq.js'
	, 	'src/sandbox.ajax.js'
	, 	'src/sandbox.dom.mootools.js'
	, 	'src/sandbox.domevents.mootools.js'
	, 	'src/sandbox.domstyle.mootools.js'
	, 	'src/sandbox.effects.mootools.js'
];

desc('remove the existing distribution folder');
task('prepare', function() {
	if (path.existsSync('dist')) {
		wrench.rmdirSyncRecursive('dist');
	}
});

desc('create the distribution folder');
directory('dist', ['prepare']);

desc('concatenate all src files into a single script');
file({'dist/app.js': ['prepare', 'dist']}, function () {
	var output = files.map(function(file) {
		return fs.readFileSync(file);
	});

	fs.writeFileSync('dist/app.js', output.join('\n\n'));
});

desc('minify the concatenated files');
file({'dist/app.min.js': ['dist/app.js']}, function () {
	var data = fs.readFileSync('dist/app.js', 'utf8');

	var ast = jsp.parse(data);

	ast = pro.ast_mangle(ast);
	ast = pro.ast_squeeze(ast);
	ast = pro.ast_lift_variables(ast);

	var final_code = pro.gen_code(ast);

	fs.writeFileSync('dist/app.min.js', final_code);
});

desc('gzip the minified file');
file({'dist/app.min.js.gz': ['dist/app.min.js']}, function () {
	var data = fs.readFileSync('dist/app.min.js', 'utf8');

	gzip(data, function(err, data) {
		if (err) {
			throw err;
		}

		fs.writeFileSync('dist/app.min.js.gz', data);

		complete();
	});

}, {async: true});

task('default', ['dist/app.min.js.gz']);