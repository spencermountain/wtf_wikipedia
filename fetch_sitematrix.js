#!/usr/bin/env node

/**
 * Simple script to update sitematrix.json
 */

"use strict";

require('es6-shim');
require('prfun');

var fs = require("fs"),
  writeFile = Promise.promisify(fs.writeFile, false, fs),
  request = Promise.promisify(require('request'), true),
  downloadUrl = "https://en.wikipedia.org/w/api.php?action=sitematrix&format=json",
  filename = "sitematrix.js";

request({
  url: downloadUrl,
  json: true
}).spread(function(res, body) {
  if ( res.statusCode !== 200 ) {
    throw "Error fetching sitematrix! Returned " + res.statusCode;
  }
  return writeFile(
    filename,
    "var sitematrix = " + JSON.stringify(body, null, "\t") + ";\n" +
    "module.exports = sitematrix;"
  );
}).then(function() {
  console.log("Success!");
}).done();
