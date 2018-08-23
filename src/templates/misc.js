const keyValue = require('./parsers/keyValue');
const getInside = require('./parsers/inside');
const pipeSplit = require('./parsers/pipeSplit');
const pipeList = require('./parsers/pipeList');
const Image = require('../image/Image');

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

  'book bar': pipeList,

  main: (tmpl) => {
    let obj = getInside(tmpl);
    return {
      template: 'main',
      page: obj.data
    };
  },
  wide_image: (tmpl) => {
    let obj = getInside(tmpl);
    return {
      template: 'wide_image',
      image: obj.data
    };
  },


  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': (tmpl) => {
    let order = ['taxon', 'item'];
    return pipeSplit(tmpl, order);
  },
  'uss': (tmpl) => {
    let order = ['ship', 'id'];
    return pipeSplit(tmpl, order);
  },

  //same in every language.
  citation: (tmpl) => {
    let data = keyValue(tmpl);
    return {
      template: 'citation',
      data: data
    };
  },

  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: (tmpl) => {
    let data = pipeList(tmpl).data;
    let links = [];
    for(let i = 1; i < data.length; i += 2) {
      links.push({
        page: data[i + 1],
        desc: data[i]
      });
    }
    return {
      template: 'redirect',
      redirect: data[0],
      links: links
    };
  },

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl) => {
    let order = ['id', 'name', 'type'];
    let obj = pipeSplit(tmpl, order);
    obj.template = 'citation';
    obj.type = 'gnis';
    return obj;
  },
  'sfn': (tmpl) => {
    let order = ['author', 'year', 'location'];
    let obj = pipeSplit(tmpl, order);
    obj.template = 'citation';
    obj.type = 'sfn';
    return obj;
  },
  'audio': (tmpl) => {
    let order = ['file', 'text', 'type'];
    let obj = pipeSplit(tmpl, order);
    return obj;
  },
  'spoken wikipedia': (tmpl) => {
    let order = ['file', 'date'];
    let obj = pipeSplit(tmpl, order);
    obj.template = 'audio';
    return obj;
  },

  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': (tmpl) => {
    let data = keyValue(tmpl);
    let links = {};
    Object.keys(sisterProjects).forEach((k) => {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k]; //.text();
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
  'short description': (tmpl) => {
    let data = pipeList(tmpl);
    return {
      template: data.template,
      description: data.data[0]
    };
  },
  'good article': () => {
    return {
      template: 'Good article'
    };
  },
  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  'gallery': (tmpl) => {
    let obj = pipeList(tmpl);
    let images = obj.data.filter(line => /^ *File ?:/.test(line));
    images = images.map((file) => new Image(file).json());
    return {
      template: 'gallery',
      images: images
    };
  }
};
//aliases
parsers['cite'] = parsers.citation;
parsers['sfnref'] = parsers.sfn;
parsers['harvid'] = parsers.sfn;
parsers['harvnb'] = parsers.sfn;
parsers['redir'] = parsers.redirect;
parsers['sisterlinks'] = parsers['sister project links'];

module.exports = parsers;
