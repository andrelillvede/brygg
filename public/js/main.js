$(function() {
	
	var tempGraph;
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


	var socket = io.connect('http://localhost:9898');
	socket.on('tasks', function (data) {
		if(data.type == "temp"){
			if(!tempGraph)
				tempGraph = new TempGraph('temp', data.time)

			updateTemp(data.value);
			tempGraph.add(data.time, data.value)
		}
	});


});

function updateTemp(temp){
	$('#temperature > .large.reading').html(temp + '&deg;')
}

function TempGraph(id, initTime){

	this.add = function(time, temp){
		seriesData.push({x: Math.round(time/1000), y:temp})
		// console.log(seriesData)
		graph.update();
	}

	// set up our data series with start point
	var seriesData = [{x:Math.round(initTime/1000), y:0}];

	var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

	// instantiate our graph!
	var graph = this.graph = new Rickshaw.Graph( {
		element: document.getElementById(id),
		// width: 900,
		height: 300,
		width: 400,
		renderer: 'area',
		stroke: true,
		preserve: true,
		// interpolation: 'linear',
		series: [{
			color: palette.color(),
			data: seriesData,
			name: 'Temperature'
		}]
	});

	graph.render();

	var hoverDetail = new Rickshaw.Graph.HoverDetail( {
		graph: graph,
		xFormatter: function(x) {
			return new Date(x * 1000).toString();
		}
	} );

	var ticksTreatment = 'glow';

	var xAxis = new Rickshaw.Graph.Axis.Time( {
		graph: graph,
		ticksTreatment: ticksTreatment,
		timeFixture: new Rickshaw.Fixtures.Time.Local()
	} );

	xAxis.render();

	var yAxis = new Rickshaw.Graph.Axis.Y( {
		graph: graph,
		tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
		ticksTreatment: ticksTreatment
	} );

	yAxis.render();
}