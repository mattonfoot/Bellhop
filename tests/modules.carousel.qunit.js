(function(window, laterooms, undefined) {
	
module('LateRooms Carousel Setup');

asyncTest('Initialing the carousel should load the first image frame within 500ms', function() {
	
	var carousel = laterooms.carousel();
	
	setTimeout(function() {
		
		var frameslide = document.getElementById('tr-frameslide');
		
		assertThat( frameslide.children.length, is( equalTo( 1 ) ) );
		
		start();
		
	}, 500);
	
});

})(this, this.laterooms || {});
