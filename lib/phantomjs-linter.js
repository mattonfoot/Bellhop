
(function() {

var files = phantom.args,
		lintingPassed = true,
		reports = [];

if (files.length == 1) {
	files = phantom.args[0].split(';');
}

phantom.injectJs('lib\\JSHint\\jshint.js');

var startTime = new Date();

files.forEach(function(file) {
	var f = fs.open(file, 'r'),
			source = f.read(),
			result = JSHINT(source, { });

	if (! result) {
		if (JSHINT.errors.length > 0) {
			reports.push({
				filename: file,
				errors: JSHINT.errors
			});
		}
	}

});

var found = reports.length;

if ( found > 0 ) {
	var errors = 0, filecount = 0;

	reports.forEach(function(report) {
		report.errors.forEach(function(error) {
			console.log( report.filename + " (" + error.line + "," + error.character + "): warning JS0000: " + error.reason );
			console.log ( ' ' );
			console.log( error.evidence );
			console.log ( ' ' );
			console.log ( ' ' );
			errors++;
		});

		filecount++;
	});

	lintingPassed = false;

	console.log( "---------------------------------------------------------------------------" );
	console.log( " JSHint : error JS0001:  Found " + errors + " errors in " + filecount + " file" + (filecount == 1 ? "" : "s") );

} else {
	console.log( "---------------------------------------------------------------------------" );
	console.log( " NO ERRORS FOUND " );
}

	console.log( " Finished in " + ( new Date() - startTime ) + " milliseconds." );
	console.log( "---------------------------------------------------------------------------" );

phantom.exit(lintingPassed ? 0 : 1);

})();