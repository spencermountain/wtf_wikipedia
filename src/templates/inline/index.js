const keyValue = require('../parsers/key-value');
const getInside = require('../parsers/inside');
const pipeSplit = require('../parsers/pipeSplit');


const strip = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl;
};

const inline = {

  //https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: (tmpl) => {
    let val = getInside(tmpl).data;
    let arr = val.split(/\s*[\*#]\s*/).filter((s) => s);
    return arr.join(', ');
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
    arr = arr.filter((s) => s);
    return arr.join(', ');
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

  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: (tmpl) => {
    let obj = keyValue(tmpl);
    if (obj.content) {
      let order = ['tagName', 'open'];
      let tagName = pipeSplit(tmpl, order).tagName;
      //ignore ref tags and all that
      if (tagName !== 'span' && tagName !== 'div') {
        return '';
      }
      return obj.content.text();
    }
    return '';
  },
};
//aliases
inline.flatlist = inline.plainlist;
inline.ublist = inline.plainlist;
inline['unbulleted list'] = inline.plainlist;
module.exports = inline;
