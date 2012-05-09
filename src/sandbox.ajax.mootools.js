
app.extend('ajax', {

	loadImage: function(src, config) {
		// in reality we would load the image and wait for it to load before triggering the onComplete event			
		if (config.onComplete) {
			config.onComplete();
		}
	}

});
