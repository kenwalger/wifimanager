#!/usr/bin/env node

var WifiManager = require("./wifimanager");

var vm = new WifiManager();
var networkName = process.argv[2];
var networkPassword = process.argv[3];

console.log("\n" + "Network to be generated: " + (networkName));
console.log("Password to be utilized: " + (networkPassword) + "\n");

vm.createAdHocNetwork(networkName, networkPassword);

// vm.stopAdHocNetwork();


module.exports = (function () {
	return new WifiManager();
}());