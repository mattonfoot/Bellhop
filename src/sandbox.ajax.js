(function(Global, document, undefined) {

/* element helpers */

function getByTagName(tag, scope) {
	scope = scope || document;

	return scope.getElementsByTagName(tag);
}

/* Form Serialization helpers */

function collect(tag, f) {
	var a = getByTagName(tag, f), n = [], i = 0;

	for (; i < a.length; i++) {
		var v = f(a[i]);

		if (v !== null) {
			n.push(v);
		}
	}

	return n;
}

function serializeForm(f) {
	var nv = function(e) {
		if (e.name) {
			return encodeURIComponent(e.name) + '=' + encodeURIComponent(e.value);
		} else {
			return '';
		}
	};

	var i = collect('input', function(i) {
		if((i.type != 'radio' && i.type != 'checkbox') || i.checked) {
			return nv(i);
		}
	});
	var s = collect('select', nv);
	var t = collect('textarea', nv);

	return i.concat(s).concat(t).join('&');
}

/* XHR object */

var getXHR = function() {
	var http;

	try {
		http = new XMLHttpRequest();

		getXHR = function() {
			return new XMLHttpRequest();
		};
	}
	catch(e) {
		var msxml = [ 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP' ];

		for (var i=0, len = msxml.length; i < len; ++i) {
			try {
				http = new ActiveXObject(msxml[i]);

				getXHR = function() {
					return new ActiveXObject(msxml[i]);
				};

				break;
			}
			catch(e) {}
		}
	}

	return http;
};

function sendXHR(url, method, postData, callback, error) {
	var x = getXHR();

	x.open(method, url, true);

	x.onreadystatechange = function() {
		if (x.readyState == 4) {
			if (x.status == 200 && callback) {
				callback(x.responseText, x);
				return;
			}

			if (error) {
				error(x.responseText, x);
			}
		}
	};

	x.setRequestHeader('X-Requested-With','XMLHttpRequest');

	if (method == 'POST') {
		x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	}

	x.send(postData);
}

/* API */

app.extend('ajax', {

	get: function(url, callback) {
		sendXHR(url, 'GET', null, callback);
	},

	/* Syncronous Get - left out until someone actually needs it
	gets: function(url)
		var x = getXHR();
		x.open('GET', url, false);
		x.sendXHR(null);

		return x.responseText;
	},
	*/

	post: function(url, callback, postData) {
		sendXHR(url, 'POST', postData, callback);
	},

	update: function(url, elm) {
		var e = $(elm);
		var f = function(r) {
			e.innerHTML = r;
		};

		sendXHR(url, 'GET', null, f);
	},

	submit: function(url, elm, frm) {
		var e = $(elm);
		var f = function(r) {
			e.innerHTML = r;
		};

		sendXHR(url, 'POST', serializeForm(frm), f);
	}

});

app.extend('asset', {

	image: function(src, callback, error) {
		var el = app.dom.create('img');

		app.domevents.add(el, 'load', function(e) {
			if (callback) {
				callback(src, el);
			}
		});
		app.domevents.add(el, 'error', function(e) {
			if (error) {
				error(src, el);
			}
		});

		el.src = src;
	},

	css: function(src, callback) {
		var link = app.dom.create('link', { type:'text/css', rel:'stylesheet', href:src });

		app.dom.append(link, getByTagName('head')[0]);

		// sendXHR(src, callback, 'GET'); // is this better?

		app.asset.image(src, null, callback);

/*
		var img = document.createElement('img');
		app.domevents.add(img, 'error', function(e) {
			if (callback) {
				callback(src, link);
			}
		});
		img.src = src;
*/
	}

});

})(this, this.document || {});
