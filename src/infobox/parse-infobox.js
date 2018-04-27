const trim = require('../lib/helpers').trim_whitespace;
const findRecursive = require('../lib/recursive_match');
const i18n = require('../data/i18n');
const Image = require('../image/Image');
const parseLine = require('../sentence').parseLine;
const Sentence = require('../sentence/Sentence');
const i18_infobox = i18n.infoboxes.join('|');
// const infobox_template_reg = new RegExp('{{(infobox) +([^\|\n]+)', 'i');
const infobox_template_reg = new RegExp('{{(' + i18_infobox + ') +([^\|\n]+)', 'i');

//which infobox is this? eg '{{Infobox author|...}}'
const getTemplateName = function(str) {
  let m = str.match(infobox_template_reg);
  if (m && m[1]) {
    return m[2].trim();
  }
  return null;
};

const parse_infobox = function(str) {
  if (!str) {
    return {};
  }
  let stringBuilder = [];
  let lastChar;
  //this collapsible list stuff is just a headache
  let listReg = /\{\{ ?(collapsible|hlist|ublist|plainlist|Unbulleted list|flatlist)/i;
  if (listReg.test(str)) {
    let list = findRecursive('{', '}', str.substr(2, str.length - 2)).filter((f) => listReg.test(f));
    str = str.replace(list[0], '');
  }

  const templateName = getTemplateName(str); //get the infobox name

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
  //remove top+bottom
  str = str.replace(/^ *?\{\{.+[|\n]/, '');
  str = str.replace(/\}\} *?$/, '');
  let lines = str.split(/\n\*?/);

  let obj = {};
  let key = null;
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    let keyMatch = l.match(/\| *?([^=]+)=(.+)?/i);
    if (keyMatch && keyMatch[1]) {
      key = trim(keyMatch[1]);
      if (keyMatch[2]) {
        obj[key] = trim(keyMatch[2]);
      } else {
        obj[key] = '';
      }
    } else if (key) {
      obj[key] += l;
    }
  }
  //post-process values
  Object.keys(obj).forEach(k => {
    if (!obj[k]) {
      delete obj[k];
      return;
    }
    //handle the 'image' property in a special-way
    if (k === 'image') {
      obj[k] = new Image(obj[k]);
      obj[k].text = '';
    } else {
      obj[k] = parseLine(obj[k]);
    }
    if (obj[k].text && obj[k].text.match(/^[0-9,]*$/)) {
      obj[k].text = obj[k].text.replace(/,/, '');
      obj[k].text = parseInt(obj[k].text, 10);
    }
    //turn values into Sentence objects for easy use
    obj[k] = new Sentence(obj[k]);
  });
  return {
    template: templateName,
    data: obj
  };
};
module.exports = parse_infobox;
