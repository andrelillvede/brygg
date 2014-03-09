var tempInterval;
Heater = function(sensor, pid){

  this.start = function(opt){
    opt = opt || {};

    var sampleTime = opt.sampleTime || 10000;
    var heaterPeriodTime = opt.heaterPeriodTime || 2000;

    var lastTemp = 0;
    var outFrac = 0;
    var isOn = false;

    tempInterval = Meteor.setInterval(function(){
      if((Date.now() - lastTemp) > sampleTime){
          console.log("readtemp")
          lastTemp = Date.now();
          outFrac = 0.5;
      }

      if(outFrac != 0 && !isOn){
        console.log('on')
        isOn = true
      }

      if(outFrac != 1 && isOn){
        Meteor.setTimeout(function(){
          console.log('off')
          isOn = false;
        }, (1-outFrac)*heaterPeriodTime)
      }

    }, heaterPeriodTime)

  }

  this.stop = function(){
    Meteor.clearInterval(tempInterval);
    console.log('turn off')
  }

};
