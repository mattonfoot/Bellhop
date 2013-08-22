
app.extend('domevents', {

	add: function(el, ev, handler) {
		return $(el).bind(ev, handler)[0];
	},

	fire: function(el, ev, args, delay) {
    setTimeout(function () {
      $(el).trigger(ev, args, delay);
    }, delay);
    
    return $(el)[0];
	}

});
