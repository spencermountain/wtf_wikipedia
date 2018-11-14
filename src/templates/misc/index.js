const pipeSplit = require('../_parsers/pipeSplit');

const misc = {

  'uss': (tmpl, r) => {
    let order = ['ship', 'id'];
    let obj = pipeSplit(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'isbn': (tmpl, r) => {
    let order = ['id', 'id2', 'id3'];
    let obj = pipeSplit(tmpl, order);
    r.templates.push(obj);
    return 'ISBN: ' + (obj.id || '');
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
  //https://en.wikipedia.org/wiki/Template:Based_on
  'based on': (tmpl, r) => {
    let obj = pipeSplit(tmpl, ['title', 'author']);
    r.templates.push(obj);
    return `${obj.title} by ${obj.author || ''}`;
  },
  '__throw-wtf-error': () => {
    //okay you asked for it!
    throw new Error('Intentional error thrown from wtf-wikipedia!');
  }
};
module.exports = misc;
