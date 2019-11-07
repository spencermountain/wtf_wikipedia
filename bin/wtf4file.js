#!/usr/bin/env node
var wtf = require('../src/index');
var fs = require('fs');
var path = require('path');
//var vFileName = path.join(__dirname,'tests/cache/africaans.txt');
var vDefaultFile = './tests/cache/OER_DE_2016.txt';
var vFileName = "";
var vTitle = "My_Test_Title";

console.log("ARG-PARAMETER: ("+process.argv.join(",")+")");
var args = process.argv.slice(2, process.argv.length);
console.log("ARGS: ("+args.join(",")+")");
var modes = {
  '--json': 'json',
  '--plaintext': 'text',
  '--html': 'html',
  '--markdown': 'markdown',
  '--reveal': 'reveal',
  '--latex': 'latex',
};
var mode = 'text';
if (args.length < 3) {
  // wtf4file is called with less than 3 parameters
  // set the missing parameters with default values
  console.log('Usage: node bin/wtf4file.js --plaintext myfile.wiki My_Title_of_the_File');
  if (args.length == 0) {
    mode = 'text';
    vFileName = vDefaultFile;
    console.log("WARNING: wtf4file.js called without parameter");
  } else if (args.length == 1) {
    if (modes.hasOwnProperty(args[0]) === true) {
      mode = modes[args[0]];
      vFileName = vDefaultFile;
      console.log("(1) MODE: wtf_wikipedia Mode was set to '"+mode+"'");
    } else {
      mode = "text";
      vFileName = args[0];
      console.log("(1) MODE: wtf_wikipedia Mode use default mode '"+mode+"'");
    };
  } else if (args.length >= 2) {
      if (modes.hasOwnProperty(args[0]) === true) {
        mode = modes[args[0]];
        vFileName = args[1];
      } else if (modes.hasOwnProperty(args[1]) === true) {
        mode = modes[args[1]];
        vFileName = args[0];
      } else {
        vFileName = './tests/cache/OER_DE_2016.txt';
      };
      console.log("FILE: wtf_wikipedia use default file '"+vFileName+"'");
      if (args.length == 3) {
        vTitle = args[2];
      }
  };
  console.log("FILE: wtf_wikipedia Mode set file to '"+vFileName+"'");
};
// replace underscore with blanks
vTitle = vTitle.replace(/_/g," ");
// read filename and apply wtf() on wiki data
fs.readFile(vFileName, {encoding:"utf-8"}, function(err,data){
  if (!err) {
    //console.log('Received Data from "'+vFileName+'":\n'+data);
    //console.log(wtf(data).text());
    var options = {};
    var outopts = {
      "docinfo":{
        "language":"en",
        "domain":"wikiversity",
        //"title":vTitle, //title is defined in JSON data of Document
        //"linktype":"absolute"
        "linktype":"relative"
      },
      "tokenize":{
        "math": true,
        "citation": true
      },
      "reveal":{
        "refs_per_page":5,
        "author":"Wikiversity Authors",
      }
    };
    //console.log(wtf(data,options).html());
    console.log("TITLE: "+vTitle+"\nFILE: "+vFileName+"\nMODE: "+mode+"\n");
    switch (mode) {
      case "json":
        console.log(JSON.stringify(wtf(data,options).json(),null,4));
      break;
      case "text":
        console.log(wtf(data,options).text(outopts));
      break;
      case "latex":
        console.log(wtf(data,options).latex(outopts));
      break;
      case "reveal":
        console.log(wtf(data,options).reveal(outopts));
      break;
      case "html":
        console.log(wtf(data,options).html(outopts));
      break;
      case "markdown":
        console.log(wtf(data,options).markdown(outopts));
      break;
      default:
        console.log(wtf(data,options).text(outopts));
    }
    //wtf(data).text();
  } else {
    console.log("ERROR '"+vFileName+"':\n: "+err);
  }
});
