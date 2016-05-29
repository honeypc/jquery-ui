define( [
	"jquery",
	"ui/widgets/datepicker"
], function( $ ) {

var element, widget;

module( "datepicker: events", {
	setup: function() {
		element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		widget = element.datepicker( "widget" );
	},
	teardown: function() {
		element.datepicker( "destroy" ).val( "" );
	}
} );

test( "beforeOpen", function() {
	expect( 3 );

	element.datepicker( {
		beforeOpen: function() {
			ok( true, "beforeOpen event fired before open" );
			ok( element.datepicker( "widget" ).is( ":hidden" ), "calendar hidden on beforeOpen" );
		},
		open: function() {
			ok( element.datepicker( "widget" ).is( ":visible" ), "calendar open on open" );
		}
	} );

	element
		.datepicker( "open" )
		.datepicker( "close" )
		.datepicker( "option", {
			beforeOpen: function() {
				return false;
			},
			open: function() {
				ok( false, "calendar should not open when openBefore is canceled" );
			}
		} )
		.datepicker( "open" );
} );

test( "change", function() {
	expect( 4 );

	var shouldFire;

	element.datepicker( {
		change: function( event ) {
			ok( shouldFire, "change event fired" );
			equal(
				event.type,
				"datepickerchange",
				"change event"
			);
		}
	} );

	shouldFire = true;
	element.datepicker( "open" );
	widget.find( "tbody button" ).eq( 1 ).simulate( "mousedown" );

	shouldFire = false;
	element.datepicker( "open" );
	widget.find( "tbody button" ).eq( 1 ).simulate( "mousedown" );

	shouldFire = true;
	element.datepicker( "open" );
	widget.find( "tbody button" ).eq( 2 ).simulate( "mousedown" );
} );

test( "close", function() {
	expect( 4 );

	var shouldFire;

	element.datepicker( {
		close: function() {
			ok( shouldFire, "close event fired" );
		}
	} );

	shouldFire = false;
	element.datepicker( "open" );
	shouldFire = true;
	element.datepicker( "close" );

	shouldFire = false;
	element.datepicker( "open" );
	shouldFire = true;
	$( "body" ).trigger( "mousedown" );

	shouldFire = false;
	element.datepicker( "open" );
	shouldFire = true;
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );

	shouldFire = false;
	element.datepicker( "open" );
	shouldFire = true;
	widget.find( "tbody tr:first button:first" ).simulate( "mousedown" );
} );

test( "open", function() {
	expect( 2 );

	element.datepicker( {
		open: function() {
			ok( true, "open event fired on open" );
			ok( widget.is( ":visible" ), "calendar open on open" );
		}
	} );

	element.datepicker( "open" );
} );

asyncTest( "select", function() {
	expect( 4 );

	var message = "";

	element.datepicker( {
		select: function( event ) {
			ok( true, "select event fired " + message );
			equal(
				event.originalEvent.type,
				"calendarselect",
				"select originalEvent " + message
			);
		}
	} );

	function step1() {
		message = "on calendar cell click";
		element
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout( function() {
			widget.find( "tbody tr:first button:first" ).simulate( "mousedown" );
			element.datepicker( "close" );
			step2();
		}, 100 );
	}

	function step2() {
		message = "on calendar cell enter";
		element
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout( function() {
			$( document.activeElement )
				.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			element.datepicker( "close" );
			step3();
		}, 100 );
	}

	function step3() {
		message = "on calendar escape (not expected)";
		element
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			element.datepicker( "close" );
			start();
		}, 100 );
	}

	step1();
} );

} );
