var assert = require("chai").assert;

var wifimanager = require("../lib/index");
var WifiManager = require("../lib/wifimanager");
var ip = require("../lib/ip");

describe("WifiManager", function (){
    it("should be an instance of a WifiManager", function(){
        assert.isTrue(wifimanager instanceof WifiManager);
        done();
    });

    describe("createAdHocNetwork() method", function(){
        it("should create an AdHoc Wirless Network", function(done) {
            wifimanager.createAdHocNetwork("MySuperIoTProject", "SuperSecretPassword", function(response){
                assert.isTrue(false);
                done();
            });
        });
    });

    describe("isConnected() method", function () {
       it("should confirm the wlan0 interface is active", function(done) {
           wifimanager.isConnected(), function (response) {
               assert.equal('up');
               done();
           };
       });
    });

    describe("isInternetConnected() method", function() {
        it("should confirm an internet connection exists", function(done) {
            wifimanager.isInternetConnected(), function (response) {
                assert.isTrue(true);
                done();
            };
        });
    });

    describe("loopback() method", function() {
        describe('undefined', function() {
            it("should respond with 127.0.0.1", function() {
                assert.equal(ip.loopback(), '127.0.0.1');
                done();
            });
        });

        describe('ipv4', function() {
            it("should respond with 127.0.0.1", function() {
                assert.equal(ip.loopback('ipv4'), '127.0.0.1');
                done();
            });
        });

        describe('ipv6', function() {
            it("should resond with fe80::1", function() {
                assert.equal(ip.loopback('ipv6'), 'fe80::1');
                done();
            });
        });
    });

    describe("isLoopback() method", function() {
        describe('127.0.0.1', function() {
            it("should respond with true", function () {
                assert.ok(ip.isLoopback('127.0.0.1'));
                done();
            });
        });

        describe('8.8.8.8', function () {
            it('should respond with false', function () {
                assert.equal(ip.isLoopback('8.8.8.8'), false);
                done();
            });
        });

        describe('fe80::1', function () {
            it('should respond with true', function () {
                assert.ok(ip.isLoopback('fe80::1'));
                done();
            });
        });

        describe('::1', function () {
            it('should respond with true', function () {
                assert.ok(ip.isLoopback('::1'));
                done();
            });
        });

        describe('::', function () {
            it('should respond with true', function () {
                assert.ok(ip.isLoopback('::'));
                done();
            });
        });
    });

});