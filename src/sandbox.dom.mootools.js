
app.extend('dom', {
	
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
		if (el) {
			return $(el).getElements('.' + classname);
		}
		
		return $$('.' + classname);
	},
	
	prop: function(el, prop, val) {
		el.setProperty(prop, val);
		
		return el;
	}
	
});
