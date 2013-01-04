(function(Global, document, undefined) {

// define modules and tests
var app = Global.app;

this.app.register('mq domready subscriber', function(sandbox) {
	var self = {};

	self.start = function() {
		sandbox.mq.subscribe('domready', function() {
			self.paramValue = 'passed value';
		});
	};

	self.getPassedValue = function() {
		return self.paramValue;
	};

	self.paramValue = 'value not passed';

	return self;
});

this.app.start('mq domready subscriber');

module('Given an active listener to the [domready] event', {
	setup: function() {
		this.app = Global.app;
	},

	teardown: function() {
		this.app.unregister('mq domready subscriber');
	}
});

test('when a [test] event is fired', function() {
	var passedValue = 'passed value';

	var paramValue = Global.app.module('mq domready subscriber').instance.getPassedValue();

	assertThat(paramValue, is( equalTo( passedValue ) ), 'then the active listener will receive the event with the correct parameters')
});

})(this, this.document || {});
