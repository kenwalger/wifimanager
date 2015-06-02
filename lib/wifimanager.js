function WifiManager(){

}

WifiManager.prototype.createAdHocNetwork = function(ssid, password, callback){
    var response = "Some helpful response";
    callback.call(this, response);
};

module.exports = WifiManager;