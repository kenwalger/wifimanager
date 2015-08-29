#!/usr/bin/env node

var WifiManager = require("./wifimanager");
var color = require('colors');
var vm = new WifiManager();
var networkName = process.argv[2];
var networkPassword = process.argv[3];

console.log("\n" + "Network to be generated: " + (networkName).green);
console.log("Password to be utilized: " + (networkPassword).green + "\n");

vm.createAdHocNetwork(networkName, networkPassword);

vm.stopAdHocNetwork();

module.exports = (function () {
    return new WifiManager();
}());