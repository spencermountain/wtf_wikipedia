#!/usr/bin/env node

'use strict';
var wtf = require('../src/index');

var title = process.argv.slice(2, process.argv.length).join(' ');
var vDocJSON = {}; // collects all JSON data of downloaded Wiki articles
if (!title) {
  throw new Error('Usage: node reveal.js Toronto Blue Jays');
};
// extract the title from the command line parameter of `latex.js`
title = title.charAt(0).toUpperCase() + title.slice(1);
//fetch this topic's wikipedia page
wtf.from_api(title, 'en', function (wikimarkdown, page_identifier, lang_or_wikiid) {
  var options = {
    page_identifier:page_identifier,
    lang_or_wikiid:lang_or_wikiid
  };
  var data = wtf.parse(wikimarkdown,options);
  console.log(JSON.stringify(data, null, 2));

  var latex = wtf.latex(wikimarkdown, options);
  // console.log(latex);
});
