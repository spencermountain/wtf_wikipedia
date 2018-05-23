const pipeSplit = require('../parsers/pipeSplit');
const keyValue = require('../parsers/keyValue');
const sisterProjects = require('./sisters');

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

  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': (tmpl) => {
    let data = keyValue(tmpl);
    let links = {};
    Object.keys(sisterProjects).forEach((k) => {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k].text();
      }
    });
    return {
      template: 'sister project links',
      links: links
    };
  },

  //https://en.wikipedia.org/wiki/Template:Subject_bar
  'subject bar': (tmpl) => {
    let data = keyValue(tmpl);
    Object.keys(data).forEach((k) => {
      data[k] = data[k].text();
      if (sisterProjects.hasOwnProperty(k)) {
        data[sisterProjects[k]] = data[k];
        delete data[k];
      }
    });
    return {
      template: 'subject bar',
      links: data
    };
  },
};
//aliases
interwikis.m = interwikis.mention;
interwikis['m-self'] = interwikis.mention;
interwikis.l = interwikis.link;
interwikis.ll = interwikis.link;
interwikis['l-self'] = interwikis.link;
module.exports = interwikis;
