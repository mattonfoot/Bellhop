(function(Global, document) {

var mq = {};
var uniqs = {};

app.extend('mq', {

	publish: function(ev, params) {
		if (mq[ev] && !uniqs[ev]) {
			var queue = mq[ev], i = 0, len = queue.length;

			for ( ; i < len; i++ ) {
				queue[i].call({}, params);
			}
		}
	},

	once: function(ev, params) {
		if (uniqs[ev]) {
			return;
		}

		this.publish(ev, params);

		uniqs[ev] = params;
	},

	subscribe: function(ev, handler) {
		if (uniqs[ev]) {
			handler.call({}, uniqs[ev]);

			return;
		}

		if (!mq[ev]) {
			mq[ev] = [];
		}

		mq[ev].push(handler);
	}

});

})(this, this.document);
