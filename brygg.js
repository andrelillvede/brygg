

// Meteor.methods({
//   getTemp: function(id){
//     if(this.isSimulation)
//       return 'CLIENT LOLLED'
//     else
//       return 'SERVER LOLLED'
//   }
// });

var thermometers = {
  'one': '28-000004cd61a9'
}

if (Meteor.isClient) {

  Template['temp1'].rendered = function(){
    var thermo = new Thermo(thermometers['one']);
    var logName = Random.id();

    thermo.startLogger(logName, 1000);


    // set up our data series with start point
    var seriesData = [{x:Math.round(Date.now()/1000), y:0}];

    var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

    // instantiate our graph!
    var graph = new Rickshaw.Graph( {
      element: document.getElementById("graph"),
      // width: 900,
      height: 500,
      renderer: 'area',
      stroke: true,
      preserve: true,
      // interpolation: 'linear',
      series: [
        {
          color: palette.color(),
          data: seriesData,
          name: 'Temperature'
        }
      ]
    } );

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

    var query = Readings.find({sensor: thermometers['one'], logId: logName});
    var handle = query.observeChanges({
      added: function (id, fields) {
        console.log('added')
        seriesData.push({x:fields.x, y:fields.y})
        graph.update();
      }
    });
  }

}
