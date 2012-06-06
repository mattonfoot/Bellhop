(function(Global, document, undefined) {

require([

// support libraries
'../lib/qunit/qunit',
'../lib/phantomjs-reporter.js',
'../lib/hamcrest/jshamcrest',

// system under test
'../src/core',
'../src/sandbox.mq.js'

], function() {

// setup JS Hamcrest
JsHamcrest.Integration.QUnit();

// define modules and tests
var app = Global.app;

module('Given an active listener to the event [test]', {
	setup: function() {
		this.app = Global.app;

		this.app.register('mq subscriber', function(sandbox) {
			var self = {};

			self.start = function() {
				sandbox.mq.subscribe('test', function(p) {
					self.paramValue = p;
				});
			};

			self.testMqPublish = function(p) {
				sandbox.mq.publish('test', p);
			};

			self.getPassedValue = function(p) {
				return self.paramValue;
			};

			self.paramValue = 'value not passed';

			return self;
		});

		this.app.start('mq subscriber');
	},

	teardown: function() {
		this.app.unregister('mq subscriber');
	}
});

test('when a [test] event is fired', function() {
	var passedValue = 'passed value';

	app.module('mq subscriber').instance.testMqPublish(passedValue);

	var paramValue = app.module('mq subscriber').instance.getPassedValue();

	assertThat(paramValue, is( equalTo( passedValue ) ), 'then the active listener will receive the event with the correct parameters')
});

test('when a [test] event is fired twice', function() {
	var passedValue = 'passed value';
	app.module('mq subscriber').instance.testMqPublish(passedValue);
	var paramValue = app.module('mq subscriber').instance.getPassedValue();
	assertThat(paramValue, is( equalTo( passedValue ) ), 'then the active listener will receive the first event with the correct parameters');

	var passedValue2 = 'passed value 2';
	app.module('mq subscriber').instance.testMqPublish(passedValue2);
	var paramValue2 = app.module('mq subscriber').instance.getPassedValue();
	assertThat(paramValue2, is( equalTo( passedValue2 ) ), 'and the active listener will receive the second event with the correct parameters');
});

module('Given an active listener to the event [test] and the event [second test]', {
	setup: function() {
		this.app = Global.app;

		this.app.register('mq subscriber', function(sandbox) {
			var self = {};

			self.start = function() {
				sandbox.mq.subscribe('test', function(p) {
					self.paramValue = p;
				});

				sandbox.mq.subscribe('second test', function(p) {
					self.paramValue2 = p;
				});
			};

			self.testMqPublish = function(p) {
				sandbox.mq.publish('test', p);
			};

			self.getPassedValue = function(p) {
				return self.paramValue;
			};

			self.getPassedValue2 = function(p) {
				return self.paramValue2;
			};

			self.paramValue = 'value not passed';
			self.paramValue2 = 'value not passed';

			return self;
		});

		this.app.start('mq subscriber');
	},

	teardown: function() {
		this.app.unregister('mq subscriber');
	}
});

test('when a [test] event is fired', function() {
	var passedValue = 'passed value';

	app.module('mq subscriber').instance.testMqPublish(passedValue);

	var paramValue = app.module('mq subscriber').instance.getPassedValue2();

	assertThat(paramValue, is( equalTo( 'value not passed' ) ), 'then the active listener for the event [second test] will not receive the event')
});

});

})(this, this.document || {});
