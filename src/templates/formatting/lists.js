const strip = require('../_parsers/_strip');
const pipes = require('../_parsers/_pipes');
const keyValue = require('../_parsers/keyValue');

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
    return arr.join('\n\n');
  },

  //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': (tmpl, r) => {
    let data = keyValue(tmpl);
    let template = {
      template: 'collapsible list',
      title: data.title,
      list: []
    };
    for(let i = 0; i < 10; i += 1) {
      if (data[i]) {
        template.list.push(data[i]);
      }
    }
    r.templates.push(template);
    let str = '';
    if (template.title) {
      str += `'''${template.title}'''` + '\n\n';
    }
    str += template.list.join('\n\n');
    return str;
  },
  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': (tmpl, r) => {
    let data = keyValue(tmpl);
    let template = {
      template: 'collapsible list',
      title: data.title,
      list: []
    };
    for(let i = 0; i < 10; i += 1) {
      if (data[i]) {
        template.list.push(data[i]);
      }
    }
    r.templates.push(template);
    let lines = template.list.map((str, i) => `${i + 1}. ${str}`);
    return lines.join('\n\n');
  },
  hlist: (tmpl) => {
    let val = strip(tmpl).replace(/^hlist\s?\|/, '');
    let arr = val.split('|');
    arr = arr.filter((s) => s && s.indexOf('=') === -1);
    return arr.join(' · ');
  },
  'pagelist': (tmpl) => {
    let arr = pipes(tmpl).list;
    return arr.join(', ');
  },
  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  'catlist': (tmpl) => {
    let arr = pipes(tmpl).list;
    return arr.join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  'br separated entries': (tmpl) => {
    let arr = pipes(tmpl).list;
    return arr.join('\n\n');
  },
  'comma separated entries': (tmpl) => {
    let arr = pipes(tmpl).list;
    return arr.join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  'anchored list': (tmpl) => {
    let arr = pipes(tmpl).list;
    arr = arr.map((str, i) => `${i + 1}. ${str}`);
    return arr.join('\n\n');
  },
  'bulleted list': (tmpl) => {
    let arr = pipes(tmpl).list;
    arr = arr.filter((f) => f);
    arr = arr.map((str) => '• ' + str);
    return arr.join('\n\n');
  },
// 'pagelist':(tmpl)=>{},
};
//aliases
templates.flatlist = templates.plainlist;
templates.ublist = templates.plainlist;
templates['unbulleted list'] = templates['collapsible list'];
templates['ubl'] = templates['collapsible list'];
templates['bare anchored list'] = templates['anchored list'];
templates['plain list'] = templates['plainlist'];
module.exports = templates;
