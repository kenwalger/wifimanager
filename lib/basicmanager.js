/**
 * Created by Ken W. Alger on 6/16/2015.
 */
var fs = require('fs');

var startHostapdService = require('child_process').exec,
    sudo_hostapd = startHostapdService('sudo service hostapd start');

var startDHCPService = require('child_process').exec,
    sudo_udhcpd = startDHCPService('sudo service udhcpd start');


createAdHocNetwork = function (ssid, password) {

    fs.writeFile("/etc/hostapd/hostapd.conf",
        "interface=wlan0\n"+
        "driver=rtl871xdrv\n"+
        "ssid=" + ssid + "\n"+
        "hw_mode=g\n"+
        "channel=6\n"+
        "macaddr_acl=0\n"+
        "auth_algs=1\n"+
        "ignore_broadcast_ssid=0\n"+
        "wpa=2\n"+
        "wpa_passphrase=" + password + "\n"+
        "wpa_key_mgmt=WPA-PSK\n"+
        "wpa_pairwise=TKIP\n"+
        "rsn_pairwise=CCMP",
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

createAdHocNetwork("someNetwork", "password");