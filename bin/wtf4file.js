#!/usr/bin/env node
var wtf = require('../src/index');
var fs = require('fs');
var path = require('path');
var vFileName = path.join(__dirname,'tests/cache/africaans.txt');
vFileName = './tests/cache/Bodmin.txt';

var args = process.argv.slice(2, process.argv.length);

var modes = {
  '--json': 'json',
  '--plaintext': 'plaintext',
  '--html': 'html',
  '--markdown': 'markdown',
  '--latex': 'latex',
};
var mode = 'json';
args = args.filter((arg) => {
  if (modes.hasOwnProperty(arg) === true) {
    mode = modes[arg];
    return false;
  }
  return true;
});

/*
var title = args.join(' ');
if (!title) {
  throw new Error('Usage: node bin/wtf Toronto Blue Jays --plaintext');
}
*/

fs.readFile(vFileName, {encoding:"utf-8"}, function(err,data){
  if (!err) {
    //console.log('Received Data from "'+vFileName+'":\n'+data);
    //console.log(wtf(data).text());
    options = {
      "tokenize":{
        "math": true,
        "citation": true
      }
    };
    console.log(wtf(data,options).html());
    //wtf(data).text();
  } else {
    console.log("ERROR '"+vFileName+"':\n: "+err);
  }
});
