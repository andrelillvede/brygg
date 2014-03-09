/**
* Simulator
* Simulate the PID controller
*
* @method simulate
* @param {Number} temp Point temperature
*/
simulate = function (ts, kc, ti, td, setpoint) {
  opt = opt || {}
  var tempData = [];
  var outputData = [];

  var P = 2000; // Max effect
  var cWater = 4183.2; // Heat capacity J/(kg*°C)
  var m = 20.0; // Weigh of the water (kg)
  var Ta = 25; // Temperature of the environment (your room, etc.) (°C)
  var Rth = 0.024; // Thermal conductivity, total thermal resistance between
  // the water and the surrounding ambient (°C/W)
  // List: http://www.engineeringtoolbox.com/thermal-conductivity-d_429.html

  var StopTime = 3600*2; // Total time of the simulation (s)
  var deltaT; // Delta temperature
  var T0 = 18; // Start temperature of the water (°C)
  var Takt = T0; // Actual temperature of the water (°C)
  var dt = 10; // Discrete time step (s)
  var Pactual;
  var t;
  var k;
  var controller;

  // Create a new controller
  controller = new PID(ts, kc, ti, td, setpoint);

  // Simulate
  for (k = 0; k < (StopTime / dt); k++) {
    t = k * dt; // Calculate the actual time

    // Calculate the actual power
    pidFract = controller.calculate(Takt)*0.01;
    Pactual = pidFract*P;

    // Delta Temperature in the k. step
    deltaT = (Pactual - (Takt - Ta) / Rth) * dt / (cWater * m);
    Takt += deltaT;

    // Write every 60 timesteps (minute).
    if (t % (60) === 0) {
      tempData.push({x:t/60, y:Takt})
      outputData.push({x:t/60, y:pidFract*100})
    }
  }

  return {
    tempData: tempData,
    outputData: outputData
  }
};
