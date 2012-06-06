(function() {
	
var mq = {};

app.extend('mq', {
	
	publish: function(ev, params) {
		if (mq[ev]) {
			var queue = mq[ev], i = 0, len = queue.length;
			
			for ( ; i < len; i++ ) {
				queue[i].call({}, params);
			}
		}
	},
	
	subscribe: function(ev, handler) {
		if (!mq[ev]) {
			mq[ev] = [];
		}
		
		mq[ev].push(handler);
	}

});

})();
