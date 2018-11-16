const parse = require('../_parsers/parse');

let templates = {
  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: (tmpl) => {
    let obj = parse(tmpl, ['tag', 'open']);
    const ignore = {
      span: true,
      div: true,
      p: true,
    };
    //pair, empty, close, single
    if (!obj.open || obj.open === 'pair') {
      //just skip generating spans and things..
      if (ignore[obj.tag]) {
        return obj.content || '';
      }
      return `<${obj.tag} ${obj.attribs || ''}>${obj.content || ''}</${obj.tag}>`;
    }
    return '';
  },
  //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
  plural: (tmpl) => {
    let order = ['num', 'word'];
    let obj = parse(tmpl, order);
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
  // https://en.wikipedia.org/wiki/Template:First_word
  'first word': (tmpl) => {
    let obj = parse(tmpl, ['text']);
    let str = obj.text;
    if (obj.sep) {
      return str.split(obj.sep)[0];
    }
    return str.split(' ')[0];
  },
  'trunc': (tmpl) => {
    let order = ['str', 'len'];
    let obj = parse(tmpl, order);
    return obj.str.substr(0, obj.len);
  },
  'str mid': (tmpl) => {
    let order = ['str', 'start', 'end'];
    let obj = parse(tmpl, order);
    let start = parseInt(obj.start, 10) - 1;
    let end = parseInt(obj.end, 10);
    return obj.str.substr(start, end);
  },
  //grab the first, second or third pipe
  'p1': (tmpl) => {
    let order = ['one'];
    return parse(tmpl, order).one;
  },
  'p2': (tmpl) => {
    let order = ['one', 'two'];
    return parse(tmpl, order).two;
  },
  'p3': (tmpl) => {
    let order = ['one', 'two', 'three'];
    return parse(tmpl, order).three;
  },
  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: (tmpl) => {
    let obj = parse(tmpl, ['text']);
    let attrs = '';
    if (obj.list) {
      attrs = '|' + obj.list.join('|');
    }
    return '{{' + (obj.text || '') + attrs + '}}';
  },
  nobold: (tmpl) => {
    return parse(tmpl, ['text']).text || '';
  },
  noitalic: (tmpl) => {
    return parse(tmpl, ['text']).text || '';
  },
  nocaps: (tmpl) => {
    return parse(tmpl, ['text']).text || '';
  },
  //https://en.wikipedia.org/wiki/Template:Visible_anchor
  vanchor: (tmpl) => {
    return parse(tmpl, ['text']).text || '';
  },
  //https://en.wikipedia.org/wiki/Template:Resize
  resize: (tmpl) => {
    return parse(tmpl, ['size', 'text']).text || '';
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
  'delink', //https://en.wikipedia.org/wiki/Template:Delink
];
inline.forEach((k) => {
  templates[k] = (tmpl) => {
    return parse(tmpl, ['text']).text || '';
  };
});

module.exports = templates;
