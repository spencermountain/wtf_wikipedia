const pipeList = require('../_parsers/pipeList');
const parse = require('../_parsers/parse');
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
  //https://en.wikipedia.org/wiki/Template:Book_bar
  'book bar': (tmpl, r) => {
    let obj = parse(tmpl);
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Main
  main: (tmpl, r) => {
    let obj = parse(tmpl);
    r.templates.push(obj);
    return '';
  },
  'wide image': (tmpl, r) => {
    let obj = parse(tmpl, ['file', 'width', 'caption']);
    r.templates.push(obj);
    return '';
  },

  //same in every language.
  citation: (tmpl, r) => {
    let obj = parse(tmpl);
    r.templates.push(obj);
    return '';
  },

  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: (tmpl, r) => {
    let data = parse(tmpl, ['name']);
    let list = data.list || [];
    let links = [];
    for(let i = 0; i < list.length; i += 2) {
      links.push({
        page: list[i + 1],
        desc: list[i]
      });
    }
    let obj = {
      template: 'redirect',
      name: data.name,
      links: links
    };
    r.templates.push(obj);
    return '';
  },

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, r) => {
    let order = ['id', 'name', 'type'];
    let obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'sfn': (tmpl, r) => {
    let order = ['author', 'year', 'location'];
    let obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'audio': (tmpl, r) => {
    let order = ['file', 'text', 'type'];
    let obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Portal
  'portal': (tmpl, r) => {
    let obj = parse(tmpl);
    r.templates.push(obj);
    return '';
  },
  'spoken wikipedia': (tmpl, r) => {
    let order = ['file', 'date'];
    let obj = parse(tmpl, order);
    obj.template = 'audio';
    r.templates.push(obj);
    return '';
  },

  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': (tmpl, r) => {
    let data = parse(tmpl);
    //rename 'wd' to 'wikidata'
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
    let data = parse(tmpl);
    Object.keys(data).forEach((k) => {
      //rename 'voy' to 'wikivoyage'
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
    let data = parse(tmpl, ['description']);
    if (data['1']) {
      console.log(`~=~=~**here**~=~`);
      data.description = data['1'];
      delete data['1'];
    }
    r.templates.push(data);
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
    let obj = parse(tmpl, ['region']);
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
    let data = parse(tmpl);
    r.templates.push(data);
    return '';
  },
  'italic title': (tmpl, r) => {
    r.templates.push({
      template: 'italic title'
    });
    return '';
  },
  'unreferenced': (tmpl, r) => {
    let obj = parse(tmpl, ['date']);
    r.templates.push(obj);
    return '';
  }
};
//aliases
parsers['cite'] = parsers.citation;
parsers['sfnref'] = parsers.sfn;
parsers['harvid'] = parsers.sfn;
parsers['harvnb'] = parsers.sfn;
parsers['unreferenced section'] = parsers.unreferenced;
parsers['redir'] = parsers.redirect;
parsers['sisterlinks'] = parsers['sister project links'];
parsers['main article'] = parsers['main'];

module.exports = parsers;
