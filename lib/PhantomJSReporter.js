(function(context) {

  var PhantomJSReporter =  {

    name: "PhantomJS Reporter",

		done: false,

    __listeners: {},

    results: {
        modules: {},
        failed: 0,
        passed: 0,
        total: 0,
        runtime: 0,
        starttime: 0
    },

    __m: null,
    __ms: null,
    __t: null,
    __ts: null,

		__log: function(info) {
    	this.results.modules[this.__m].tests[this.__t].asserts.push(info);
    },

    __testStart: function(info) {
      this.__t = info.name;
      this.__ts = new Date();

      if (!this.results.modules[this.__m].tests[this.__t]) {
        this.results.modules[this.__m].tests[this.__t] = {
          asserts: [],
          failed: 0,
          passed: 0,
          total: 0,
          runtime: 0,
        	starttime: this.__ts
        };
      }
    },

  	__testDone: function(info) {
      // Save the results of the module
      var now  = new Date();
      this.results.modules[this.__m].tests[this.__t].failed += info.failed;
      this.results.modules[this.__m].tests[this.__t].passed += info.passed;
      this.results.modules[this.__m].tests[this.__t].total += info.total;
      this.results.modules[this.__m].tests[this.__t].runtime += (now.getTime() - this.__ts.getTime());

      this.__t = null;
      this.__ts = null;
    },

    __moduleStart: function(info) {
      this.__m = info.name;
      this.__ms = new Date();
      if (!this.results.modules[this.__m]) {
        this.results.modules[this.__m] = {
          tests: {},
          failed: 0,
          passed: 0,
          total: 0,
          runtime: 0,
        	starttime: this.__ms
        };
      }
    },

  	__moduleDone: function(info) {
      // Save the results of the module
      var now  = new Date();
      this.results.modules[this.__m].failed += info.failed;
      this.results.modules[this.__m].passed += info.passed;
      this.results.modules[this.__m].total += info.total;
      this.results.modules[this.__m].runtime += (now.getTime() - this.__ms.getTime());
      this.__m = null;
      this.__ms = null;
    },

    __begin: function() {
    },

  	__done: function(info) {
      this.results.failed += info.failed;
      this.results.passed += info.passed;
      this.results.total += info.total;
      this.results.runtime += info.runtime;

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

  context.PhantomJSReporter = PhantomJSReporter;

	if ( context.QUnit ) {

	  // export public
		QUnit.log = function() {
			PhantomJSReporter.__log.apply( PhantomJSReporter, arguments );
		};

		QUnit.testStart = function() {
			PhantomJSReporter.__testStart.apply( PhantomJSReporter, arguments );
		};

		QUnit.testDone = function() {
			PhantomJSReporter.__testDone.apply( PhantomJSReporter, arguments );
		};

		QUnit.moduleStart = function() {
			PhantomJSReporter.__moduleStart.apply( PhantomJSReporter, arguments );
		};

		QUnit.moduleDone = function() {
			PhantomJSReporter.__moduleDone.apply( PhantomJSReporter, arguments );
		};

		QUnit.begin = function() {
			PhantomJSReporter.__begin.apply( PhantomJSReporter, arguments );
		};

		QUnit.done = function() {
			PhantomJSReporter.__done.apply( PhantomJSReporter, arguments );
		};

	  return;

	}

  if ( context.jasmine ) {

		jasmine.PhantomJSReporter = function() { };

	  jasmine.PhantomJSReporter.prototype = {

	  	__currentSuite: null,

	    reportRunnerStarting: function(runner) {
		    this.startTime = new Date();

	    	PhantomJSReporter.__begin.call( PhantomJSReporter, runner );

	    	this.__currentSuite = runner.queue.blocks[0];
	    	this.reportSuiteStarting(this.__currentSuite);
	    },

	    reportSpecStarting: function(spec) {
	    	var info = { name: spec.description };

	    	if (spec.suite != this.__currentSuite) {
	    		this.__currentSuite = spec.suite;
	    		this.reportSuiteStarting(this.__currentSuite);
	    	}

	    	PhantomJSReporter.__testStart.call( PhantomJSReporter, info );
	    },

	    reportSpecResults: function(spec) {
				var result = spec.results();

				var info = {
					name: spec.description,
					failed: result.failedCount,
					passed: result.passedCount,
					total: result.totalCount
				};

				var assertions = result.getItems(),
						i = assertions.length;

				while (i > 0) {
					this.reportAssertResults(assertions[--i]);
				}

	    	PhantomJSReporter.__testDone.call( PhantomJSReporter, info );
	    },

	    reportAssertResults: function(assertion) {
	    	var info = {
	    		message: assertion.message,
	    		actual: assertion.actual,
	    		expected: assertion.expected,
	    		result: assertion.passed()
	    	};

	    	PhantomJSReporter.__log.call( PhantomJSReporter, info );
	    },

	    reportSuiteStarting: function(suite) {
				var info = {
					name: suite.description,
					failed: 0,
					passed: 0,
					total: 0
				};

	    	PhantomJSReporter.__moduleStart.call( PhantomJSReporter, info );
	    },

	    reportSuiteResults: function(suite) {
				var info = {
					name: suite.description,
					failed: 0,
					passed: 0,
					total: 0
				};

				var specs = suite.specs(),
						i = specs.length;

				while (i > 0) {
					var spec = specs[--i],
							result = spec.results();

					info.failed = info.failed + result.failedCount;
					info.passed = info.passed + result.passedCount;
					info.total = info.total + result.totalCount;
				}

	    	PhantomJSReporter.__moduleDone.call( PhantomJSReporter, info );
	    },

	    reportRunnerResults: function(runner) {
				var info = {
					runtime: (new Date().getTime() - this.startTime.getTime()),
					failed: 0,
					passed: 0,
					total: 0
				};

				var suites = runner.suites(),
						i = suites.length;

				while (i > 0) {
					var specs = suites[--i].specs(),
							j = specs.length;

					while (j > 0) {
						var spec = specs[--j],
								result = spec.results();

						info.failed = info.failed + result.failedCount;
						info.passed = info.passed + result.passedCount;
						info.total = info.total + result.totalCount;
					}
				}

	    	PhantomJSReporter.__done.call( PhantomJSReporter, info );
	    },

	    log: function(str) {
	    	PhantomJSReporter.__log.call( PhantomJSReporter, str );
	    }
	  };

	  return;

	}

})(this);
