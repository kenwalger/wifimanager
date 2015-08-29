#!/usr/bin/env node

var WifiManager = require("./basicmanager");
var networkName = process.argv.slice(2);
var networkPassword = process.argv.slice(3);

WifiManager.createAdHocNetwork(networkName, networkPassword);

module.exports = (function () {
    return new WifiManager();
}());