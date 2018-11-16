//remove the top/bottom off the template
const strip = require('./_strip');
const fmtName = require('./_fmtName');
const parseSentence = require('../../04-sentence').oneSentence;
const pipeSplitter = require('./01-pipe-splitter');
const keyMaker = require('./02-keyMaker');
const cleanup = require('./03-cleanup');
// const isKnown = require('./04-isKnown');

const makeFormat = function(str, fmt) {
  let s = parseSentence(str);
  //support various output formats
  if (fmt === 'json') {
    return s.json();
  } else if (fmt === 'raw') {
    return s;
  } else { //default to flat text
    return s.text();
  }
};

//
const parser = function(tmpl, order, fmt) {
  //renomove {{}}'s
  tmpl = strip(tmpl || '');
  let arr = pipeSplitter(tmpl);
  //get template name
  let name = arr.shift();
  //name each value
  let obj = keyMaker(arr, order);
  //remove wiki-junk
  obj = cleanup(obj);
  //is this a infobox/reference?
  // let known = isKnown(obj);

  Object.keys(obj).forEach((k) => {
    if (k === 'list') {
      obj[k] = obj[k].map((v) => makeFormat(v, fmt));
      return;
    }
    obj[k] = makeFormat(obj[k], fmt);
  });
  //add the template name
  if (name) {
    obj.template = fmtName(name);
  }
  return obj;
};
module.exports = parser;
