const pipeSplit = require('../_parsers/pipeSplit');
const pipeList = require('../_parsers/pipeList');

let templates = {
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': (tmpl, r) => {
    let order = ['taxon', 'item'];
    let obj = pipeSplit(tmpl, order);
    r.templates.push(obj);
    return '';
  },

  'climate chart': (tmpl, r) => {
    let list = pipeList(tmpl).data;
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
    let obj = pipeSplit(tmpl, ['number', 'text']);
    r.templates.push(obj);
    return `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text || obj.number}]`;
  },
  //https://en.wikipedia.org/wiki/Template:Chem2
  chem2: (tmpl, r) => {
    let obj = pipeSplit(tmpl, ['equation']);
    r.templates.push(obj);
    return obj.equation;
  },
};
module.exports = templates;
