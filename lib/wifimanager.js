/**
 *
 * Basic WiFi Manager for Linux based systems, like Raspberry Pi.
 * For network generation the generation is:
 *
 * 1. Generate the configuration file based on passed in SSID & network password.
 * 2. Start the HOSTAPD service based on the configuration file.
 * 3. Start the DHCP service.
 *
 *
 * If this code works it was created by Ken W. Alger on 8/28/2015.
 * If not, I don't know who wrote it.
 *
 */


var fs = require('fs');
var dns = require('dns');
var color = require('colors');
var ip = require('./ip');


var COMMANDS = {
    dhcp: 'sudo service udhcpd start',
    dhcp_disable: 'sudo service udhcpd stop',
    host: 'sudo service hostapd start',
    host_disable: 'sudo service hostapd stop',
    host_status: 'sudo service hostapd status'
};


function BasicManager() {

}


/**
 * Configuration of the Hostapd service
 * https://w1.fi/hostapd/
 *
 * hostapd is a user space daemon for access point and authentication servers.
 *
 */

var startHostapdService = require('child_process').exec;

var stopHostapdService = require('child_process').exec;


/**
 * Configures the start of the DHCP service, we are utilizing udhcpd
 * http://manpages.ubuntu.com/manpages/hardy/man8/udhcpd.8.html
 *
 * A very small DHCP server which negotiates leases with DHCP clients
 *
 */

var startDHCPService = require('child_process').exec;

var stopDHCPService = require('child_process').exec;


/**
 * checkInternet() does a DNS lookup to determine if an Internet connection
 * is successfully established.
 *
 * @param callback
 */

function checkInternet(callback) {
    dns.lookup('thingssdk.com', function(error) {
        var hasError = error && error.code === 'ENOTFOUND';
        callback(!hasError);
    });
}


/**
 * createAdHocNetwork() configures the hostapd.conf file based on the ssid and password variables supplied and then
 * starts the required services.
 *
 * @param   ssid            The broadcasted network name
 * @param   wpa_passphrase  The password for network access, minimum 8 characters
 */

BasicManager.prototype.createAdHocNetwork = function(ssid, wpa_passphrase) {

    ssid = ssid || 'thingsSDK';
    wpa_passphrase = wpa_passphrase || 'passphrase';

    if (wpa_passphrase.length < 8) {
        throw new Error("\n" + "Password length too short. Must be at least 8 characters.".inverse.red);
    }


    // Generate the hostapd.conf file required for the WiFi Network

    fs.writeFileSync("/etc/hostapd/hostapd.conf",
        this.generateFileOutput({ssid: ssid, wpa_passphrase: wpa_passphrase}));

    console.log("\n[WIFIMANAGER] hostapd.conf was successfully saved.".yellow);
    console.info("[WIFIMANAGER] Network name: " + (ssid).green);
    console.info("[WIFIMANAGER] Network password: " + (wpa_passphrase).green + "\n");



    // Start the hostapd (wifi management service)
    // Using user: thingssdk, sudo access to start services restricted in the /etc/sudoer file
    sudo_hostapd = startHostapdService(COMMANDS.host);
    console.info(("[WIFIMANAGER] Attempting to start HOSTAPD service for network: " + ssid).cyan);
    sudo_hostapd.stdout.on('data', function (data) {
        console.log('Starting HOSTAPD service - stdout: ' + (data).inverse.white);
    });

    // Start the DHCP Server
    sudo_udhcpd = startDHCPService(COMMANDS.dhcp);
    console.info("[WIFIMANAGER] Attempting to start UDHCPD service.".cyan);
    sudo_udhcpd.stdout.on('data', function(data) {
        console.log('Starting UDHCPD service - stdout: ' + (data).inverse.white);
    });
};


/**
 * connect() connects the device to an established network
 */

BasicManager.prototype.connect = function() {
    //TODO: Connect the device to a network

};


/**
 * isPrivateAddressedNetwork() checks to see if wlan0 is an APIPA network
 *
 * @returns {boolean}
 */

BasicManager.prototype.isPrivateAddressedNetwork = function() {

    var ipAddress = ip.address('wlan0', 'ipv4');

    if (ip.isAPIPANetwork(ipAddress)) {
        return true;
    }

    return false;

};


/**
 * isConnected() checks for an internet connection via DNS lookup.
 */

BasicManager.prototype.isConnected = function() {

    checkInternet(function(isConnected) {
        if (isConnected) {
            // connected to the internet
            console.info("[WIFIMANAGER] Connected to the internet.".green);
            return true;
        } else {
            // not connected to the internet
            console.info("[WIFIMANAGER] Problem connecting to the internet.".inverse.red);
            return false;
        }
    })
};

/**
 * stopAdHocNetwork() stops the required services.
 */

BasicManager.prototype.stopAdHocNetwork = function() {

    // Stop the DHCP Service

    sudo_stopDHCP = stopDHCPService(COMMANDS.dhcp_disable);
    sudo_stopDHCP.stdout.on('data', function(data) {
        console.log(('Stopping the DHCP Service: \n' + data).red);
    });

    // Stop the Wifi Management Service

    sudo_stopHostpd = stopHostapdService(COMMANDS.host_disable);
    sudo_stopHostpd.stdout.on('data', function(data) {
        console.log(('Stopping Hostapd Service = stdout: \n' + data).red);
    });
};

/**
 * Generates the configuration key:value pairs for the configuration file.
 *
 * @param   options     An object containing keys to be replace the default hostapdValues
 * @returns {string}    The configuration file contents
 */

BasicManager.prototype.generateFileOutput = function(options) {
    /**
     * hostapdValues for the hostapd.conf file
     *
     * @type {{interface: string, driver: string, ssid: string, hw_mode: string, channel: string, macaddr_acl: string, auth_algs: string, ignore_broadcast_ssid: string, wpa: string, wpa_passphrase: string, wpa_key_mgmt: string, wpa_pairwise: string, rsn_pairwise: string}}
     */

    var hostapdValues = {
        interface: options.interface || "wlan0",
        driver: options.driver || "rtl871xdrv",
        ssid: options.ssid || "thingsSDK",
        hw_mode: options.hw_mode || "g",
        channel: options.channel || "6",
        macaddr_acl: options.macaddr_acl || "0",
        auth_algs: options.auth_algs || "1",
        ignore_broadcast_ssid: options.ignore_broadcast_ssid || "0",
        wpa: options.wpa || "2",
        wpa_passphrase: options.wpa_passphrase || "passphrase",
        wpa_key_mgmt: options.wpa_key_mgmt || "WPA-PSK",
        wpa_pairwise: options.wpa_pairwise || "TKIP",
        rsn_pairwise: options.rsn_pairwise || "CCMP"
    };

    return Object.keys(hostapdValues).map(function(key) {
        return key + "=" + hostapdValues[key];
    }).join("\n");

};


module.exports = BasicManager;