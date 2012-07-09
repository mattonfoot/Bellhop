(function(context) {

	var Reporter =  {

		name: "Console Reporter",

		done: false,

		__listeners: {},

		results: { },

		__done: function(info) {
			var report = {};

			if (_$jscoverage) {
				for (var file in _$jscoverage) {
					if (!_$jscoverage.hasOwnProperty(file)) continue;

					var coverage = _$jscoverage[file];
					report[file] = {};
					report[file].source = coverage.source;
					report[file].file = file;
					report[file].coverage = {};
					for (var i = 0; i < coverage.source.length; i++) {
						if (coverage[i] != undefined) {
							report[file].coverage[i] = coverage[i];
						}
					}

				}
			}

			this.results = report;

			this.done = true;
			this.__dispatchEvent('done');
		},

		addEventListener: function(eventId, closure) {
			if (!this.__listeners[eventId]) {
				this.__listeners[eventId] = [];
			}
			this.__listeners[eventId].push(closure);
		},

		__dispatchEvent: function(eventId) {
			var i;
			var params = [];
			for (i = 1; i < arguments.length; ++i) {
				params.push(arguments[i]);
			}

			var closures = this.__listeners[eventId];
			if (closures) {
				for (i = 0; i < closures.length; ++i) {
					closures[i].apply(window, params);
				}
			}
		}

    };

	context.Reporter = Reporter;

	if ( context.QUnit ) {

		QUnit.done = function() {
			Reporter.__done.apply( Reporter );
		};

	  return;

	}

	if ( context.jasmine ) {

		jasmine.Reporter = function() { };

		jasmine.Reporter.prototype = {
			reportRunnerResults: function(runner) {
				Reporter.__done.call( Reporter );
			}
		};

		return;

	}

})(this);
