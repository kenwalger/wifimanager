

var os = require('os');

function ip() {
}


/**
 *
 * @param   interfaceName       Network adapter name, defaults to wlan0
 * @param   version             ip version (4 or 6), defaults to 4
 * @returns {string}            ip address
 */

ip.prototype.address = function (interfaceName, version) {
    var interfaces = os.networkInterfaces();

    // Default version to 'ipv4'
    version = _normalizeVersion(version);

    // Return a specifically named network interface address.

    if (interfaceName && !~['public', 'private'].indexOf(interfaceName)) {
        return interfaces[interfaceName].filter(function (details) {
            details.version = details.version.toLowerCase();
            return details.version === version;
        })[0].address;
    }

    var all = Object.keys(interfaces).map(function (nic) {
        //
        // Note: name will only be `public` or `private`
        // when this is called.
        //
        var addresses = interfaces[nic].filter(function (details) {
            details.version = details.version.toLowerCase();
            if (details.version !== version || this.isLoopback(details.address)) {
                return false;
            }
            else if (!interfaceName) {
                return true;
            }

            return interfaceName === 'APIPA'
                ? !this.isAPIPANetwork(details.address)
                : this.isAPIPANetwork(details.address)
        });

        return addresses.length
            ? addresses[0].address
            : undefined;
    }).filter(Boolean);

    return !all.length
        ? loopback(version)
        : all[0];
};

/**
 * isAPIPANetwork checks if the wlan0 ip Address is an APIPA network(169.254.0.1 to 169.254.255.254)
 *
 * @param   address     The ip address to check
 * @returns {boolean}   The Boolean value of if the network address is an APIPA address
 */
ip.prototype.isAPIPANetwork = function(address) {
    return address.match(/^169\.254\.([0-9]{1,3})\.([0-9]{1,3})/) != null
};

/**
 * isLoopback check if the wlan0 ip Address is a loopback address (127.0.0.1)
 *
 * @param   address     The ip address to check
 * @returns {boolean}   The Boolean value of the check
 */

ip.prototype.isLoopback = function(address) {

    return /^127\.0\.0\.1$/.test(address)
        || /^fe80::1$/.test(address)
        || /^::1$/.test(address)
        || /^::$/.test(address);

};



function _normalizeVersion(version) {
    return version ? version.toLowerCase() : 'ipv4';
}

function loopback(version) {

    //Default to 'ipv4'
    version = _normalizeVersion(version);

    if (version !== 'ipv4' && version !== 'ipv6') {
        throw new Error('ip version must be either ipv4 or ipv6');
    }

    return version === 'ipv4'
        ? '127.0.0.1' : 'fe80::1';
}

module.exports = ip;