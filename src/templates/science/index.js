const parse = require('../_parsers/parse');

let templates = {
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': (tmpl, r) => {
    let order = ['taxon', 'item'];
    let obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },

  'climate chart': (tmpl, r) => {
    let list = parse(tmpl).list || [];
    let title = list[0];
    let source = list[38];
    list = list.slice(1);
    //amazingly, they use '−' symbol here instead of negatives...
    list = list.map((str) => {
      if (str && str[0] === '−') {
        str = str.replace(/−/, '-');
      }
      return str;
    });
    let months = [];
    //groups of three, for 12 months
    for(let i = 0; i < 36; i += 3) {
      months.push({
        low: Number(list[i]),
        high: Number(list[i + 1]),
        precip: Number(list[i + 2])
      });
    }
    let obj = {
      template: 'climate chart',
      data: {
        title: title,
        source: source,
        months: months
      }
    };
    r.templates.push(obj);
    return '';
  },
  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: (tmpl, r) => {
    let obj = parse(tmpl, ['number', 'text']);
    r.templates.push(obj);
    return `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text || obj.number}]`;
  },
  //https://en.wikipedia.org/wiki/Template:Chem2
  chem2: (tmpl, r) => {
    let obj = parse(tmpl, ['equation']);
    r.templates.push(obj);
    return obj.equation;
  },
  //https://en.wikipedia.org/wiki/Template:Sky
  sky: (tmpl, r) => {
    let obj = parse(tmpl, ['asc_hours', 'asc_minutes', 'asc_seconds', 'dec_sign', 'dec_degrees', 'dec_minutes', 'dec_seconds', 'distance']);
    let template = {
      template: 'sky',
      ascension: {
        hours: obj.asc_hours,
        minutes: obj.asc_minutes,
        seconds: obj.asc_seconds,
      },
      declination: {
        sign: obj.dec_sign,
        degrees: obj.dec_degrees,
        minutes: obj.dec_minutes,
        seconds: obj.dec_seconds,
      },
      distance: obj.distance
    };
    r.templates.push(template);
    return '';
  },
};
module.exports = templates;
