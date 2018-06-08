const getInside = require('./parsers/inside');
const pipeSplit = require('./parsers/pipeSplit');
const keyValue = require('./parsers/keyValue');

let templates = {
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
      return obj.content; //.text();
    }
    return '';
  },
  plural: (tmpl) => {
    let order = ['num', 'word'];
    let obj = pipeSplit(tmpl, order);
    let num = Number(obj.num);
    let word = obj.word;
    if (num !== 1) {
      if (/.y$/.test(word)) {
        word = word.replace(/y$/, 'ies');
      } else {
        word += 's';
      }
    }
    return num + ' ' + word;
  },
  'first word': (tmpl) => {
    let str = getInside(tmpl).data || '';
    return str.split(' ')[0];
  },
  'trunc': (tmpl) => {
    let order = ['str', 'len'];
    let obj = pipeSplit(tmpl, order);
    return obj.str.substr(0, obj.len);
  },
  'str mid': (tmpl) => {
    let order = ['str', 'start', 'end'];
    let obj = pipeSplit(tmpl, order);
    let start = parseInt(obj.start, 10) - 1;
    let end = parseInt(obj.end, 10);
    return obj.str.substr(start, end);
  },
  //grab the first, second or third pipe
  'p1': (tmpl) => {
    let order = ['one'];
    return pipeSplit(tmpl, order).one;
  },
  'p2': (tmpl) => {
    let order = ['one', 'two'];
    return pipeSplit(tmpl, order).two;
  },
  'p3': (tmpl) => {
    let order = ['one', 'two', 'three'];
    return pipeSplit(tmpl, order).three;
  },
};

//templates that we simply grab their insides as plaintext
let inline = [
  'nowrap',
  'big',
  'cquote',
  'pull quote',
  'small',
  'smaller',
  'midsize',
  'larger',
  'big',
  'bigger',
  'large',
  'huge',
  'resize',
  'delink', //https://en.wikipedia.org/wiki/Template:Delink
];
inline.forEach((k) => {
  templates[k] = (tmpl) => {
    let inside = getInside(tmpl);
    return (inside && inside['data']) || '';
  };
});


module.exports = templates;
