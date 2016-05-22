define( [
	"jquery",
	"ui/widgets/datepicker"
], function( $ ) {

var element, widget,
	setupDatepicker = function() {
		element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		widget = element.datepicker( "widget" );
	},
	teardownDatepicker = function() {
		element.datepicker( "destroy" ).val( "" );
	};

module( "datepicker: core", {
	setup: setupDatepicker,
	teardown: teardownDatepicker
} );

test( "input's value determines starting date", function() {
	expect( 3 );

	element = $( "<input>" ).appendTo( "#qunit-fixture" );
	element.val( "1/1/14" ).datepicker();
	widget = element.datepicker( "widget" );

	element.datepicker( "open" );

	equal( widget.find( ".ui-calendar-month" ).html(), "January", "correct month displayed" );
	equal( widget.find( ".ui-calendar-year" ).html(), "2014", "correct year displayed" );
	equal( widget.find( ".ui-state-active" ).html(), "1", "correct day highlighted" );
} );

asyncTest( "base structure", function() {
	expect( 5 );

	element.focus();

	setTimeout( function() {
		ok( widget.is( ":visible" ), "Datepicker visible" );
		equal( widget.children().length, 3, "Child count" );
		ok( widget.is( ".ui-calendar" ), "Class ui-calendar" );
		ok( widget.is( ".ui-datepicker" ), "Class ui-datepicker" );
		ok( widget.is( ".ui-front" ), "Class ui-front" );

		element.datepicker( "close" );
		start();
	}, 50 );
} );

asyncTest( "Keyboard handling: input", function( assert ) {
	expect( 10 );

	var instance;

	function step1() {
		ok( !widget.is( ":visible" ), "datepicker closed" );

		element.focus();
		setTimeout( function() {
			ok( widget.is( ":visible" ), "Datepicker opens when receiving focus" );
			teardownDatepicker();
			step2();
		}, 100 );
	}

	function step2() {
		setupDatepicker();

		ok( !widget.is( ":visible" ), "datepicker closed" );

		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		setTimeout( function() {
			ok( widget.is( ":visible" ), "Keystroke up opens datepicker" );
			teardownDatepicker();
			step3();
		}, 100 );
	}

	function step3() {
		setupDatepicker();
		instance = element.datepicker( "instance" );

		// Enter = Select preset date
		element
			.val( "1/1/14" )
			.datepicker( "refresh" )
			.datepicker( "open" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		assert.dateEqual( element.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ),
			"Keystroke enter - preset" );

		element
			.val( "" )
			.datepicker( "open" );
		ok( instance.isOpen, "datepicker is open before escape" );

		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		ok( !instance.isOpen, "escape closes the datepicker" );

		element
			.val( "1/1/14" )
			.datepicker( "open" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		assert.dateEqual( element.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ),
			"Keystroke esc - preset" );

		element
			.val( "1/1/14" )
			.datepicker( "open" )
			.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } )
			.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		assert.dateEqual( element.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ),
			"Keystroke esc - abandoned" );

		element
			.val( "1/2/14" )
			.simulate( "keyup" );
		assert.dateEqual( element.datepicker( "valueAsDate" ), new Date( 2014, 0, 2 ),
			"Picker updated as user types into input" );

		start();
	}

	step1();
} );

// TODO: implement
test( "ARIA", function() {
	expect( 0 );
} );

asyncTest( "mouse", function( assert ) {
	expect( 4 );

	element.datepicker( "open" );

	setTimeout( function() {
		element.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		$( ".ui-calendar-calendar tbody button:contains(12)", widget ).simulate( "mousedown", {} );
		assert.dateEqual(
			element.datepicker( "valueAsDate" ),
			new Date( 2008, 4 - 1, 12 ),
			"Mouse click - preset"
		);

		element.val( "" ).datepicker( "refresh" );
		element.simulate( "click" );
		strictEqual( element.datepicker( "valueAsDate" ), null, "Mouse click - close" );

		element.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		element.simulate( "click" );
		assert.dateEqual(
			element.datepicker( "valueAsDate" ),
			new Date( 2008, 4 - 1, 4 ),
			"Mouse click - close + preset"
		);

		element.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		widget.find( "a.ui-calendar-prev" ).simulate( "click" );
		element.simulate( "click" );
		assert.dateEqual(
			element.datepicker( "valueAsDate" ),
			new Date( 2008, 4 - 1, 4 ),
			"Mouse click - abandoned"
		);

		start();
	}, 100 );
} );

} );
