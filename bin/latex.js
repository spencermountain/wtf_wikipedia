#!/usr/bin/env node

'use strict';
var wtf = require('../src/index');

var title = process.argv.slice(2, process.argv.length).join(' ');
var vDocJSON = {}; // collects all JSON data of downloaded Wiki articles
if (!title) {
  throw new Error('Usage: node latex.js Toronto Blue Jays');
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

  //console.log("Wiki JSON:\n"JSON.stringify(data, null, 2));
  wtf.wikiconvert.init('en','wikipedia',vDocJSON);
  wtf.wikiconvert.initArticle(page_identifier);
  // replace local image urls (e.g. [[File:my_image.png]])
  // by a remote image url [[File:https://en.wikipedia.org/wiki/Special:Redirect/file/my_image.png]]
  wikimarkdown = wtf.wikiconvert.replaceImages(wikimarkdown);
  // replace local  urls (e.g. [[Other Article]])
  // by a remote url to the Wiki article e.g. [https://en.wikipedia.org/wiki/Other_Article Other Article]
  wikimarkdown = wtf.wikiconvert.replaceWikiLinks(wikimarkdown);
  // perform the post processing after wikimarkdown compilation
  wikimarkdown = wtf.wikiconvert.post_process(wikimarkdown);

  var latex = wtf.latex(wikimarkdown, options);
  console.log(latex);
});
