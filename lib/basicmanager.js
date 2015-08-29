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

var COMMANDS = {
    dhcp: 'sudo service udhcpd start',
    dhcp_disable: 'sudo service udhcpd stop',
    host: 'sudo service hostapd start',
    host_disable: 'sudo service hostapd stop',
    host_status: 'sudo service hostapd status'
};

/**
 * Configuration of the Hostapd service
 * https://w1.fi/hostapd/
 *
 * hostapd is a user space daemon for access point and authentication servers.
 *
 */

var startHostapdService = require('child_process').exec,
    sudo_hostapd = startHostapdService(COMMANDS.host);

var stopHostapdService = require('child_process').exec,
    sudo_stopHostpd = stopHostapdService(COMMANDS.host_disable);


/**
 * Configures the start of the DHCP service, we are utilizing udhcpd
 * http://manpages.ubuntu.com/manpages/hardy/man8/udhcpd.8.html
 *
 * A very small DHCP server which negotiates leases with DHCP clients
 *
 */

var startDHCPService = require('child_process').exec,
    sudo_udhcpd = startDHCPService(COMMANDS.dhcp);

var stopDHCPService = require('child_process').exec,
    sudo_stopDHCP = stopDHCPService(COMMANDS.dhcp_disable);


/**
 * defaultValues for the hostapd.conf file
 *
 * @type {{interface: string, driver: string, ssid: string, hw_mode: string, channel: string, macaddr_acl: string, auth_algs: string, ignore_broadcast_ssid: string, wpa: string, wpa_passphrase: string, wpa_key_mgmt: string, wpa_pairwise: string, rsn_pairwise: string}}
 */

var defaultValues = {
    interface: "wlan0",
    driver: "rtl871xdrv",
    //ssid: "thingsSDK",
    hw_mode: "g",
    channel: "6",
    macaddr_acl: "0",
    auth_algs: "1",
    ignore_broadcast_ssid: "0",
    wpa: "2",
    //wpa_passphrase: "Chalkers",
    wpa_key_mgmt: "WPA-PSK",
    wpa_pairwise: "TKIP",
    rsn_pairwise: "CCMP"
};


/**
 * Generates the configuration key:value pairs for the configuration file.
 */

var fileoutput = Object.keys(defaultValues).map(function(key){
    return key + "=" + defaultValues[key];
}).join("\n");



function BasicManager () {

}


/**
 * createAdHocNetwork() configures the hostapd.conf file based on the ssid and password variables supplied and then
 * starts the required services.
 *
 * @param ssid The broadcasted network name
 * @param wpa_passphrase The password for network access
 */

BasicManager.prototype.createAdHocNetwork = function (ssid, wpa_passphrase) {

    ssid = typeof ssid !== undefined ? ssid : 'thingsSDK';
    wpa_passphrase = typeof wpa_passphrase !== undefined ? wpa_passphrase : 'Chalkers';

    // Generate the hostapd.conf file required for the WiFi Network

    fs.writeFileSync("/etc/hostapd/hostapd.conf",
        fileoutput + "\n" +
        "ssid=" + ssid + "\n" +
        "wpa_passphrase=" + wpa_passphrase + "\n",
        function (err)  {
            if(err) {
                return console.log(err);
            }

            console.log("[WIFIMANAGER] hostapd.conf was successfully saved.");
            console.info("[WIFIMANAGER] Network name: " + ssid);
            console.info("[WIFIMANAGER] Network password: " + wpa_passphrase);

        }
    );

    // Start the hostapd (wifi management service)
    // Using user: thingssdk, sudo access to start services restricted in the /etc/sudoer file

    console.log("[WIFIMANAGER] Attempting to start HOSTAPD service for network " + ssid + ".");
    sudo_hostapd.stdout.on('data', function(data) {
        console.log('Starting HOSTAPD service - stdout: ' + data);
    });

    // Start the DHCP Server

    console.log("[WIFIMANAGER] Attempting to start UDHCPD service.");
    sudo_udhcpd.stdout.on('data', function(data) {
        console.log('Starting UDHCPD service - stdout: ' + data);
    });
};

BasicManager.prototype.connect = function() {
    //TODO: Connect the device to a network
};

BasicManager.prototype.isConnected = function() {
    //TODO: Check to see if the device is connected to any network
};

BasicManager.prototype.isAdHocNetwork = function() {
    //TODO: Check to see if the network to which the device is connected is an AdHoc network

    // if isConnected() is false, then we don't need to continue
    // if isConnected() is true, then check if network SSID is the same as the created network
}

/**
 * stopAdHocNetwork() stops the required services.
 */
BasicManager.prototype.stopAdHocNetwork = function() {

    // Stop the DHCP Service
    sudo_stopDHCP.stdout.on('data', function (data) {
        console.log('Stopping the DHCP Service: \n' + data);
    });

    // Stop the Wifi Management Service
    sudo_stopHostpd.stdout.on('data', function(data) {
        console.log('Stopping Hostapd Service = stdout: \n' + data) ;
    });
};

//BasicManager.createAdHocNetwork("someNetwork", "password");
module.exports = BasicManager;