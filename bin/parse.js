#!/usr/bin/env node
'use strict';
var wtf_wikipedia = require('../index');
var fetch = require('../fetch_text');
var request=require("request")

var title = process.argv.slice(2, process.argv.length).join(" ");
if(!title){
   console.log('Usage: wikipedia Toronto Blue Jays');
   process.exit(1);
}
title=title.charAt(0).toUpperCase() + title.slice(1)
//fetch this topic's wikipedia page
fetch(title, function(script){
  var data= wtf_wikipedia.parse(script)
  console.log(JSON.stringify(data, null, 2));
})
