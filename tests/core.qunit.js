(function(Global, document, undefined) {
	
var app = Global.app;
	
var basicModuleWithName = { name: 'basicModuleWithName' };
var basicModuleWithHyphenatedName = { name: 'basic-Module-With-Hyphenated-Name' };
var basicModuleWithSpacedName = { name: 'basic Module With Spaced Name' };

var basicModuleWithStartCounter = { 
	name: 'basicModuleWithStartCounter',
	
	start: function(sandbox) {
		basicModuleWithStartCounter.calledCount++;
	},
	
	stop: function(sandbox) {
		basicModuleWithStartCounter.stopCalledCount++;
	},
	
	calledCount: 0,
	stopCalledCount: 0
};

var anotherModuleWithStartCounter = { 
	name: 'anotherModuleWithStartCounter',
	
	start: function(sandbox) {
		anotherModuleWithStartCounter.calledCount++;
	},
	
	stop: function(sandbox) {
		anotherModuleWithStartCounter.stopCalledCount++;
	},
	
	calledCount: 0,
	stopCalledCount: 0
};

var yetAnotherModuleWithStartCounter = { 
	name: 'yetAnotherModuleWithStartCounter',
	
	start: function(sandbox) {
		yetAnotherModuleWithStartCounter.calledCount++;
	},
	
	stop: function(sandbox) {
		yetAnotherModuleWithStartCounter.stopCalledCount++;
	},
	
	calledCount: 0,
	stopCalledCount: 0
};

var basicModuleWithSandboxReference = { 
	name: 'basicModuleWithSandboxReference',
	
	start: function(sandbox) {
		basicModuleWithSandboxReference.sandbox = sandbox;
	},
	
	sandbox: undefined
};

var basicSandboxEnvironment = { name: 'basicSandboxEnvironment' };

var anotherSandboxEnvironment = {
	name: 'will not override existing sandbox property', 
	otherProperty: 'will extend sandbox with this property'
};
	
		
module('Given a framework');

test('When it has the API interrogated', function() {
	this.app = app;
	
	assertThat( this.app, hasFunction('register'), 'And it will have a module [register] method');
	assertThat( this.app, hasFunction('unregister'), 'And it will have a module [unregister] method');
	assertThat( this.app, hasFunction('start'), 'And it will have a module [start] method');
	assertThat( this.app, hasFunction('stop'), 'And it will have a module [stop] method');
	assertThat( this.app, hasFunction('module'), 'And it will have a [module] retrieval method');
	assertThat( this.app, hasFunction('extend'), 'And it will have a sandbox [extend] method');
});

module('Given a framework with one module registered', {
	
	setup: function() {
		this.app = app;
		
		this.app.register(basicModuleWithName.name, basicModuleWithName);
	},
	
	teardown: function() {		
		this.app.unregister(basicModuleWithName.name);
	}
	
});

test('When it is has the modules name passed to [module]', function() {		
	var module = this.app.module(basicModuleWithName.name);
	
	assertThat( module, is( sameAs( basicModuleWithName ) ), 'Then it will return the registered module');
});

test('When it is has the modules name passed to [unregister]', function() {
	this.app.unregister(basicModuleWithName.name);
	
	assertThat( this.app.module(basicModuleWithName.name), is( nil() ), 'Then it will return nothing');
});

module('Given a framework with one hyphenated name module registered', {
	
	setup: function() {
		this.app = app;

		this.app.register(basicModuleWithHyphenatedName.name, basicModuleWithHyphenatedName);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithHyphenatedName.name);
	}

});

test('When it is has the modules name passed to [module]', function() {		
	var module = this.app.module(basicModuleWithHyphenatedName.name);
	
	assertThat( module, is( sameAs( basicModuleWithHyphenatedName ) ), 'Then it will return the registered module');
});	

module('Given a framework with one space seperated name module registered', {
	
	setup: function() {
		this.app = app;

		this.app.register(basicModuleWithSpacedName.name, basicModuleWithSpacedName);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithSpacedName.name);
	}

});

test('When it is has the modules name passed to [module]', function() {		
	var module = this.app.module(basicModuleWithSpacedName.name);
	
	assertThat( module, is( sameAs( basicModuleWithSpacedName ) ), 'Then it will return the registered module');
});
	
module('Given a framework', {
	
	setup: function() {
		this.app = app;
		
		basicModuleWithStartCounter.calledCount = 0;
	},
	
	teardown: function() {
		this.app.unregister(basicModuleWithStartCounter.name);
	}
	
});

test('When it is has a module passed to [register] once', function() {		
	this.app.register(basicModuleWithStartCounter.name, basicModuleWithStartCounter);
		
	assertThat( basicModuleWithStartCounter.calledCount, is( equalTo( 0 ) ), 'Then it will not call the registered modules [start] method');
});
	
module('Given a framework with one registered module with a start counter', {
	
	setup: function() {
		this.app = app;
		
		basicModuleWithStartCounter.calledCount = 0;
		
		this.app.register(basicModuleWithStartCounter.name, basicModuleWithStartCounter);
	},
	
	teardown: function() {
		this.app.unregister(basicModuleWithStartCounter.name);
	}
	
});

test('When it is has the modules name passed to [start] once', function() {
	this.app.start(basicModuleWithStartCounter.name);
		
	assertThat( basicModuleWithStartCounter.calledCount, is( equalTo( 1 ) ), 'Then it will call the registered modules [start] method only once');
});

test('When it is has the modules name passed to [start] twice', function() {
	this.app.start(basicModuleWithStartCounter.name);
	this.app.start(basicModuleWithStartCounter.name);
		
	assertThat( basicModuleWithStartCounter.calledCount, is( equalTo( 1 ) ), 'Then it will call the registered modules [start] method only once');
});

test('When it is has the modules name passed to [start] three times', function() {
	this.app.start(basicModuleWithStartCounter.name);
	this.app.start(basicModuleWithStartCounter.name);
	this.app.start(basicModuleWithStartCounter.name);
		
	assertThat( basicModuleWithStartCounter.calledCount, is( equalTo( 1 ) ), 'Then it will call the registered modules [start] method only once');
});

test('When it is has the modules name passed to [start] four times', function() {
	this.app.start(basicModuleWithStartCounter.name);
	this.app.start(basicModuleWithStartCounter.name);
	this.app.start(basicModuleWithStartCounter.name);
	this.app.start(basicModuleWithStartCounter.name);
		
	assertThat( basicModuleWithStartCounter.calledCount, is( equalTo( 1 ) ), 'Then it will call the registered modules [start] method only once');
});
	
module('Given a framework with two registered modules with a start counter', {
	
	setup: function() {
		this.app = app;
		
		basicModuleWithStartCounter.calledCount = 0;		
		anotherModuleWithStartCounter.calledCount = 0;
		
		this.app.register(basicModuleWithStartCounter.name, basicModuleWithStartCounter);
		this.app.register(anotherModuleWithStartCounter.name, anotherModuleWithStartCounter);
	},
	
	teardown: function() {
		this.app.unregister(basicModuleWithStartCounter.name);
		this.app.unregister(anotherModuleWithStartCounter.name);
	}
	
});

test('When it is has the first modules name passed to [start]', function() {
	this.app.start(basicModuleWithStartCounter.name);
		
	assertThat( basicModuleWithStartCounter.calledCount, is( greaterThan( 0 ) ), 'Then it will call the first registered modules [start] method');
	assertThat( anotherModuleWithStartCounter.calledCount, is( equalTo( 0 ) ), 'And it will not call the second registered modules [start] method');
});

test('When it is has the second modules name passed to [start]', function() {
	this.app.start(anotherModuleWithStartCounter.name);
		
	assertThat( basicModuleWithStartCounter.calledCount, is( equalTo( 0 ) ), 'Then it will not call the first registered modules [start] method');
	assertThat( anotherModuleWithStartCounter.calledCount, is( greaterThan( 0 ) ), 'And it will call the second registered modules [start] method');
});
	
module('Given a framework with an extension to the sandbox environment and a registered module', {
	
	setup: function() {
		this.app = app;
		
		this.app.register(basicModuleWithSandboxReference.name, basicModuleWithSandboxReference);
		
		this.app.extend(basicSandboxEnvironment);
	},
	
	teardown: function() {
		this.app.unregister(basicModuleWithSandboxReference.name);
	}
	
});

test('When it is has the first modules name passed to [start]', function() {
	this.app.start(basicModuleWithSandboxReference.name);
	
	assertThat( basicModuleWithSandboxReference.sandbox, is( not ( nil() ) ), 'Then it will call the [start] property of the module with a sandbox passed in');
	assertThat( basicModuleWithSandboxReference.sandbox.name, is( equalTo( basicSandboxEnvironment.name ) ), 'And the sandbox will have been extended');
});
	
module('Given a framework with an extension to the sandbox environment and an overiding extension and a registered module', {
	
	setup: function() {
		this.app = app;
		
		this.app.register(basicModuleWithSandboxReference.name, basicModuleWithSandboxReference);
		
		this.app.extend(basicSandboxEnvironment);
		this.app.extend(anotherSandboxEnvironment);
	},
	
	teardown: function() {
		this.app.unregister(basicModuleWithSandboxReference.name);
	}
	
});

test('When it is has the first modules name passed to [start]', function() {
	this.app.start(basicModuleWithSandboxReference.name);
	
	assertThat( basicModuleWithSandboxReference.sandbox.otherProperty, is( equalTo( anotherSandboxEnvironment.otherProperty ) ), 'Then it will have entended the sandbox twice');
	assertThat( basicModuleWithSandboxReference.sandbox.name, is( equalTo( basicSandboxEnvironment.name ) ), 'And it will not have overriden the first sandbox property');
});
	
module('Given a framework with three registered modules and [start] has been called', {
	
	setup: function() {
		this.app = app;	
		
		basicModuleWithStartCounter.stopCalledCount = 0;		
		anotherModuleWithStartCounter.stopCalledCount = 0;	
		yetAnotherModuleWithStartCounter.stopCalledCount = 0;
		
		this.app.register(basicModuleWithStartCounter.name, basicModuleWithStartCounter);
		this.app.register(anotherModuleWithStartCounter.name, anotherModuleWithStartCounter);
		this.app.register(yetAnotherModuleWithStartCounter.name, yetAnotherModuleWithStartCounter);
		
		this.app.start();	
	},
	
	teardown: function() {
		this.app.unregister(basicModuleWithStartCounter);
		this.app.unregister(anotherModuleWithStartCounter);
		this.app.unregister(yetAnotherModuleWithStartCounter);
	}
	
});

test('When [stop] is called', function() {	
	this.app.stop();
	
	assertThat( basicModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'Then it will call the first registered modules [stop] method');
	assertThat( anotherModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'And it will call the second registered modules [stop] method');
	assertThat( yetAnotherModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'And it will call the thrird registered modules [stop] method');
});

test('When [unregister] is called', function() {	
	this.app.unregister();
	
	assertThat( basicModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'Then it will call the first registered modules [stop] method');
	assertThat( anotherModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'And it will call the second registered modules [stop] method');
	assertThat( yetAnotherModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'And it will call the thrird registered modules [stop] method');
	assertThat( this.app.module(basicModuleWithName.name), is( nil() ), 'And it will return nothing from a call to [module] with the first registered modules name');
	assertThat( this.app.module(anotherModuleWithStartCounter.name), is( nil() ), 'And it will return nothing from a call to [module] with the second registered modules name');
	assertThat( this.app.module(yetAnotherModuleWithStartCounter.name), is( nil() ), 'And it will return nothing from a call to [module] with the third registered modules name');
});

})(this, this.document || {});
