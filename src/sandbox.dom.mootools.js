
app.extend('dom', {

	// these plugins should wrap ECMAScript5

	create: function(el, props) {
		return document.newElement(el, props || {});
	},

	append: function(what, where) {
		return $(what).inject(where);
	},

	prepend: function(what, where) {
		return $(what).inject(where, 'top');
	},

	byId: function(id) {
		return document.id(id);
	},

	byClass: function(classname, el) {
		return this.byQuery('.' + classname, el);
	},

	prop: function(el, prop, val) {
		el.setProperty(prop, val);

		return el;
	},

	// this plugin should wrap document.querySelector / document.querySelectorAll
	// no tests as yet

	byQuery: function(query, el) {
		if (el) {
			return $(el).getElements(query);
		}

		return $$(query);
	}

});
