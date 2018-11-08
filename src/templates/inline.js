const languages = require('../_data/languages');
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
  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: (tmpl) => {
    let inside = strip(tmpl).replace(/^braces\s?\|/, '');
    return '{{' + inside + '}}';
  },
  nobold: (tmpl) => {
    let inside = strip(tmpl).replace(/^nobold\s?\|/, '');
    return inside;
  },
  noitalic: (tmpl) => {
    let inside = strip(tmpl).replace(/^noitalic\s?\|/, '');
    return inside;
  },
  nocaps: (tmpl) => {
    let inside = strip(tmpl).replace(/^noitalic\s?\|/, '');
    return inside.toLowerCase();
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
  lang: (tmpl) => {
    let order = ['lang', 'text'];
    let obj = pipeSplit(tmpl, order);
    return obj.text;
  },
  //this one has a million variants
  'lang-de': (tmpl) => {
    let order = ['text'];
    let obj = pipeSplit(tmpl, order);
    return obj.text;
  },
  //https://en.wikipedia.org/wiki/Template:Frac
  frac: (tmpl) => {
    let order = ['a', 'b', 'c'];
    let obj = pipeSplit(tmpl, order);
    if (obj.c) {
      return `${obj.a} ${obj.b}/${obj.c}`;
    }
    if (obj.b) {
      return `${obj.a}/${obj.b}`;
    }
    return `1/${obj.b}`;
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
        result.push(obj[unit] + unit);
      }
    });
    return result.join(' ');
  },

  'block indent': (tmpl) => {
    let obj = keyValue(tmpl);
    if (obj['1']) {
      return '\n' + obj['1'] + '\n';
    }
    return '';
  },
  'quote': (tmpl) => {
    let obj = keyValue(tmpl);
    if (obj.text) {
      let str = `"${obj.text}"`;
      if (obj.author) {
        str += `  - ${obj.author}`;
        str += '\n';
      }
      return str;
    }
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: (tmpl, r) => {
    let data = pipeSplit(tmpl, ['name', 'from', 'to', 'end']);
    r.templates.push(data);
    let str = `${data.name || ''}`;
    if (data.from) {
      if (data.to) {
        str += ` (m. ${data.from}-${data.to})`;
      } else {
        str += ` (m. ${data.from})`;
      }
    }
    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: (tmpl) => {
    let obj = pipeSplit(tmpl, ['text']);
    return `[[${obj.text} Lifeboat Station|${obj.text}]]`;
  },
  //Foo-class
  lbc: (tmpl) => {
    let obj = pipeSplit(tmpl, ['text']);
    return `[[${obj.text}-class lifeboat|${obj.text}-class]]`;
  },
  lbb: (tmpl) => {
    let obj = pipeSplit(tmpl, ['text']);
    return `[[${obj.text}-class lifeboat|${obj.text}]]`;
  },
  //german keyboard letterscn
  taste: (tmpl) => {
    let obj = pipeSplit(tmpl, ['key']);
    return obj.key || '';
  },
  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: (tmpl, r) => {
    let obj = pipeSplit(tmpl, ['english', 'kanji', 'romaji', 'extra']);
    r.templates.push(obj);
    let str = obj.english || obj.romaji || '';
    if (obj.kanji) {
      str += ` (${obj.kanji})`;
    }
    return str;
  }
};
//aliases
inline.flatlist = inline.plainlist;

inline.ublist = inline.plainlist;
inline['unbulleted list'] = inline['collapsible list'];
inline['ubl'] = inline['collapsible list'];
inline['ordered list'] = inline['collapsible list'];

inline['str left'] = inline.trunc;
inline['str crop'] = inline.trunc;
inline['nihongo2'] = inline.nihongo;
inline['nihongo3'] = inline.nihongo;
inline['nihongo-s'] = inline.nihongo;
inline['nihongo foot'] = inline.nihongo;

//https://en.wikipedia.org/wiki/Category:Lang-x_templates
Object.keys(languages).forEach((k) => {
  inline['lang-' + k] = inline['lang-de'];
});
module.exports = inline;
