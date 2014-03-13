var PID = function(ts, kc, ti, td, tset){
    var xk_1 =  0.0;  // PV[k-1] = Thlt[k-1]
    var xk_2 =  0.0;  // PV[k-2] = Thlt[k-1]

    var yk = 0.0; //output
    var GMA_HLIM = 100.0; // upper output limit
    var GMA_LLIM = 0.0; // lower output limit
    var tset = tset || 69;
    var enable = true;

    var k_lpf = 0.0;
    var k0 = 0.0;
    var k1 = 0.0;

    var lpf1 = 0.0;
    var lpf2 = 0.0;

    var pp = 0.0;
    var pi = 0.0;
    var pd = 0.0;

    var kc;
    var ti;
    var td;
    var ts;

    init(ts, kc, ti, td);

    function init(ts_i, kc_i, ti_i, td_i){
        kc = kc_i; // The controller gain
        ti = ti_i; // Time-constant for the Integral Gain
        td = td_i; // Time-constant for the Derivative Gain
        ts = ts_i; // The sample period [seconds]

        if (ti == 0.0)
            k0 = 0.0
        else
            k0 = kc * ts / ti
        k1 = kc * td / ts
        lpf1 = (2.0 * k_lpf - ts) / (2.0 * k_lpf + ts)
        lpf2 = ts / (2.0 * k_lpf + ts)
    }

    this.calculate = function(xk){
        ek = 0.0
        ek = tset - xk // calculate e[k] = SP[k] - PV[k]

        if (enable){
            //-----------------------------------------------------------
            // Calculate PID controller:
            // y[k] = y[k-1] + kc*(PV[k-1] - PV[k] +
            // Ts*e[k]/Ti +
            // Td/Ts*(2*PV[k-1] - PV[k] - PV[k-2]))
            //-----------------------------------------------------------
            pp = kc * (xk_1 - xk) // y[k] = y[k-1] + Kc*(PV[k-1] - PV[k])
            pi = k0 * ek  // + Kc*Ts/Ti * e[k]
            pd = k1 * (2.0 * xk_1 - xk - xk_2)

            yk += pp + pi + pd
        }else{
            yk = 0.0
            pp = 0.0
            pi = 0.0
            pd = 0.0
        }

        xk_2 = xk_1  // PV[k-2] = PV[k-1]
        xk_1 = xk    // PV[k-1] = PV[k]

        // limit y[k] to GMA_HLIM and GMA_LLIM
        if (yk > GMA_HLIM)
            yk = GMA_HLIM
        if (yk < GMA_LLIM)
            yk = GMA_LLIM

        return yk
    }

    this.enable = function(){
        enable = true;
    }

    this.disable = function(){
        enable = false;
    }

}

module.exports = PID;
