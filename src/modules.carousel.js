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

