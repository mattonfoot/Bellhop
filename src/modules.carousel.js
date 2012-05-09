app.register('carousel', function(sandbox) {

	// plugins
	
	var dom = sandbox.dom;
	var domstyle = sandbox.domstyle;
	var domevents = sandbox.domevents;
	var effects = sandbox.effects;
	var ajax = sandbox.ajax;
	
	// privates

	function newFrame(hotelObj) {
		var frame = dom.create('div', { 'class': 'tr-frame' });

		var htmlStr = '<a href="' + hotelObj.FriendlyName + '" rel="nofollow">' +
				  '    <img src="' + hotelObj.Image + '" />' +
				  '    <div class="tr-detailsbg"></div>' +
				  '    <div class="tr-details">' +
				  '        <div class="tr-slot">' +
				  '            <div class="tr-hotelname">' + hotelObj.Name + '</div>' +
				  '            <div class="tr-location">' + hotelObj.Location + '</div>' +
				  '        </div>' +
				  '        <div class="tr-slot2">' +
				  '            <div class="tr-from">' + pricesFrom + '</div>' +
				  '            <div class="tr-price">' + hotelObj.FormattedPrice + '</div>' +
				  '        </div>' +
				  '    </div>' +
				  '</a>';
	
		dom.prop(frame, 'html', htmlStr);
	
		return frame;
	}

	function prependNewFrame(resource, frameSlide, detailsbg, loader) {		
		dom.prepend(newFrame(resource), frameSlide);		
		effects.fade(detailsbg, 0.6); // should be in CSS
		effects.hide(loader);
		// resource.Loaded = true;
	}

	function showHideArrows(o, arrowRgt, arrowLft) {
		domstyle.set(arrowRgt, 'display', (o.pos == (o.max + 1)) ? 'none' : '');
		
		domstyle.set(arrowLft, 'display', (o.pos == o.min) ? 'none' : '');
	}
					
	function displayNextSlide(o, res, frameSlide, arrowRgt, arrowLft, detailsbg, loader) {
		o.nPos = o.pos - 1;
		o.nIndex = o.index;
		
		effects.show(loader);
		
		ajax.loadImage(res[o.nIndex].Image, {
			onComplete: function() {
				prependNewFrame(res[o.nIndex], frameSlide, detailsbg, loader);

				effects.tween(frameSlide, 'margin-left', o.nPos * o.wid);
			}
		});
		
		o.index++;
		o.pos--;
		
		showHideArrows(o, arrowRgt, arrowLft);
	}
	
	function displayPreviousSlide(o, frameSlide, arrowRgt, arrowLft) {
		if (o.pos < o.min) {
			o.index--;
			o.nPos = o.pos + 1;
			
			effects.tween(frameSlide, 'margin-left', o.nPos * o.wid);
			
			o.pos++;
			
			showHideArrows(o, arrowRgt, arrowLft);
		}
	}
	
	// exports
	
	return {
		
		topratedload: null,
		loader: null,
		frameSlide: null,
		detailsbg: null,
		arrowRgt: null,
		arrowLft: null,
		
		res: res,
		
		o: {
			pos: 0,
			index: 0,
			total: res.length, // defined in data.topratedhotels.js
			min: 0,
			max: (res.length * -1), // defined in data.topratedhotels.js
			wid: 430,
			nPos: 0,
			nIndex: 0
		},
		
		start: function() {
			var self = this;
			
			// logic
			
			this.topratedload = dom.byId('toprateload');
			
			if (this.topratedload) {
				this.loader = effects.fade(this.topratedload, 0.6);
				
				this.frameSlide = domstyle.set(dom.byId('tr-frameslide'), 'width', (this.o.total * this.o.wid) + 'px');
				this.detailsbg = dom.byClass('.tr-detailsbg');
				this.arrowRgt = dom.byId('arrow-rgt');
				this.arrowLft = dom.byId('arrow-lft');
				
				domevents.add(this.arrowRgt, 'click', function() {
					displayNextSlide(self.o, self.res, self.frameSlide, self.arrowRgt, self.arrowLft, self.detailsbg, self.loader);
				});
				
				domevents.add(this.arrowLft, 'click', function() {
					displayPreviousSlide(self.o, self.frameSlide, self.arrowRgt, self.arrowLft);
				});
				
				if (this.o.total > 0) {
					effects.show(this.loader);
					
					ajax.loadImage(this.res[this.o.nIndex].Image, {
						onComplete: function() {
							prependNewFrame(self.res[0], self.frameSlide, self.detailsbg, self.loader);
							self.o.index++;
						}
					});
				}

				showHideArrows(this.o, this.arrowRgt, this.arrowLft);
			}
		},
					
		displayNextSlide: function(o, res, frameSlide, arrowRgt, arrowLft, detailsbg, loader) {
			this.o.nPos = this.o.pos - 1;
			this.o.nIndex = this.o.index;
			
			effects.show(this.loader);
			
			ajax.loadImage(this.res[this.o.nIndex].Image, {
				onComplete: function() {
					prependNewFrame(this.res[this.o.nIndex], this.frameSlide, this.detailsbg, this.loader);

					effects.tween(this.frameSlide, 'margin-left', this.o.nPos * this.o.wid);
				}
			});
			
			o.index++;
			o.pos--;
			
			showHideArrows(o, arrowRgt, arrowLft);
		},
		
		stop: function(sandbox) {
		}
	}
});

/*
(function(window, laterooms, undefined) {

laterooms.carousel = function() {
	
    if ($('toprateload')) {
        var loader = $('toprateload').fade(0.6);
        var o = {
            pos: 0,
            index: 0,
            total: res.length,
            min: 0,
            max: (res.length * -1),
            wid: 430,
            nPos: 0,
            nIndex: 0
        };

        var frameSlide = $('tr-frameslide').setStyle('width', (o.total * o.wid) + 'px');
        
        $('arrow-rgt').addEvent('click', function() {
            o.nPos = o.pos - 1;
            o.nIndex = o.index;
            loader.show();
            new Asset.images(res[o.nIndex].Image, {
                onComplete: function() {
                    newFrame(res[o.nIndex]).inject(frameSlide);
                    $$('.tr-detailsbg').fade(0.6);
                    loader.hide();
                    frameSlide.tween('margin-left', o.nPos * o.wid);
                    res[o.nIndex].Loaded = true;
                }
            });
            o.index++;
            o.pos--;
            showHideArrows();
        });

        $('arrow-lft').addEvent('click', function() {
            if (o.pos < o.min) {
                o.index--;
                o.nPos = o.pos + 1;
                frameSlide.tween('margin-left', o.nPos * o.wid);
                o.pos++;
                showHideArrows();
            }
        });

        if (o.total > 0) {
            loader.show();
            new Asset.images(res[0].Image, {
                onComplete: function() {
                    newFrame(res[0]).inject(frameSlide);
                    $$('.tr-detailsbg').fade(0.6);
                    loader.hide();
                    res[0].Loaded = true;
                    o.index++;
                }
            });
        }

        function showHideArrows() {
            if (o.pos == (o.max + 1)) $('arrow-rgt').setStyle('display', 'none');
            else $('arrow-rgt').setStyle('display', '');
            if (o.pos == o.min) $('arrow-lft').setStyle('display', 'none');
            else $('arrow-lft').setStyle('display', '');
        }

        function newFrame(hotelObj) {
            frame = new Element('div', {
                'class': 'tr-frame'
            });

            htmlStr = '<a href="' + hotelObj.FriendlyName + '" rel="nofollow">' +
                      '    <img src="' + hotelObj.Image + '" />' +
                      '    <div class="tr-detailsbg"></div>' +
                      '    <div class="tr-details">' +
                      '        <div class="tr-slot">' +
                      '            <div class="tr-hotelname">' + hotelObj.Name + '</div>' +
                      '            <div class="tr-location">' + hotelObj.Location + '</div>' +
                      '        </div>' +
                      '        <div class="tr-slot2">' +
                      '            <div class="tr-from">' + pricesFrom + '</div>' +
                      '            <div class="tr-price">' + hotelObj.FormattedPrice + '</div>' +
                      '        </div>' +
                      '    </div>' +
                      '</a>';
            frame.set('html', htmlStr);
            return frame;
        }

        showHideArrows();
	}
	
};

})(this, (this.laterooms = this.laterooms || {}));
*/
