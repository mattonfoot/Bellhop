
(function(Global, document, undefined) {

module('Given a framework');

test('When it has the API interrogated', function() {
	this.app = Global.app;

	assertThat( this.app, hasFunction('register'), 'And it will have a module [register] method');
	assertThat( this.app, hasFunction('unregister'), 'And it will have a module [unregister] method');
	assertThat( this.app, hasFunction('start'), 'And it will have a module [start] method');
	assertThat( this.app, hasFunction('stop'), 'And it will have a module [stop] method');
	assertThat( this.app, hasFunction('module'), 'And it will have a [module] retrieval method');
	assertThat( this.app, hasFunction('extend'), 'And it will have a sandbox [extend] method');
});

module('Given a framework with one module registered', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithName.moduleName, basicModuleWithName);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithName.moduleName);
	}

});

test('When it is has the modules name passed to [module]', function() {
	var module = this.app.module(basicModuleWithName.moduleName).module;

	assertThat( module, is( sameAs( basicModuleWithName ) ), 'Then it will return the registered module');
});

test('When it is has the modules name passed to [unregister]', function() {
	this.app.unregister(basicModuleWithName.moduleName);

	assertThat( this.app.module(basicModuleWithName.moduleName).module, is( nil() ), 'Then it will return nothing');
});

module('Given a framework with one hyphenated name module registered', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithHyphenatedName.moduleName, basicModuleWithHyphenatedName);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithHyphenatedName.moduleName);
	}

});

test('When it is has the modules name passed to [module]', function() {
	var module = this.app.module(basicModuleWithHyphenatedName.moduleName).module;

	assertThat( module, is( sameAs( basicModuleWithHyphenatedName ) ), 'Then it will return the registered module');
});

module('Given a framework with one space seperated name module registered', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithSpacedName.moduleName, basicModuleWithSpacedName);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithSpacedName.moduleName);
	}

});

test('When it is has the modules name passed to [module]', function() {
	var module = this.app.module(basicModuleWithSpacedName.moduleName).module;

	assertThat( module, is( sameAs( basicModuleWithSpacedName ) ), 'Then it will return the registered module');
});

module('Given a framework', {

	setup: function() {
		this.app = Global.app;
	},

	teardown: function() {
		this.app.unregister(basicModuleWithStartCounter.moduleName);
	}

});

test('When it is has a module passed to [register] once', function() {
	this.app.register(basicModuleWithStartCounter.moduleName, basicModuleWithStartCounter);

	var instance = this.app.module(basicModuleWithStartCounter.moduleName).instance;

	assertThat( instance, is( undefined ), 'Then it will not have created a running instance of the module');
});

module('Given a framework with one registered module with a start counter', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithStartCounter.moduleName, basicModuleWithStartCounter);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithStartCounter.moduleName);
	}

});

test('When it is has the modules name passed to [start] once', function() {
	this.app.start(basicModuleWithStartCounter.moduleName);

	var instance = this.app.module(basicModuleWithStartCounter.moduleName).instance;

	assertThat( instance.calledCount, is( equalTo( 1 ) ), 'Then it will call the registered modules [start] method only once');
});

test('When it is has the modules name passed to [start] twice', function() {
	this.app.start(basicModuleWithStartCounter.moduleName);
	this.app.start(basicModuleWithStartCounter.moduleName);

	var instance = this.app.module(basicModuleWithStartCounter.moduleName).instance;

	assertThat( instance.calledCount, is( equalTo( 1 ) ), 'Then it will call the registered modules [start] method only once');
});

test('When it is has the modules name passed to [start] three times', function() {
	this.app.start(basicModuleWithStartCounter.moduleName);
	this.app.start(basicModuleWithStartCounter.moduleName);
	this.app.start(basicModuleWithStartCounter.moduleName);

	var instance = this.app.module(basicModuleWithStartCounter.moduleName).instance;

	assertThat( instance.calledCount, is( equalTo( 1 ) ), 'Then it will call the registered modules [start] method only once');
});

test('When it is has the modules name passed to [start] four times', function() {
	this.app.start(basicModuleWithStartCounter.moduleName);
	this.app.start(basicModuleWithStartCounter.moduleName);
	this.app.start(basicModuleWithStartCounter.moduleName);
	this.app.start(basicModuleWithStartCounter.moduleName);

	var instance = this.app.module(basicModuleWithStartCounter.moduleName).instance;

	assertThat( instance.calledCount, is( equalTo( 1 ) ), 'Then it will call the registered modules [start] method only once');
});

module('Given a framework with one module registered that has no start method', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithName.moduleName, basicModuleWithName);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithName.moduleName);
	}

});

test('When it is has the modules name passed to [start]', function() {
	this.app.start(basicModuleWithName.moduleName);

	var instance = this.app.module(basicModuleWithName.moduleName).instance;

	assertThat( instance, is( sameAs( basicModuleWithName ) ), 'Then it will return the registered module');
});

module('Given a framework with two registered modules with a start counter', {

	setup: function() {
		this.app = Global.app;

		basicModuleWithStartCounter.calledCount = 0;
		anotherModuleWithStartCounter.calledCount = 0;

		this.app.register(basicModuleWithStartCounter.moduleName, basicModuleWithStartCounter);
		this.app.register(anotherModuleWithStartCounter.moduleName, anotherModuleWithStartCounter);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithStartCounter.moduleName);
		this.app.unregister(anotherModuleWithStartCounter.moduleName);
	}

});

test('When it is has the first modules name passed to [start]', function() {
	this.app.start(basicModuleWithStartCounter.moduleName);

	var instanceA = this.app.module(basicModuleWithStartCounter.moduleName).instance;
	var instanceB = this.app.module(anotherModuleWithStartCounter.moduleName).instance;

	assertThat( instanceA.calledCount, is( greaterThan( 0 ) ), 'Then it will call the first registered modules [start] method');
	assertThat( instanceB, is( undefined ), 'And it will not have initialised the second registered module');
});

test('When it is has the second modules name passed to [start]', function() {
	this.app.start(anotherModuleWithStartCounter.moduleName);

	var instanceA = this.app.module(basicModuleWithStartCounter.moduleName).instance;
	var instanceB = this.app.module(anotherModuleWithStartCounter.moduleName).instance;

	assertThat( instanceA, is( undefined ), 'Then it will not have initialized the first registered module');
	assertThat( instanceB.calledCount, is( greaterThan( 0 ) ), 'And it will call the second registered modules [start] method');
});

module('Given a framework with three registered modules and [start] has been called', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithStartCounter.moduleName, basicModuleWithStartCounter);
		this.app.register(anotherModuleWithStartCounter.moduleName, anotherModuleWithStartCounter);
		this.app.register(yetAnotherModuleWithStartCounter.moduleName, yetAnotherModuleWithStartCounter);

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

	var instanceA = this.app.module(basicModuleWithStartCounter.moduleName);
	var instanceB = this.app.module(anotherModuleWithStartCounter.moduleName);
	var instanceC = this.app.module(yetAnotherModuleWithStartCounter.moduleName);

	assertThat( instanceA.module.stopCalledCount, is( equalTo( 1 ) ), 'Then it will call the first registered modules [stop] method');
	assertThat( instanceB.module.stopCalledCount, is( equalTo( 1 ) ), 'And it will call the second registered modules [stop] method');
	assertThat( instanceC.module.stopCalledCount, is( equalTo( 1 ) ), 'And it will call the thrird registered modules [stop] method');
});

test('When [unregister] is called', function() {
	this.app.unregister();

	var instanceA = this.app.module(basicModuleWithStartCounter.moduleName);
	var instanceB = this.app.module(anotherModuleWithStartCounter.moduleName);
	var instanceC = this.app.module(yetAnotherModuleWithStartCounter.moduleName);

	assertThat( basicModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'Then it will call the first registered modules [stop] method');
	assertThat( anotherModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'And it will call the second registered modules [stop] method');
	assertThat( yetAnotherModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'And it will call the thrird registered modules [stop] method');
	assertThat( instanceA.module, is( nil() ), 'And it will return nothing from a call to [module] with the first registered modules name');
	assertThat( instanceB.module, is( nil() ), 'And it will return nothing from a call to [module] with the second registered modules name');
	assertThat( instanceC.module, is( nil() ), 'And it will return nothing from a call to [module] with the third registered modules name');
});

module('Given a framework with three registered modules and the first modules name was passed to [start]', {

	setup: function() {
		this.app = Global.app;

		basicModuleWithStartCounter.stopCalledCount = 0;
		anotherModuleWithStartCounter.stopCalledCount = 0;
		yetAnotherModuleWithStartCounter.stopCalledCount = 0;

		this.app.register(basicModuleWithStartCounter.moduleName, basicModuleWithStartCounter);
		this.app.register(anotherModuleWithStartCounter.moduleName, anotherModuleWithStartCounter);
		this.app.register(yetAnotherModuleWithStartCounter.moduleName, yetAnotherModuleWithStartCounter);

		this.app.start(basicModuleWithStartCounter.moduleName);
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
	assertThat( anotherModuleWithStartCounter.stopCalledCount, is( equalTo( 0 ) ), 'And it will not call the second registered modules [stop] method');
	assertThat( yetAnotherModuleWithStartCounter.stopCalledCount, is( equalTo( 0 ) ), 'And it not will call the thrird registered modules [stop] method');
	assertThat( this.app.module(basicModuleWithStartCounter.moduleName).instance, is( nil() ), 'And it will return nothing from a call to [instance] with the first registered modules name');
	assertThat( this.app.module(anotherModuleWithStartCounter.moduleName).instance, is( nil() ), 'And it will return nothing from a call to [instance] with the second registered modules name');
	assertThat( this.app.module(yetAnotherModuleWithStartCounter.moduleName).instance, is( nil() ), 'And it will return nothing from a call to [instance] with the third registered modules name');
});

test('When [unregister] is called', function() {
	this.app.unregister();

	assertThat( basicModuleWithStartCounter.stopCalledCount, is( equalTo( 1 ) ), 'Then it will call the first registered modules [stop] method');
	assertThat( anotherModuleWithStartCounter.stopCalledCount, is( equalTo( 0 ) ), 'And it will not call the second registered modules [stop] method');
	assertThat( yetAnotherModuleWithStartCounter.stopCalledCount, is( equalTo( 0 ) ), 'And it will not call the thrird registered modules [stop] method');
	assertThat( this.app.module(basicModuleWithStartCounter.moduleName).module, is( nil() ), 'And it will return nothing from a call to [module] with the first registered modules name');
	assertThat( this.app.module(anotherModuleWithStartCounter.moduleName).module, is( nil() ), 'And it will return nothing from a call to [module] with the second registered modules name');
	assertThat( this.app.module(yetAnotherModuleWithStartCounter.moduleName).module, is( nil() ), 'And it will return nothing from a call to [module] with the third registered modules name');
});

module('Given a framework with one sandboxed extension namespace and a registered module', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithSandboxReference.moduleName, basicModuleWithSandboxReference);

		this.app.extend('basicSandboxEnvironment', basicSandboxEnvironment);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithSandboxReference.moduleName);
	}

});

test('When it is has the first modules name passed to [start]', function() {
	this.app.start(basicModuleWithSandboxReference.moduleName);

	var instance = this.app.module(basicModuleWithSandboxReference.moduleName).instance;

	assertThat( instance.sandbox.basicSandboxEnvironment, is( not ( nil() ) ), 'Then it will call the [start] property of the module with a sandbox passed in');
	assertThat( instance.sandbox.basicSandboxEnvironment.moduleName, is( equalTo( basicSandboxEnvironment.moduleName ) ), 'And the sandbox will have been extended');
});

module('Given a framework with one sandboxed extension namespace', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithSandboxReference.moduleName, basicModuleWithSandboxReference);

		this.app.extend('overridingSandboxEnvironment', basicSandboxEnvironment);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithSandboxReference.moduleName);
	}

});

test('When a second extension is added to the sandbox with the same namespace', function() {
	raises(function() {
		this.app.extend('overridingSandboxEnvironment', anotherSandboxEnvironment);
	  }, 'it raises an exception');
});

module('Given a framework with two sandboxed extension namespaces and a registered module', {

	setup: function() {
		this.app = Global.app;

		this.app.register(basicModuleWithSandboxReference.moduleName, basicModuleWithSandboxReference);

		this.app.extend('firstSandboxEnvironment', basicSandboxEnvironment);
		this.app.extend('secondSandboxEnvironment', anotherSandboxEnvironment);
	},

	teardown: function() {
		this.app.unregister(basicModuleWithSandboxReference.moduleName);
	}

});

test('When it is has the first modules name passed to [start]', function() {
	this.app.start(basicModuleWithSandboxReference.moduleName);

	var instance = this.app.module(basicModuleWithSandboxReference.moduleName).instance;

	assertThat( instance.sandbox.secondSandboxEnvironment.otherProperty, is( equalTo( anotherSandboxEnvironment.otherProperty ) ), 'Then it will have entended the sandbox twice');
	assertThat( instance.sandbox.secondSandboxEnvironment.moduleName, is( equalTo( anotherSandboxEnvironment.moduleName ) ), 'And it will have added a property with the same name as a previous into a new namespace');
	assertThat( instance.sandbox.firstSandboxEnvironment.moduleName, is( equalTo( basicSandboxEnvironment.moduleName ) ), 'And it will not have overriden the first sandbox property in the first namespace');
});

})(this, this.document || {});
