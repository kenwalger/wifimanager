/**
 *
 * Basic WiFi Manager for Linux based systems, like Raspberry Pi.
 * For network generation the generation is:
 *
 * 1. Generate the configuration file based on passed in SSID & network password.
 * 2. Start the HOSTAPD service based on the configuration file.
 * 3. Start the DHCP service.
 *
 *
 * Created by Ken W. Alger on 6/16/2015.
 */

var fs = require('fs');


function WifiManager(){

}

WifiManager.prototype.createAdHocNetwork = function(ssid, password, callback){
    var response = "Network " + ssid + " started.";
    callback.call(this, response);
};

WifiManger.prototype.stopAdHocNetwork = function(ssid, callback) {

    var response = "Network " + ssid + " stopped."
    callback.call(this, response);
}


// Print out error messages
function printError(error) {
    console.error(error.message);
}

module.exports = WifiManager;