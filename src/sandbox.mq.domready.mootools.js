
(function(Global, document) {

window.addEvent('domready', function() {
	Global.app.sandbox.mq.once('domready');
});

})(this, this.document);
