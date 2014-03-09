
Readings = new Meteor.Collection('readings');

if(Meteor.isServer){
  Meteor.startup(function(){
    Readings.remove({});
  })
}

Thermo = function(id){
  var loggerInterval;

  var self = this;

  this.readTemp = function(){
    return Meteor.call('getTemp', id);
  }

  this.startLogger = function(logName, interval){

    loggerInterval = Meteor.setInterval(function(){
      Meteor.call('insertReading', id, logName)
    }, interval);
    return
  },

  this.stopLogger = function(){
    Meteor.clearInterval(loggerInterval);
  }
}

Meteor.methods({
  getTemp: function(id){
    if(!this.isSimulation){
      var sensor = Npm.require('ds18x20');
      return sensor.get(id);
    }
  },
  insertReading: function(id, logName){
    if(!this.isSimulation){
      var now = Math.round(Date.now()/1000);
      Readings.insert({sensor:id, logId:logName, x:now, y:Meteor.call('getTemp', id)})
    }
  }
})
