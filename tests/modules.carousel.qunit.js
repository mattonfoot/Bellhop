(function(window, laterooms, undefined) {
	
module('Given a framework extended with a testing sandbox and the Carousel Module Registered', {
	teardown: function() {
		app.stop();
	}
});

test('When the Carousel Module is started', function() {
	app.start();
	
	var instance = app.module('carousel').instance;
	var fixtureHTML = document.getElementById('qunit-fixture').innerHTML;

	var firstFormattedPriceIndex = fixtureHTML.indexOf('£90.00');
	var firstFriendlyNameIndex = fixtureHTML.indexOf('hotel-reviews/196952_frog-street-farmhouse-accommodation-taunton.aspx');
	var firstHotelIdIndex = fixtureHTML.indexOf('196952');
	var firstImageIndex = fixtureHTML.indexOf('http://static.laterooms.com/hotelphotos/laterooms/196952/gallery/frog-street-farmhouse-accommodation-taunton_081220091227259857.jpg');
	var firstLocationIndex = fixtureHTML.indexOf('Taunton');
	var firstNameIndex = fixtureHTML.indexOf('Frog Street Farmhouse Accommodation');

	assertThat(instance.topratedload, is( object() ), 'Then the module instance has a [topratedload] element');
	assertThat(firstFormattedPriceIndex, is( greaterThan( -1 ) ), 'and the first Price has been inserted');
	assertThat(firstFriendlyNameIndex, is( greaterThan( -1 ) ), 'and the first Friendly Name has been inserted');
	assertThat(firstHotelIdIndex, is( greaterThan( -1 ) ), 'and the first HotelId has been inserted');
	assertThat(firstImageIndex, is( greaterThan( -1 ) ), 'and the first Image has been inserted');
	assertThat(firstLocationIndex, is( greaterThan( -1 ) ), 'and the first Location has been inserted');
	assertThat(firstNameIndex, is( greaterThan( -1 ) ), 'and the first Name has been inserted');
});

/*
module('LateRooms Carousel Setup');

asyncTest('Initialing the carousel should load the first image frame within 500ms', function() {
	
	var carousel = laterooms.carousel();
	
	setTimeout(function() {
		
		var frameslide = document.getElementById('tr-frameslide');
		
		assertThat( frameslide.children.length, is( equalTo( 1 ) ) );
		
		start();
		
	}, 500);
	
});
*/

})(this, this.laterooms || {});
