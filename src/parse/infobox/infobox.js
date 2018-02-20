const trim = require('../../lib/helpers').trim_whitespace;
const parseLine = require('../section/sentence').parseLine;
const findRecursive = require('../../lib/recursive_match');
const i18n = require('../../data/i18n');
const infobox_template_reg = new RegExp('{{(?:' + i18n.infoboxes.join('|') + ')\\s*(.*)', 'i');

const getTemplate = function(str) {
  let m = str.match(infobox_template_reg);
  if (m && m[1]) {
    return m[1];
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

  const template = getTemplate(str); //get the infobox name

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
    obj[k] = parseLine(obj[k]);
    if (obj[k].text && obj[k].text.match(/^[0-9,]*$/)) {
      obj[k].text = obj[k].text.replace(/,/, '');
      obj[k].text = parseInt(obj[k].text, 10);
    }
  });
  // //remove top+bottom
  // if(lines.length>1 && lines[0].match()
  // console.log(regexMatch);
  // console.log('\n\n\n');
  // while ((regexMatch = line_reg.exec(str)) !== null) {
  //   // console.log(str + '----');
  //   let key = helpers.trim_whitespace(regexMatch[1] || '') || '';
  //   let value = helpers.trim_whitespace(regexMatch[2] || '') || '';
  //
  //   //this is necessary for mongodb, im sorry
  //   key = key.replace(/\./, '');
  //   if (key && value) {
  //     obj[key] = parse_line(value);
  //     //turn number strings into integers
  //     if (obj[key].text && obj[key].text.match(/^[0-9,]*$/)) {
  //       obj[key].text = obj[key].text.replace(/,/, '');
  //       obj[key].text = parseInt(obj[key].text, 10);
  //     }
  //   }
  // }
  return {
    template: template,
    data: obj
  };
};
module.exports = parse_infobox;
