(function(window, laterooms, undefined) {

require([

// support libraries
'../lib/qunit/qunit',
'../lib/hamcrest/jshamcrest',

// system under test
'../lib/mootools/mootools-1.2.3-min.js',
'../dist/app.min.js',
'../src/modules.searchbox.js'

], function() {

// setup JS Hamcrest
JsHamcrest.Integration.QUnit();

// define modules and tests
var app = Global.app;

module('Given a framework extended with a testing sandbox and the SearchBox Module Registered', {
	teardown: function() {
		app.stop();
	}
});

test('When the SearchBox Module is started', function() {
	app.start();

	var instance = app.module('searchbox').instance;
	var fixtureHTML = document.getElementById('qunit-fixture').innerHTML;

	var searchBoxTitle = fixtureHTML.indexOf('Search Hotels');

	assertThat(searchBoxTitle, is( greaterThan( -1 ) ), 'Search Box Title is displayed Correctly');
});

});

})(this, this.laterooms || {});
