var fs = require('fs');

(function(Global, undefined) {

var outputfolder, testscripts = [];

if (phantom.args.length < 2) {
    console.log('Usage: phantomjs-coverage.js OUTPUTFOLDER FIXTURE [, FIXTURE, ...]');

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

	phantom.injectJs('CoverageRunner.js');

	var coveragerunner = Global.CoverageRunner(outputfolder, testscripts);

	coveragerunner.onComplete = function(status, report) {
		// Parse coverage data
		var coverages = parseCoverages(report);

		// Per-file Coverage Reports HTML
		var fileCoverage = fs.read('./lib/template-fileCoverage.htm');
		forEachPropertyIn(coverages, function(coverage) {
			fs.write(outputfolder + '/' + coverage.fileReport, fileCoverage.replace('<div id="code"></div>', coverage.fileCoverageHtml), 'w');
		});

		// Coverage Report Index HTML
		var reportHTML = getReportHTML(coverages);
		var suiteReportTemplate = fs.read('./lib/template-report.htm');
		fs.write(outputfolder + '/coverage.report.htm', suiteReportTemplate.replace('<div id="report"></div>', reportHTML), 'w');

		phantom.exit(status);
	};

	coveragerunner.onError = function(status) {
		phantom.exit(status);
	};

coveragerunner.process();



// parsers

function parseCoverages(coverages) {
    var parsedCoverages = [];

    forEachPropertyIn(coverages, function(coverage, fileName) {
		fs.write(outputfolder + '/' + fileName + 'on', JSON['stringify' in JSON ? 'stringify' : 'encode'](coverage), 'w');

		parsedCoverages.push(getInfoFromFileCoverage(coverage, fileName));

    });

	return parsedCoverages;
}

function getInfoFromFileCoverage(coverage, fileName) {
    var reportHtml = [];
    var sourceCodeHtml = [];

    //var source = fs.read(suite.sourcePath + '/' + fileName).split('\n');
    var source = coverage.source;

    var testableLines = 0;
    var testedLines = 0;
    var untestableLines = 0;

    sourceCodeHtml.push('<table class="coverage">');

    forEachPropertyIn(source, function(line, j) {

        j = parseInt(j, 10);
        var cvg = coverage.coverage[j + 1];
        var hitmiss = '';

        if (cvg !== undefined) {
            testableLines++;
            if (cvg > 0) testedLines++;
            hitmiss = ' ' + (cvg > 0 ? 'hit' : 'miss');
        } else {
            hitmiss = ' ' + 'undef';
            untestableLines++;
        }

        sourceCodeHtml.push('<tr><td>' + (j + 1) + '</td><td class="code' + hitmiss + '">' + line + '</td></tr>\n');
    });

    sourceCodeHtml.push('</table>');

    var coveragePercentInt = Math.floor(100 * testedLines / testableLines);
    var coveragePercent = coveragePercentInt + '%';

    reportHtml.push('<h1>' + fileName + '</h1>');
    reportHtml.push('<h2>Coverage: ' + coveragePercent + '</h2>');
    reportHtml.push(sourceCodeHtml.join('\n'));

    return {
        testableLines: testableLines,
        testedLines: testedLines,
        coveragePercentInt: coveragePercentInt,
        coveragePercent: coveragePercent,
        fileCoverageHtml: reportHtml.join('\n'),
        fileName: fileName,
        fileReport: fileName.replace('.js', '.coverage.htm')
    };

}

function getReportHTML(coverages) {

    var reportHTML = [];
    var perFileReports = [];
    var overallTestableLines = 0;
    var overallTestedLines = 0;

    perFileReports.push('<ul class="coverage">');

    forEachPropertyIn(coverages, function(coverage) {

        overallTestableLines += coverage.testableLines;
        overallTestedLines += coverage.testedLines;

        var coverageClass = 'coverage-low';
        if (coverage.coveragePercentInt > 30) coverageClass = 'coverage-medium';
        if (coverage.coveragePercentInt > 70) coverageClass = 'coverage-high';
        if (coverage.coveragePercentInt == 100) coverageClass = 'coverage-full';

        perFileReports.push('<li class="' + coverageClass + '"><a href="' + coverage.fileReport + '">' + coverage.fileName + '</a> : <span class="coverage-percent">' + coverage.coveragePercent + '</span></li>');

    });

    perFileReports.push('</ul>');

    var overallCoveragePercent = Math.floor(100 * overallTestedLines / overallTestableLines) + '%';

    reportHTML.push('<h1>Code coverage: ' + overallCoveragePercent + '</h1>');
    reportHTML.push(perFileReports.join('\n'));

    return reportHTML.join('\n');
}



// helpers

function forEachPropertyIn(object, callback) {
    for (var prop in object) {
        if (({}).hasOwnProperty.call(object, prop)) {
            callback(object[prop], prop);
        }
    }
}

})(this, undefined);