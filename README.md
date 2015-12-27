# WiFi Manager

[![Build Status](https://travis-ci.org/kenwalger/wifimanager.svg?branch=master)](https://travis-ci.org/kenwalger/wifimanager)
[![Dependency Status](https://david-dm.org/kenwalger/wifimanager.svg)](https://david-dm.org/kenwalger/wifimanager)
[![devDependency Status](https://david-dm.org/kenwalger/wifimanager/dev-status.svg)](https://david-dm.org/kenwalger/wifimanager#info=devDependencies)

A simple Node.js WiFi Manager for Linux. Works great on embedded devices like the Raspberry Pi.


##Usage

####Generate a Network
```
var vm = require('./wifimanager');

vm.createAdHocNetwork('networkName', 'networkPassword');
```

Creates a wifi network named: `networkName`  
Network password: `networkPassword`. Password must be a *minimum* of **8** characters.


####Stop a Network
```
vm.stopAdHocNetwork();
```


####Check for Internet connectivity
```
vm.isInternetConnected();
```

####Check for network interface connectivity
```
vm.interfaceConnectionState('wlan0');
```

Checks if `wlan0` is connected. Return up if connected, down if not connected, undefined if interface is unknown.

## To dos

* connect()
* disconnect()

##Working on:


