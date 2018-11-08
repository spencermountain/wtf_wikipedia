const strip = require('../_parsers/_strip');

const templates = {
  //newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: (tmpl) => {
    tmpl = strip(tmpl);
    //remove the title
    let arr = tmpl.split('|');
    arr = arr.slice(1);
    tmpl = arr.join('|');
    //split on newline
    arr = tmpl.split(/\n ?\* ?/);
    arr = arr.filter(s => s);
    return arr.join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': (tmpl) => {
    let val = strip(tmpl);
    let arr = val.split('|');
    arr = arr.map(s => s.trim());
    arr = arr.filter(str => /^title ?=/i.test(str) === false);
    return arr.slice(1).join(', ');
  },
  hlist: (tmpl) => {
    let val = strip(tmpl).replace(/^hlist\s?\|/, '');
    let arr = val.split('|');
    arr = arr.filter((s) => s && s.indexOf('=') === -1);
    return arr.join(' · ');
  },
};
//aliases
templates.flatlist = templates.plainlist;
templates.ublist = templates.plainlist;
templates['unbulleted list'] = templates['collapsible list'];
templates['ubl'] = templates['collapsible list'];
templates['ordered list'] = templates['collapsible list'];
module.exports = templates;
