const keyValue = require('../_parsers/keyValue');
const pipeSplit = require('../_parsers/pipeSplit');

const inline = {
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
  //https://en.wikipedia.org/wiki/Template:Linum
  lino: (tmpl) => {
    let order = ['num'];
    let obj = pipeSplit(tmpl, order);
    return `${obj.num}`;
  },
  linum: (tmpl) => {
    let order = ['num', 'text'];
    let obj = pipeSplit(tmpl, order);
    return `${obj.num}. ${obj.text}`;
  },
  //https://en.wikipedia.org/wiki/Template:Interlanguage_link
  ill: (tmpl) => {
    let order = ['text', 'lan1', 'text1', 'lan2', 'text2'];
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
  'quote': (tmpl, r) => {
    let order = ['text', 'author'];
    let obj = pipeSplit(tmpl, order);
    r.templates.push(obj);
    //create plaintext version
    if (obj.text) {
      let str = `"${obj.text}"`;
      if (obj.author) {
        str += '\n\n';
        str += `    - ${obj.author}`;
      }
      return str + '\n';
    }
    return '';
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
  // https://en.wikipedia.org/wiki/Template:Own
  own: (tmpl) => {
    let obj = pipeSplit(tmpl, ['author']);
    let str = 'Own work';
    if (obj.author) {
      str += ' by ' + obj.author;
    }
    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Sic
  sic: (tmpl, r) => {
    let obj = pipeSplit(tmpl, ['one', 'two', 'three']);
    let word = (obj.one || '') + (obj.two || '');
    //support '[sic?]'
    if (obj.one === '?') {
      word = (obj.two || '') + (obj.three || '');
    }
    r.templates.push({
      template: 'sic',
      word: word
    });
    if (obj.nolink === 'y') {
      return word;
    }
    return `${word} [sic]`;
  }

};


inline['str left'] = inline.trunc;
inline['str crop'] = inline.trunc;

module.exports = inline;
