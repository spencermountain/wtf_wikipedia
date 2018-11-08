const pipeSplit = require('../_parsers/pipeSplit');
const pipeList = require('../_parsers/pipeList');

const misc = {
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': (tmpl) => {
    let order = ['taxon', 'item'];
    return pipeSplit(tmpl, order);
  },
  'uss': (tmpl) => {
    let order = ['ship', 'id'];
    return pipeSplit(tmpl, order);
  },

  'climate chart': (tmpl) => {
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
    return {
      template: 'climate chart',
      data: {
        title: title,
        source: source,
        months: months
      }
    };
  },
  '__throw-wtf-error': () => {
    //okay you asked for it!
    throw new Error('Intentional error thrown from wtf-wikipedia!');
  }
};
module.exports = misc;
