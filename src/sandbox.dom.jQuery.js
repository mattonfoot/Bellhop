
app.extend('dom', {

	create: function(el, props) {
		var el = $('<' + el + '/>');
		return el.attr(props || {})[0];
	},

	append: function(what, where) {
		return $(what).appendTo(where)[0];
	},

	prepend: function(what, where) {
		return $(what).prependTo(where)[0];
	},

	byId: function(id) {
		return $('#' + id)[0];
	},

	byClass: function(classname, el) {
		return $('.' + classname, el);
	},

	prop: function(el, prop, val) {
		return $(el).attr(prop, val)[0];
	}

});
