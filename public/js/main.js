$(function() {
	updateTemp();

	$('#temperature .refresh.icon').on('click', function(){
		updateTemp();
	});

	$('#heater .on.button').on('click', function(){
		$.get( '/heater/on', function( data ) {
			console.dir(data);
		});
	});

	$('#heater .off.button').on('click', function(){
		$.get( '/heater/off', function( data ) {
			console.dir(data);
		});
	});

});

function updateTemp(){
	$.get( '/temp', function( data ) {
		$('#temperature > .large.reading').html(data.value + '&deg;')
	});
}