desc('Run the JavaScript tests and then build the distributable file')
task('default', ['test:js', 'build:dist/app.min.js.gz']);