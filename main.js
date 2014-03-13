var express = require('express');
var net = require('net');
var JsonSocket = require('json-socket');
var array = require('array');
var PID = require('./pid')

var app = express();
app.configure(function () {
    app.use(
        "/", //the URL throught which you want to access to you static content
        express.static(__dirname + '/public') //where your static content is located in your filesystem
    );
});

var queue = array();

var port = 9838;
var server = net.createServer();
server.listen(port);

var s;
server.on('connection', function(socket) { //This is a standard net.Socket
  socket = new JsonSocket(socket); //Now we've decorated the net.Socket to be a JsonSocket
  s = socket;

  while(queue.length > 0){
    s.sendMessage(queue.pop());
  }

  socket.on('close', function(){
    console.log('SOCKET GOT CLOSED')
    s = undefined;
  })

});

queue.on('add', function(task) {
  if(s)
    s.sendMessage(queue.pop());
});


app.get('/', function(req,res) {
  res.sendfile('public/index.html');
});

// TEMP
// thermometer
var sensorId = '28-000004cd61a9'
var sensor = require('ds18x20');

function getTemp(){
	return sensor.get(sensorId)
}
app.get('/temp', function(req, res) {
  queue.push({type:'temp', id:'sensorId', time: Date.now(), value:getTemp()})
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ value: getTemp() }));
});


// HEATER

// heater
var Gpio = require('onoff').Gpio
var heater = new Heater();
var pid;

app.get('/heater/on', function(req, res) {
  heater.on()
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ value: heater.isOn() }));
});

app.get('/heater/off', function(req, res) {
  heater.off()
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ value: heater.isOn() }));
});

app.get('/heater/startPidHeating', function(req, res) {
	var setpoint = req.query.setpoint;
	var sampleTime = req.query.sampletime;
	var periodTime = req.query.periodtime;
	console.log(setpoint)

	pid = new PID(sampleTime, kc, ti, td, setpoint);
	startPidHeating(sampleTime, periodTime);
});

app.get('/heater/stopPidHeating', function(req, res) {
	stopPidHeating();
});



// PID
var kc;
var ti;
var td;

app.get('/pid/setParameters', function(req, res) {
  kc = req.query.kc;
  ti = req.query.ti;
  td = req.query.td
  console.log('pid parameters set')
});




app.listen(3000);
console.log('Listening on port 3000...');

var tempInterval;
function startPidHeating(sampleTime, periodTime){

  var sampleTime = sampleTime || 10000;
  var heaterPeriodTime = periodTime || 2000;

  var lastTemp = 0;
  var outFrac = 0;
  var isOn = false;

  tempInterval = setInterval(function(){
    if((Date.now() - lastTemp) > sampleTime){
      lastTemp = Date.now();
      outFrac = pid.calculate(getTemp())/100;
      
      console.log(getTemp());
    }
      console.log('output', outFrac)

    if(outFrac != 0 && !isOn){
      heater.on()
      isOn = true
    }

    if(outFrac != 1 && isOn){
      setTimeout(function(){
        heater.off()
        isOn = false;
      }, outFrac*heaterPeriodTime)
    }

  }, heaterPeriodTime)
}

function stopPidHeating(){
	clearInterval(tempInterval);
}


function Heater(){
  var relay = new Gpio(2, 'out')

  this.off = function(){
    relay.writeSync(0)
  }

  this.on = function(){
    relay.writeSync(1)
  }

  this.isOn = function(){
    return relay.readSync();
  }

};


/*

/pid/start/<temp>   (PUT)
/pid/stop           (GET)
/pid/set/<temp>     (POST)
/pid/reset          (POST)

/temp               (GET)

/heater/on          (GET)
/heater/off         (GET)

/pump/on            (GET)
/pump/off           (GET)

*/
