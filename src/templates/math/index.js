const parse = require('../_parsers/parse');
// const parseSentence = require('../../04-sentence').oneSentence;

let templates = {

  // https://en.wikipedia.org/wiki/Template:Math
  'math': (tmpl, r) => {
    let obj = parse(tmpl, ['formula']);
    r.templates.push(obj);
    return '\n\n' + (obj.formula || '') + '\n\n';
  },

  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  'frac': (tmpl, r) => {
    let order = ['a', 'b', 'c'];
    let obj = parse(tmpl, order);
    let data = {
      template: 'sfrac',
    };
    if (obj.c) {
      data.integer = obj.a;
      data.numerator = obj.b;
      data.denominator = obj.c;
    } else if (obj.b) {
      data.numerator = obj.a;
      data.denominator = obj.b;
    } else {
      data.numerator = 1;
      data.denominator = obj.a;
    }
    r.templates.push(data);
    if (data.integer) {
      return `${data.integer} ${data.numerator}⁄${data.denominator}`;
    }
    return `${data.numerator}⁄${data.denominator}`;
  },

  //https://en.wikipedia.org/wiki/Template:Radic
  'radic': (tmpl) => {
    let order = ['after', 'before'];
    let obj = parse(tmpl, order);
    return `${obj.before || ''}√${obj.after || ''}`;
  },
};
//aliases
templates['sfrac'] = templates.frac;
templates['sqrt'] = templates.radic;
module.exports = templates;
