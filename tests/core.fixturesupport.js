
var basicModuleWithName = function() {
	this.moduleName = basicModuleWithName.moduleName;
};
basicModuleWithName.moduleName = 'basicModuleWithName';

var basicModuleWithHyphenatedName = function() {
	this.moduleName = basicModuleWithHyphenatedName.moduleName;
};
basicModuleWithHyphenatedName.moduleName = 'basic-Module-With-Hyphenated-Name';

var basicModuleWithSpacedName = function() {
	this.moduleName = basicModuleWithSpacedName.moduleName;
};
basicModuleWithSpacedName.moduleName = 'basic Module With Spaced Name';

var basicModuleWithStartCounter = function(sandbox) {
	var self = {};

	self.moduleName = basicModuleWithStartCounter.moduleName;

	self.start = function() {
		self.calledCount++;
	};

	self.stop = function() {
		basicModuleWithStartCounter.stopCalledCount++;
	};

	self.calledCount = 0;

	basicModuleWithStartCounter.stopCalledCount = 0;

	return self;
};
basicModuleWithStartCounter.moduleName = 'basicModuleWithStartCounter';

var anotherModuleWithStartCounter = function(sandbox) {
	var self = {};

	self.moduleName = anotherModuleWithStartCounter.moduleName;

	self.start = function() {
		self.calledCount++;
	};

	self.stop = function() {
		anotherModuleWithStartCounter.stopCalledCount++;
	};

	self.calledCount = 0;

	anotherModuleWithStartCounter.stopCalledCount = 0;

	return self;
};
anotherModuleWithStartCounter.moduleName = 'anotherModuleWithStartCounter'

var yetAnotherModuleWithStartCounter = function(sandbox) {
	var self = {};

	self.moduleName = yetAnotherModuleWithStartCounter.moduleName;

	self.start = function() {
		self.calledCount++;
	};

	self.stop = function() {
		yetAnotherModuleWithStartCounter.stopCalledCount++;
	};

	self.calledCount = 0;

	yetAnotherModuleWithStartCounter.stopCalledCount = 0;

	return self;
};
yetAnotherModuleWithStartCounter.moduleName = 'yetAnotherModuleWithStartCounter';

var basicModuleWithSandboxReference = function(sandbox) {
	var self = {};

	self.moduleName = basicModuleWithSandboxReference.moduleName;

	self.start = function() { };

	self.sandbox = sandbox;

	return self;
};
basicModuleWithSandboxReference.moduleName = 'basicModuleWithSandboxReference';

var basicSandboxEnvironment = {
	moduleName: 'basicSandboxEnvironment'
};

var anotherSandboxEnvironment = {
	moduleName: 'will not override existing sandbox property',

	otherProperty: 'will extend sandbox with this property'
};
