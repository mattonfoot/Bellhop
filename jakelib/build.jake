var gzip = require('gzip'),
	fs = require('fs'),
	wrench = require('wrench'),
	path = require('path');

var variants = ['', 'mootools', 'jQuery'];

var files = [
		'src/core.js'
	, 	'src/sandbox.mq.js'
	, 	'src/sandbox.mq.domready.js'
	, 	'src/sandbox.ajax.js'
	, 	'src/sandbox.dom.js'
	, 	'src/sandbox.domevents.js'
	, 	'src/sandbox.domstyle.js'
	, 	'src/sandbox.effects.js'
];

var output = { folder: 'dist', file: 'app' };

namespace('build', function () {

	desc('Prepare working Directory by removing the existing distribution folder');
	task('prepare', function() {
		if (path.existsSync(output.folder)) {
			wrench.rmdirSyncRecursive(output.folder);
		}
	});

	desc('create the distribution folder');
	directory(output.folder, ['build:prepare']);

	desc('concatenate all src files into a single script');
	file(output.folder +'/app.js', ['build:' + output.folder], function () {
		variants.forEach(function(variant) {
			var variantExt = (variant ? '.' + variant : '');

			var output = files.map(function(file) {
				return readSrcFile(file, variant);
			});

			fs.writeFileSync('dist/app'+ variantExt +'.js', output.join('\n\n'));
		});

	});

	desc('minify the concatenated files');
	file(output.folder +'/app.min.js', ['build:'+ output.folder +'/app.js'], function () {
		variants.forEach(function(variant) {
			var variantExt = (variant ? '.' + variant : '');

			var data = fs.readFileSync('dist/app'+ variantExt +'.js', 'utf8');

			var final_code = minifyJS(data);

			fs.writeFileSync('dist/app'+ variantExt +'.min.js', final_code);
		});
	});

	desc('gzip the minified file');
	file(output.folder +'/app.min.js.gz', ['build:'+ output.folder +'/app.min.js'], function () {
		variants.forEach(function(variant) {
			var variantExt = (variant ? '.' + variant : '');

			var data = fs.readFileSync(output.folder +'/app'+ variantExt +'.min.js', 'utf8');

			gzip(data, function(err, data) {
				if (err) {
					throw err;
				}

				fs.writeFileSync(output.folder +'/app'+ variantExt +'.min.js.gz', data);

				complete();
			});
		});

	}, {async: true});

});

function readSrcFile(file, variant) {
	var variantFile = file.replace('.js', '.'+ variant +'.js');

	if (variant != '' && path.existsSync(variantFile)) {
		return fs.readFileSync(variantFile);
	}

	if (path.existsSync(file)) {
		return fs.readFileSync(file);
	}

	return '';
}

function minifyJS(data) {
	var jsp = require("uglify-js").parser,
		pro = require("uglify-js").uglify;

	var ast = jsp.parse(data);

	ast = pro.ast_mangle(ast);
	ast = pro.ast_squeeze(ast);
	ast = pro.ast_lift_variables(ast);

	return pro.gen_code(ast);
}