/**
 * @description Returns the current host address for the network interface
 * @returns {Promise<string>} Returns a string that represents the ip
 * address of the network interface
*/

const dns = require('dns');
const os = require('os');

module.exports = new Promise((resolve) => {
  dns.lookup(os.hostname(), (_, address) => {
    resolve(address);
  });
});
