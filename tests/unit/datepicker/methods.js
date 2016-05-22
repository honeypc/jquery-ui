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

module( "datepicker: methods", {
	setup: setupDatepicker,
	teardown: teardownDatepicker
} );

test( "destroy", function( assert ) {
	expect( 3 );

	var input = $( "<input>" ).appendTo( "#qunit-fixture" );

	assert.domEqual( input, function() {
		input.datepicker();
		ok( input.attr( "aria-owns" ), "aria-owns attribute added" );
		ok( input.attr( "aria-haspopup" ), "aria-haspopup attribute added" );
		input.datepicker( "destroy" );
	} );
} );

test( "enable / disable", function() {
	expect( 10 );

	element.datepicker( "disable" );
	ok( element.datepicker( "option", "disabled" ), "disabled option is set" );
	ok( widget.hasClass( "ui-datepicker-disabled" ), "has disabled widget class name" );
	ok( element.hasClass( "ui-state-disabled" ), "has disabled state class name" );
	equal( element.attr( "aria-disabled" ), "true", "has ARIA disabled" );
	equal( element.attr( "disabled" ), "disabled", "input disabled" );

	element.datepicker( "enable" );
	ok( !element.datepicker( "option", "disabled" ), "enabled after enable() call" );
	ok( !widget.hasClass( "ui-datepicker-disabled" ), "no longer has disabled widget class name" );
	ok( !element.hasClass( "ui-state-disabled" ), "no longer has disabled state class name" );
	equal( element.attr( "aria-disabled" ), "false", "no longer has ARIA disabled" );
	equal( element.attr( "disabled" ), undefined, "input no longer disabled" );
} );

test( "widget", function() {
	expect( 1 );

	deepEqual( $( "body > .ui-front" )[ 0 ],  widget[ 0 ] );
	widget.remove();
} );

test( "open / close", function() {
	expect( 7 );

	ok( widget.is( ":hidden" ), "calendar hidden on init" );

	element.datepicker( "open" );
	ok( widget.is( ":visible" ), "open: calendar visible" );
	equal( widget.attr( "aria-hidden" ), "false", "open: calendar aria-hidden" );
	equal( widget.attr( "aria-expanded" ), "true", "close: calendar aria-expanded" );

	element.datepicker( "close" );
	ok( !widget.is( ":visible" ), "close: calendar hidden" );
	equal( widget.attr( "aria-hidden" ), "true", "close: calendar aria-hidden" );
	equal( widget.attr( "aria-expanded" ), "false", "close: calendar aria-expanded" );
} );

test( "value", function() {
	expect( 4 );

	element.datepicker( "value", "1/1/14" );
	equal( element.val(), "1/1/14", "input's value set" );

	element.datepicker( "open" );
	ok(
		widget.find( "button[data-timestamp]" ).eq( 0 ).hasClass( "ui-state-active" ),
		"first day marked as selected"
	);
	equal( element.datepicker( "value" ), "1/1/14", "getter" );

	element.val( "abc" );
	strictEqual( element.datepicker( "value" ), null, "Invalid values should return null." );
} );

test( "valueAsDate", function( assert ) {
	expect( 6 );

	var date = new Date( 2008, 6 - 1, 4 );

	element.datepicker( "valueAsDate", new Date( 2014, 0, 1 ) );
	equal( element.val(), "1/1/14", "Input's value set" );
	ok(
		widget.find( "button[data-timestamp]" ).eq( 0 ).hasClass( "ui-state-active" ),
		"First day marked as selected"
	);
	assert.dateEqual( element.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ), "Getter" );

	element.val( "a/b/c" );
	equal( element.datepicker( "valueAsDate" ), null, "Invalid dates return null" );

	teardownDatepicker();
	setupDatepicker();

	strictEqual( element.datepicker( "valueAsDate" ), null, "Set date - default" );
	element.datepicker( "valueAsDate", date );
	assert.dateEqual( element.datepicker( "valueAsDate" ), date, "Set date - 2008-06-04" );
} );

test( "isValid", function() {
	expect( 2 );

	element.val( "1/1/14" );
	ok( element.datepicker( "isValid" ) );

	element.val( "1/1/abc" );
	ok( !element.datepicker( "isValid" ) );
} );

} );
