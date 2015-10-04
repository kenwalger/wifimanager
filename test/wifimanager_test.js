var assert = require("chai").assert;

var index = require("../lib/index");
var WifiManager = require("../lib/wifimanager");

describe("WifiManager", function (){
    it("should be an instance of a WifiManager", function(){
        assert.isTrue(index instanceof WifiManager);
        done();
    });

    describe("createAdHocNetwork() method", function(){
        it("should create an AdHoc Wirless Network", function(done) {
            WifiManager.createAdHocNetwork("MySuperIoTProject", "SuperSecretPassword", function(response){
                assert.isTrue(false);
                done();
            });
        });
    });

    describe("isConnected() method", function () {
       it("should confirm the wlan0 interface is active", function(done) {
           WifiManager.isConnected(), function (response) {
               assert.equal('up');
               done();
           };
       });
    });

    describe("isInternetConnected() method", function() {
        it("should confirm an internet connection exists", function(done) {
            WifiManager.isInternetConnected(), function (response) {
                assert.isTrue(true);
                done();
            };
        });
    });

});