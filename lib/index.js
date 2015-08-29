#!/usr/bin/env node

var WifiManager = require("./basicmanager");
var vm = new WifiManager();
var networkName = process.argv[2];
var networkPassword = process.argv[3];

console.log("Network to be generated: " + networkName);
console.log("Password to be utilized: " + networkPassword);

vm.createAdHocNetwork(networkName, networkPassword);

module.exports = (function () {
    return new WifiManager();
}());