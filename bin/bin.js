#!/usr/bin/env node
'use strict';
var wtf_wikipedia = require('../index');
var request=require("request")

var title = process.argv.slice(2, process.argv.length).join(" ");
if(!title){
   console.log('Usage: wikipedia Toronto');
   process.exit(1);
}
title=title.charAt(0).toUpperCase() + title.slice(1)

//fetch this topic's wikipedia page
var url='http://en.wikipedia.org/w/index.php?action=raw&title='+title
request({
  uri: url,
}, function(error, response, body) {
  if(error){
    console.log(error)
  }
  var data= wtf_wikipedia(body)
  console.log(JSON.stringify(data, null, 2));
});
