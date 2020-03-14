const express = require('express');
const router = express.Router();
const network = require('network');

let internetInfo = {};

network.get_active_interface(function(err, obj) {
  internetInfo = obj;
})

router.get('/', function(req, res, next) {
  res.send(internetInfo);
});

module.exports = router;
