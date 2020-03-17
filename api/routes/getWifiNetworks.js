const express = require('express');
const router = express.Router();
var iw = require('wireless-tools/iw');

let networksInfo;

iw.scan('wlan0', function(err, networks) {
  console.log(networks)
  networksInfo = networks;
});

iw.scan({ iface : 'wlan0', show_hidden : true }, function(err, networks) {
  console.log(networks);
});

router.get('/', function(req, res, next) {
  res.send(networksInfo);
});


var spawn = require('child_process').spawn;
wifiNetworksRSSI(function(err, data, raw) {
  if (!err) {
    console.log(data); // formatted data with SSID, BSSID, RSSI
    // console.log(raw); // raw output from netsh
  } else {
    console.log(err);
  }
});

function wifiNetworksRSSI(fn) {
  // prepare result string of data
  var res = '';
  // spawn netsh with required settings
  var netsh = spawn('netsh', ['wlan', 'show', 'networks', 'mode=bssid']);

  // get data and append to main result
  netsh.stdout.on('data', function (data) {
    res += data;
  });

  // if error occurs
  netsh.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  // when done
  netsh.on('close', function (code) {
    if (code == 0) { // normal exit
      // prepare array for formatted data
      var networks = [ ];
      // split response to blocks based on double new line
      var raw = res.split('\r\n\r\n');

      // iterate through each block
      for(var i = 0; i < raw.length; ++i) {
        // prepare object for data
        var network = { };

        // parse SSID
        var match = raw[i].match(/^SSID [0-9]+ : (.+)/);
        if (match && match.length == 2) {
          network.ssid = match[1];
        } else {
          network.ssid = '';
        }

        // if SSID parsed
        if (network.ssid) {
          // parse BSSID
          var match = raw[i].match(' +BSSID [0-9]+ +: (.+)');
          if (match && match.length == 2) {
            network.bssid = match[1];
          } else {
            network.bssid = '';
          }

          // parse RSSI (Signal Strength)
          var match = raw[i].match(' +Signal +: ([0-9]+)%');
          if (match && match.length == 2) {
            network.rssi = parseInt(match[1]);
          } else {
            network.rssi = NaN;
          }

          // push to list of networks
          networks.push(network);
        }
      }

      // callback with networks and raw data
      fn(null, networks, res);
    } else {
      // if exit was not normal, then throw error
      fn(new Error(code));
    }
  });
}

module.exports = router;
