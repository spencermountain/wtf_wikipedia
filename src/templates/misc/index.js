const parse = require('../_parsers/parse');

const misc = {
  'timeline': (tmpl, r) => {
    let data = parse(tmpl);
    r.templates.push(data);
    return '';
  },
  'uss': (tmpl, r) => {
    let order = ['ship', 'id'];
    let obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'isbn': (tmpl, r) => {
    let order = ['id', 'id2', 'id3'];
    let obj = parse(tmpl, order);
    r.templates.push(obj);
    return 'ISBN: ' + (obj.id || '');
  },
  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: (tmpl, r) => {
    let data = parse(tmpl, ['name', 'from', 'to', 'end']);
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
    let obj = parse(tmpl, ['title', 'author']);
    r.templates.push(obj);
    return `${obj.title} by ${obj.author || ''}`;
  },
  //https://en.wikipedia.org/wiki/Template:Video_game_release
  'video game release': (tmpl, r) => {
    let order = ['region', 'date', 'region2', 'date2', 'region3', 'date3', 'region4', 'date4'];
    let obj = parse(tmpl, order);
    let template = {
      template: 'video game release',
      releases: []
    };
    for(let i = 0; i < order.length; i += 2) {
      if (obj[order[i]]) {
        template.releases.push({
          region: obj[order[i]],
          date: obj[order[i + 1]],
        });
      }
    }
    r.templates.push(template);
    let str = template.releases.map((o) => `${o.region}: ${o.date || ''}`).join('\n\n');
    return '\n' + str + '\n';
  },
  tryit: (tmpl) => {
    let obj = parse(tmpl);
    console.log(obj);
    return '';
  },
  '__throw-wtf-error': () => {
    //okay you asked for it!
    throw new Error('Intentional error thrown from wtf-wikipedia!');
  }
};
module.exports = misc;
