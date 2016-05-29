define( [
	"jquery",
	"./helper",
	"ui/widgets/calendar"
], function( $, testHelper ) {

var element;

module( "calendar: events", {
	setup: function() {
		element = $( "#calendar" ).calendar();
	}
} );

test( "change", function() {
	expect( 6 );

	var shouldFire, eventType;

	element.calendar( {
		change: function( event ) {
			ok( shouldFire, "change event fired" );
			equal(
				event.type,
				"calendarchange",
				"change event"
			);
			equal(
				event.originalEvent.type,
				eventType,
				"select originalEvent on calendar button " + eventType
			);
		}
	} );

	shouldFire = true;
	eventType = "mousedown";
	element.find( "tbody button" ).last().simulate( eventType );

	shouldFire = true;
	eventType = "keydown";
	testHelper.focusGrid( element )
		.simulate( eventType, { keyCode: $.ui.keyCode.HOME } )
		.simulate( eventType, { keyCode: $.ui.keyCode.ENTER } );

	shouldFire = false;
	eventType = "mousedown";
	element.find( "tbody button" ).first().simulate( eventType );
} );

asyncTest( "select", function() {
	expect( 6 );

	var message, eventType;

	element.calendar( {
		select: function( event ) {
			ok( true, "select event fired " + message );
			equal(
				event.type,
				"calendarselect",
				"select event " + message
			);
			equal(
				event.originalEvent.type,
				eventType,
				"select originalEvent " + message
			);
		}
	} );

	function step1() {
		setTimeout( function() {
			eventType = "mousedown";
			message = "on calendar button " + eventType;
			element.find( "table button:eq(1)" ).simulate( eventType );
			step2();
		}, 50 );
	}

	function step2() {
		setTimeout( function() {
			eventType = "keydown";
			message = "on calendar button " + eventType;
			testHelper.focusGrid( element )
				.simulate( eventType, { keyCode: $.ui.keyCode.END } )
				.simulate( eventType, { keyCode: $.ui.keyCode.ENTER } );
			step3();
		}, 50 );
	}

	// This should not trigger another event
	function step3() {
		setTimeout( function() {
			element.calendar( "disable" );
			element.find( "table button:eq(10)" ).simulate( "mousedown" );
			start();
		}, 50 );
	}

	step1();
} );

} );
