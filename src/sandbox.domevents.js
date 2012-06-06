(function(Global, document, undefined) {

var setListener = function (el, ev, fn) {
	if (el.addEventListener) {
		setListener = function (el, ev, fn) {
			el.addEventListener(ev, fn, false);
		};
	} else if (el.attachEvent) {
		setListener = function (el, ev, fn) {
			el.attachEvent('on' + ev, fn);
		};
	} else {
		setListener = function (el, ev, fn) {
			el['on' + ev] =  fn;
		};
	}
	
	setListener(el, ev, fn);
};
	
app.extend('domevents', {
	
	add: function(el, ev, handler) {
		setListener(el, ev, handler);
	}

});

})(this, this.document || {});