desc('Tests and builds the distributable file');
task('default', ['test:js', 'build:dist/app.min.js.gz', 'test:js.min' ]);

desc('Tests, builds and runs coverage report');
task('full', ['test:js', 'build:dist/app.min.js.gz', 'coverage:js', 'test:js.min' ]);