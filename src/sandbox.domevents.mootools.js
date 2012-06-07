
app.extend('domevents', {

	add: function(el, ev, handler) {
		return $(el).addEvent(ev, handler);
	},

	fire: function(el, ev, args, delay) {
		return $(el).fireEvent(ev, args, delay);
	}

});
