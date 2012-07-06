
(function(Global, document) {

	var isPageLoaded = false, scrollIntervalId;

    function pageLoaded() {
        if (!isPageLoaded) {
            isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

			Global.app.sandbox.mq.once('domready');
        }
    }

	if (document.addEventListener) {
		//Standards. Hooray! Assumption here that if standards based,
		//it knows about DOMContentLoaded.
		document.addEventListener("DOMContentLoaded", pageLoaded, false);
		Global.addEventListener("load", pageLoaded, false);

	} else if (Global.attachEvent) {
		Global.attachEvent("onload", pageLoaded);

		testDiv = document.createElement('div');
		try {
			isTop = Global.frameElement === null;
		} catch(e) {}

		//DOMContentLoaded approximation that uses a doScroll, as found by
		//Diego Perini: http://javascript.nwbox.com/IEContentLoaded/,
		//but modified by other contributors, including jdalton
		if (testDiv.doScroll && isTop && Global.external) {
			scrollIntervalId = setInterval(function () {
				try {
					testDiv.doScroll();
					pageLoaded();
				} catch (e) {}
			}, 30);
		}
	}

	//Check if document already complete, and if so, just trigger page load
	//listeners. Latest webkit browsers also use "interactive", and
	//will fire the onDOMContentLoaded before "interactive" but not after
	//entering "interactive" or "complete". More details:
	//http://dev.w3.org/html5/spec/the-end.html#the-end
	//http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
	if (document.readyState === "complete" ||
		document.readyState === "interactive") {
		pageLoaded();
	}

})(this, this.document);
