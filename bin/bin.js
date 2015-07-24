#!/usr/bin/env node

'use strict';
var wtf_wikipedia = require('../src/index');
var fetch = require('../src/lib/fetch_text');

var title = process.argv.slice(2, process.argv.length).join(" ");
if(!title) {
  throw new Error('Usage: wikipedia Toronto Blue Jays');
}
title = title.charAt(0).toUpperCase() + title.slice(1)
  //fetch this topic's wikipedia page
fetch(title, 'en', function (script) {
  var data = wtf_wikipedia.parse(script)
  console.log(JSON.stringify(data, null, 2));
})
