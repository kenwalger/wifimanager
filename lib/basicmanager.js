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
 * Created by Ken W. Alger on 6/16/2015.
 */


var fs = require('fs');

/**
 * Configures the start of the Hostap service
 * https://w1.fi/hostapd/
 *
 * hostapd is a user space daemon for access point and authentication servers.
 *
 */

var startHostapdService = require('child_process').exec,
    sudo_hostapd = startHostapdService(this.COMMANDS.host);


/**
 * Configures the start of the DHCP service, we are utilizing udhcpd
 * http://manpages.ubuntu.com/manpages/hardy/man8/udhcpd.8.html
 *
 * A very small DHCP server which negotiates leases with DHCP clients
 *
 */

var startDHCPService = require('child_process').exec,
    sudo_udhcpd = startDHCPService(this.COMMANDS.dhcp);


/**
 * defaultValues for the hostapd.conf file
 *
 * @type {{interface: string, driver: string, ssid: string, hw_mode: string, channel: string, macaddr_acl: string, auth_algs: string, ignore_broadcast_ssid: string, wpa: string, wpa_passphrase: string, wpa_key_mgmt: string, wpa_pairwise: string, rsn_pairwise: string}}
 */

var defaultValues = {
    interface: "wlan0",
    driver: "rtl871xdrv",
    ssid: "thingsSDK",
    hw_mode: "g",
    channel: "6",
    macaddr_acl: "0",
    auth_algs: "1",
    ignore_broadcast_ssid: "0",
    wpa: "2",
    wpa_passphrase: "Chalkers",
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

BasicManager.prototype.COMMANDS = {
    dhcp: 'sudo service udhcpd start',
    dhcp_disable: 'sudo service udhcpd stop',
    host: 'sudo service hostapd start',
    host_disable: 'sudo service hostapd stop',
    host_status: 'sudo service hostapd status'
};


/**
 * createAdHocNetwork() configures the hostapd.conf file based on the ssid and password variables supplied and then
 * starts the required services.
 *
 * @param ssid The broadcasted network name
 * @param password The password for network access
 */

BasicManager.prototype.createAdHocNetwork = function (ssid, password) {

    // Generate the hostapd.conf file required for the WiFi Network

    fs.writeFile("/etc/hostapd/hostapd.conf",
        fileoutput +
        "ssid=" + ssid + "\n"+
        "wpa_passphrase=" + password + "\n",
        function (err)  {
            if(err) {
                return console.log(err);
            }

            console.log("[WIFIMANAGER] hostapd.conf was successfully saved.");

        }
    );

    // Start the hostapd (wifi management service)
    // Using user: thingssdk, sudo access to start services restricted in the /etc/sudoer file

    console.log("[WIFIMANAGER] Attempting to start HOSTAPD service.");
    sudo_hostapd.stdout.on('data', function(data) {
        console.log('Starting HOSTAPD service - stdout: ' + data);
    });

    // Start the DHCP Server

    console.log("[WIFIMANAGER] Attempting to start UDHCPD service.");
    sudo_udhcpd.stdout.on('data', function(data) {
        console.log('Starting UDHCPD service - stdout: ' + data);
    });
};

BasicManager.createAdHocNetwork("someNetwork", "password");