
app.extend('domevents', {
	
	add: function(el, ev, handler) {
		return el.addEvent(ev, handler);
	}

});
