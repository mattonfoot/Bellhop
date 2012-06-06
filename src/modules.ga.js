
(function(Global, document, undefined) {

Global.app.register('ga', function(sandbox) {

	return {
		domready: function() {

			var _gaq = Global._gaq = [], t = 'script', g;

			_gaq.push(['_setAccount', 'UA-XXXXX-X']);
			_gaq.push(['_trackPageview']);

			g = document.createElement(t);
			s = document.getElementsByTagName(t)[0];
			g.src = '//www.google-analytics.com/ga.js';
			s.parentNode.insertBefore(g, s);

		}
	};
});

})(this, this.document || {});
