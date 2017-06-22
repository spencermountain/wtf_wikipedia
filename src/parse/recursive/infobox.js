'use strict';
const helpers = require('../../lib/helpers');
const parse_line = require('../text');

const line_reg = /\n *\|([^=]*)=(.*)/g;

const parse_infobox = function(str) {
  if (!str) {
    return {};
  }
  let obj = {};
  let stringBuilder = [];
  let lastChar;
  //this collapsible list stuff is just a headache
  str = str.replace(/\{\{Collapsible list[^}]{10,1000}\}\}/g, '');

  let parDepth = -2; // first two {{
  for (let i = 0, len = str.length; i < len; i++) {
    if (parDepth === 0 && str[i] === '|' && lastChar !== '\n') {
      stringBuilder.push('\n');
    }
    if (str[i] === '{' || str[i] === '[') {
      parDepth++;
    } else if (str[i] === '}' || str[i] === ']') {
      parDepth--;
    }
    lastChar = str[i];
    stringBuilder.push(lastChar);
  }

  str = stringBuilder.join('');

  let regexMatch;
  while ((regexMatch = line_reg.exec(str)) !== null) {
    let key = helpers.trim_whitespace(regexMatch[1] || '') || '';
    let value = helpers.trim_whitespace(regexMatch[2] || '') || '';

    //this is necessary for mongodb, im sorry
    if (key && key.match(/[\.]/)) {
      key = null;
    }

    if (key && value) {
      obj[key] = parse_line(value);
      //turn number strings into integers
      if (obj[key].text && obj[key].text.match(/^[0-9,]*$/)) {
        obj[key].text = obj[key].text.replace(/,/, '');
        obj[key].text = parseInt(obj[key].text, 10);
      }
    }
  }
  return obj;
};
module.exports = parse_infobox;
