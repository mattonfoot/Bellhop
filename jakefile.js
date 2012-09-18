desc('Run the JavaScript tests and then build the distributable file')
// task('default', ['test:js', 'build:dist/app.min.js.gz', 'test:js.min', 'coverage:js' ]);
task('default', ['test:js', 'build:dist/app.min.js.gz', 'coverage:js', 'test:js.min' ]);