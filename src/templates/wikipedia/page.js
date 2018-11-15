const keyValue = require('../_parsers/keyValue');
const getInside = require('../_parsers/inside');
const pipeSplit = require('../_parsers/pipeSplit');
const pipeList = require('../_parsers/pipeList');
const Image = require('../../image/Image');

const sisterProjects = {
  wikt: 'wiktionary',
  commons: 'commons',
  c: 'commons',
  commonscat: 'commonscat',
  n: 'wikinews',
  q: 'wikiquote',
  s: 'wikisource',
  a: 'wikiauthor',
  b: 'wikibooks',
  voy: 'wikivoyage',
  v: 'wikiversity',
  d: 'wikidata',
  species: 'wikispecies',
  m: 'meta',
  mw: 'mediawiki'
};

const parsers = {

  'book bar': (tmpl, r) => {
    let obj = pipeList(tmpl);
    r.templates.push(obj);
    return '';
  },

  main: (tmpl, r) => {
    let obj = getInside(tmpl);
    obj = {
      template: 'main',
      page: obj.data
    };
    r.templates.push(obj);
    return '';
  },
  wide_image: (tmpl, r) => {
    let obj = getInside(tmpl);
    obj = {
      template: 'wide_image',
      image: obj.data
    };
    r.templates.push(obj);
    return '';
  },

  //same in every language.
  citation: (tmpl, r) => {
    let data = keyValue(tmpl);
    let obj = {
      template: 'citation',
      data: data
    };
    r.templates.push(obj);
    return '';
  },

  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: (tmpl, r) => {
    let data = pipeList(tmpl).data;
    let links = [];
    for(let i = 1; i < data.length; i += 2) {
      links.push({
        page: data[i + 1],
        desc: data[i]
      });
    }
    let obj = {
      template: 'redirect',
      redirect: data[0],
      links: links
    };
    r.templates.push(obj);
    return '';
  },

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, r) => {
    let order = ['id', 'name', 'type'];
    let data = pipeSplit(tmpl, order);
    let obj = {
      template: 'citation',
      type: 'gnis',
      data: data
    };
    r.templates.push(obj);
    return '';
  },
  'sfn': (tmpl, r) => {
    let order = ['author', 'year', 'location'];
    let data = pipeSplit(tmpl, order);
    let obj = {
      template: 'citation',
      type: 'sfn',
      data: data
    };
    r.templates.push(obj);
    return '';
  },
  'audio': (tmpl, r) => {
    let order = ['file', 'text', 'type'];
    let obj = pipeSplit(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'portal': (tmpl, r) => {
    let order = ['portal', 'portal2', 'portal3', 'portal4', 'portal5', 'portal6', 'portal7'];
    let obj = pipeSplit(tmpl, order);
    let portals = order.map((str) => obj[str]);
    portals = portals.filter(s => s);
    r.templates.push({
      template: 'portal',
      list: portals
    });
    return '';
  },
  'spoken wikipedia': (tmpl, r) => {
    let order = ['file', 'date'];
    let obj = pipeSplit(tmpl, order);
    obj.template = 'audio';
    r.templates.push(obj);
    return '';
  },

  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': (tmpl, r) => {
    let data = keyValue(tmpl);
    let links = {};
    Object.keys(sisterProjects).forEach((k) => {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k]; //.text();
      }
    });
    let obj = {
      template: 'sister project links',
      links: links
    };
    r.templates.push(obj);
    return '';
  },

  //https://en.wikipedia.org/wiki/Template:Subject_bar
  'subject bar': (tmpl, r) => {
    let data = keyValue(tmpl);
    Object.keys(data).forEach((k) => {
      if (sisterProjects.hasOwnProperty(k)) {
        data[sisterProjects[k]] = data[k];
        delete data[k];
      }
    });
    let obj = {
      template: 'subject bar',
      links: data
    };
    r.templates.push(obj);
    return '';
  },
  'short description': (tmpl, r) => {
    let data = pipeList(tmpl);
    let obj = {
      template: data.template,
      description: data.data[0]
    };
    r.templates.push(obj);
    return '';
  },
  'good article': (tmpl, r) => {
    let obj = {
      template: 'Good article'
    };
    r.templates.push(obj);
    return '';
  },
  'coord missing': (tmpl, r) => {
    let obj = {
      template: 'coord missing'
    };
    r.templates.push(obj);
    return '';
  },
  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  'gallery': (tmpl, r) => {
    let obj = pipeList(tmpl);
    let images = obj.data.filter(line => /^ *File ?:/.test(line));
    images = images.map((file) => {
      let img = {
        file: file
      };
      return new Image(img).json();
    });
    obj = {
      template: 'gallery',
      images: images
    };
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:See_also
  'see also': (tmpl, r) => {
    let order = ['1', '2', '3', '4', '5', '6', '7'];
    let obj = pipeSplit(tmpl, order);
    let pages = [];
    order.forEach((o) => {
      if (obj[o]) {
        let link = {
          page: obj[o]
        };
        if (obj['l' + o]) {
          link.text = obj['l' + o];
        }
        pages.push(link);
      }
    });
    r.templates.push({
      template: 'see also',
      pages: pages
    });
    return '';
  },
  'italic title': (tmpl, r) => {
    r.templates.push({
      template: 'italic title'
    });
    return '';
  },
  'unreferenced': (tmpl, r) => {
    let order = ['date'];
    let obj = pipeSplit(tmpl, order);
    obj.template = 'unreferenced';
    r.templates.push(obj);
    return '';
  }
};
//aliases
parsers['cite'] = parsers.citation;
parsers['sfnref'] = parsers.sfn;
parsers['harvid'] = parsers.sfn;
parsers['harvnb'] = parsers.sfn;
parsers['redir'] = parsers.redirect;
parsers['sisterlinks'] = parsers['sister project links'];
parsers['main article'] = parsers['main'];

module.exports = parsers;
