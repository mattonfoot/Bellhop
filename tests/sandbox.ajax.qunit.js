
var XMLHttpRequestFake = function() { };

XMLHttpRequestFake.prototype = {
	open: function(method, url, async) {
		XMLHttpRequestFake.prototype.url = url;
		XMLHttpRequestFake.prototype.method = method;

	},

	send: function(postData) {
		XMLHttpRequestFake.prototype.postData = postData;

		this.readyState = 1;
		this.onreadystatechange();
		this.readyState = 2;
		this.onreadystatechange();
		this.readyState = 3;
		this.onreadystatechange();
		this.readyState = 4;
		this.onreadystatechange();
	},

	setRequestHeader: function(key, value) {
		XMLHttpRequestFake.prototype.requestHeaders[key] = value;
	},

	onreadystatechange: function() { },

	Original: XMLHttpRequest,

	readyState: 0,
	status: 200,

	url: '',
	method: '',
	postData: '',
	requestHeaders: {}
};

XMLHttpRequest = XMLHttpRequestFake;

(function(Global, document, undefined) {

// define modules and tests
var app = Global.app;

module('Given a [sandbox.ajax.get] method', {
	setup: function() {
		this.app = Global.app;

		this.app.register('ajax getter', function(sandbox) {
			var self = {};

			self.testAjaxGet = function(uri) {
				return sandbox.ajax.get(uri);
			};

			self.testAjaxGetCallback = function(uri, callback) {
				return sandbox.ajax.get(uri, callback);
			};

			return self;
		});

		this.app.start('ajax getter');
	},

	teardown: function() {
		this.app.unregister('ajax getter');
	}
});

test('When it is called with a url and a CallBack Method', function() {
	var url = 'http://www.example.com/test.xml',
		callbackWasCalled = false;

	app.module('ajax getter').instance.testAjaxGetCallback(url, function(responseText, xhr) {
		callbackWasCalled = true;
	});

	assertThat(XMLHttpRequest.prototype.method, is( equalTo( 'GET' ) ), 'then it should create an ajax GET request');
	assertThat(XMLHttpRequest.prototype.url, is( equalTo( url ) ), 'and it should be directed at the correct URI');
	assertThat(callbackWasCalled, is( equalTo( true ) ), 'and the callback method should get called');
});

module('Given a [sandbox.ajax.post] method', {
	setup: function() {
		this.app = Global.app;

		this.app.register('ajax poster', function(sandbox) {
			var self = {};

			self.testAjaxPost = function(uri) {
				return sandbox.ajax.post(uri);
			};

			self.testAjaxPostCallback = function(uri, callback) {
				return sandbox.ajax.post(uri, callback);
			};

			return self;
		});

		this.app.start('ajax poster');
	},

	teardown: function() {
		this.app.unregister('ajax poster');
	}
});

test('When it is called with a url and a Callback method', function() {
	var url = 'http://www.example.com/test.xml',
		callbackWasCalled = false;

	app.module('ajax poster').instance.testAjaxPostCallback(url, function(responseText, xhr) {
		callbackWasCalled = true;
	});

	assertThat(XMLHttpRequest.prototype.method, is( equalTo( 'POST' ) ), 'then it should create an ajax POST request');
	assertThat(XMLHttpRequest.prototype.url, is( equalTo( url ) ), 'and it should be directed at the correct URI');
	assertThat(XMLHttpRequest.prototype.requestHeaders, hasMember( 'Content-type', equalTo( 'application/x-www-form-urlencoded' ) ), 'and the [Content-type] header should be set correctly');
	assertThat(callbackWasCalled, is( equalTo( true ) ), 'and the callback method should get called');
});

// then the options passed on the send method should rewrite the current ones
// then it should (async) create an ajax request and as it\'s an invalid XML, onComplete will receive null as the xml document
// then it should not overwrite the data object

// asset.image
// then it should load a image
// then it should fire the error event
// then it should fire the load event twice when loading the same image
// then it should fire the error event when the source argument is empty

// asset.css
// then it should load a css file and fire the load event

// asset.javascript
// then it should load a javascript file and fire the load event

})(this, this.document || {});
