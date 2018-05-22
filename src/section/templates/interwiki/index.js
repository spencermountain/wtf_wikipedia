const pipeSplit = require('../parsers/pipeSplit');
//
const interwikis = {
  /* mostly wiktionary*/
  etyl: (tmpl) => {
    let order = ['lang', 'page'];
    return pipeSplit(tmpl, order).page || '';
  },
  mention: (tmpl) => {
    let order = ['lang', 'page'];
    return pipeSplit(tmpl, order).page || '';
  },
  link: (tmpl) => {
    let order = ['lang', 'page'];
    return pipeSplit(tmpl, order).page || '';
  },
};
//aliases
interwikis.m = interwikis.mention;
interwikis['m-self'] = interwikis.mention;
interwikis.l = interwikis.link;
interwikis.ll = interwikis.link;
interwikis['l-self'] = interwikis.link;
module.exports = interwikis;
