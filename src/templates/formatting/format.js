const getInside = require('../_parsers/inside');
const pipeSplit = require('../_parsers/pipeSplit');
const keyValue = require('../_parsers/keyValue');
const strip = require('../_parsers/_strip');
const pipes = require('../_parsers/_pipes');

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
  //https://en.wikipedia.org/wiki/Template:Visible_anchor
  vanchor: (tmpl) => {
    let arr = pipes(tmpl).list;
    return arr[0] || '';
  }
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
