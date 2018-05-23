const keyValue = require('./parsers/keyValue');
const pipeSplit = require('./parsers/pipeSplit');
const strip = require('./parsers/_strip');

const inline = {

  //newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: (tmpl) => {
    tmpl = strip(tmpl);
    //remove the title
    let arr = tmpl.split('|');
    arr = arr.slice(1);
    tmpl = arr.join('|');
    //split on newline
    arr = tmpl.split(/\n ?\* ?/);
    arr = arr.filter(s => s);
    return arr.join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': (tmpl) => {
    let val = strip(tmpl);
    let arr = val.split('|');
    arr = arr.map(s => s.trim());
    arr = arr.filter(str => /^title ?=/i.test(str) === false);
    return arr.slice(1).join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: (tmpl) => {
    let order = ['num', 'two', 'three', 'four'];
    let obj = pipeSplit(tmpl, order);
    //todo: support plural units
    if (obj.two === '-' || obj.two === 'to' || obj.two === 'and') {
      if (obj.four) {
        return `${obj.num} ${obj.two} ${obj.three} ${obj.four}`;
      }
      return `${obj.num} ${obj.two} ${obj.three}`;
    }
    return `${obj.num} ${obj.two}`;
  },
  hlist: (tmpl) => {
    let val = strip(tmpl).replace(/^hlist\s?\|/, '');
    let arr = val.split('|');
    arr = arr.filter((s) => s && s.indexOf('=') === -1);
    return arr.join(' · ');
  },
  //https://en.wikipedia.org/wiki/Template:Term
  term: (tmpl) => {
    let order = ['term'];
    let obj = pipeSplit(tmpl, order);
    return `${obj.term}:`;
  },
  defn: (tmpl) => {
    let order = ['desc'];
    let obj = pipeSplit(tmpl, order);
    return obj.desc;
  },
  //https://en.wikipedia.org/wiki/Template:Interlanguage_link
  ill: (tmpl) => {
    let order = ['text', 'lan1', 'text1', 'lan2', 'text2'];
    let obj = pipeSplit(tmpl, order);
    return obj.text;
  },
  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: (tmpl) => {
    let order = ['date', 'year'];
    let obj = pipeSplit(tmpl, order);
    let str = obj.date;
    if (obj.year) {
      str += ' ' + obj.year;
    }
    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl) => {
    let obj = keyValue(tmpl);
    let result = [];
    let units = ['m', 'cm', 'ft', 'in']; //order matters
    units.forEach((unit) => {
      if (obj.hasOwnProperty(unit) === true) {
        result.push(obj[unit].text() + unit);
      }
    });
    return result.join(' ');
  },

  'block indent': (tmpl) => {
    let obj = keyValue(tmpl);
    if (obj['1']) {
      return '\n' + obj['1'].text() + '\n';
    }
    return '';
  },
  'quote': (tmpl) => {
    let obj = keyValue(tmpl);
    if (obj.text) {
      let str = `"${obj.text.text()}"`;
      if (obj.author) {
        str += `  - ${obj.author.text()}`;
        str += '\n';
      }
      return str;
    }
    return '';
  }
};
//aliases
inline.flatlist = inline.plainlist;

inline.ublist = inline.plainlist;
inline['unbulleted list'] = inline['collapsible list'];
inline['ordered list'] = inline['collapsible list'];

inline['str left'] = inline.trunc;
inline['str crop'] = inline.trunc;
module.exports = inline;
