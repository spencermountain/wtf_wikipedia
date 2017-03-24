#!/usr/bin/env node

'use strict';
var wtf = require('../src/index');

var title = process.argv.slice(2, process.argv.length).join(' ');
if (!title) {
  throw new Error('Usage: wikipedia Toronto Blue Jays');
}
title = title.charAt(0).toUpperCase() + title.slice(1);
//fetch this topic's wikipedia page
wtf.from_api(title, 'en', function (script) {
  var data = wtf.parse(script);
  console.log(JSON.stringify(data, null, 2));
});
