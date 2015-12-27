var assert = require("chai").assert;
var expect  = require("chai").expect;
var request = require("request");

var index = require("../lib/index");
var WifiManager = require("../lib/wifimanager");
var wm = new WifiManager();

	describe("WifiManager", function (){
		it("should be an instance of a WifiManager", function(done){
			assert.isTrue(index instanceof WifiManager);
			done();
		});

    describe("createAdHocNetwork() method", function(){
        it("should create an AdHoc Wirless Network", function(done) {
            var adHoc = wm.createAdHocNetwork("MySuperIoTProject", "SuperSecretPassword");
            assert.isTrue(false);
            done();
        });
    });


    describe("isInternetConnected() method", function() {
        it("should confirm an internet connection exists", function(done) {
            var isConnected = wm.isInternetConnected();
            expect(isConnected).to.equal(true);
        });
    });

    describe("interfaceConnectionState() method", function() {
        it("should confirm the status of a network interface", function(done) {
            var interface = "" + vm.interfaceConnectionState('eth0');
            expect(interface.replace(/\n*$/, '')).to.equal('up');
            done();
        });
    });
});