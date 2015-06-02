var assert = require("chai").assert;

var wifimanager = require("../lib/index");
var WifiManager = require("../lib/wifimanager");
describe("WifiManager", function (){
    it("should be an instance of a WifiManager", function(){
       assert.isTrue(wifimanager instanceof WifiManager);
    });

    describe("createAdHocNetwork", function(){
        it("should create an AdHoc Wirless Netowrk", function(done) {
            wifimanager.createAdHocNetwork("MySuperIoTPorject", "SuperSecretPassword", function(response){
                assert.isTrue(false);
                done();
            });
        });
    });
});