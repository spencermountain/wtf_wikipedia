const sectionMap = require('./_sectionMap');
const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toJSON = require('./toJson');
const toLatex = require('./toLatex');
const setDefaults = require('../_lib/setDefaults');
const aliasList = require('../_lib/aliases');
const Image = require('../image/Image');

const defaults = {
  tables: true,
  lists: true,
  paragraphs: true,
};

//
const Document = function(data, options) {
  this.options = options || {};
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods = {
  title : function() {
    if (this.options.title) {
      return this.options.title;
    }
    let guess = null;
    //guess the title of this page from first sentence bolding
    let sen = this.sentences(0);
    if (sen) {
      guess = sen.bolds(0);
    }
    return guess;
  },
  isRedirect : function() {
    return this.data.type === 'redirect';
  },
  redirectTo: function() {
    return this.data.redirectTo;
  },
  isDisambiguation : function() {
    return this.data.type === 'disambiguation';
  },
  categories : function(clue) {
    if (typeof clue === 'number') {
      return this.data.categories[clue];
    }
    return this.data.categories || [];
  },
  sections : function(clue) {
    let arr = this.data.sections || [];
    arr.forEach((sec) => sec.doc = this);
    //grab a specific section, by its title
    if (typeof clue === 'string') {
      let str = clue.toLowerCase().trim();
      return arr.find((s) => {
        return s.title().toLowerCase() === str;
      });
    }
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
  },
  paragraphs : function(n) {
    let arr = [];
    this.data.sections.forEach((s) => {
      arr = arr.concat(s.paragraphs());
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  paragraph : function(n) {
    let arr = this.paragraphs() || [];
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr[0];
  },
  sentences : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      arr = arr.concat(sec.sentences());
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  images : function(clue) {
    let arr = sectionMap(this, 'images', null);
    //grab image from infobox, first
    this.infoboxes().forEach((info) => {
      if (info.data.image) {
        arr.unshift(info.image()); //put it at the top
      }
    });
    //look for 'gallery' templates, too
    this.templates().forEach((obj) => {
      if (obj.template === 'gallery') {
        obj.images = obj.images || [];
        obj.images.forEach((img) => {
          if (img instanceof Image === false) {
            img = new Image(img);
          }
          arr.push(img);
        });
      }
    });
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
  },
  links : function(clue) {
    return sectionMap(this, 'links', clue);
  },
  interwiki : function(clue) {
    return sectionMap(this, 'interwiki', clue);
  },
  lists : function(clue) {
    return sectionMap(this, 'lists', clue);
  },
  tables : function(clue) {
    return sectionMap(this, 'tables', clue);
  },
  templates : function(clue) {
    return sectionMap(this, 'templates', clue);
  },
  infoboxes : function(clue) {
    return sectionMap(this, 'infoboxes', clue);
  },
  references : function(clue) {
    return sectionMap(this, 'references', clue);
  },
  coordinates : function(clue) {
    return sectionMap(this, 'coordinates', clue);
  },
  text : function(options) {
    options = setDefaults(options, defaults);
    //nah, skip these.
    if (this.isRedirect() === true) {
      return '';
    }
    let arr = this.sections().map(sec => sec.text(options));
    return arr.join('\n\n');
  },
  markdown : function(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  latex : function(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  html : function(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  json : function(options) {
    options = setDefaults(options, defaults);
    return toJSON(this, options);
  },
  debug: function() {
    console.log('\n');
    this.sections().forEach((sec) => {
      let indent = ' - ';
      for(let i = 0; i < sec.depth; i += 1) {
        indent = ' -' + indent;
      }
      console.log(indent + (sec.title() || '(Intro)'));
    });
    return this;
  }
};

//add alises
Object.keys(aliasList).forEach((k) => {
  Document.prototype[k] = methods[aliasList[k]];
});
//add singular-methods, too
let plurals = ['sections', 'infoboxes', 'sentences', 'citations', 'references', 'coordinates', 'tables', 'links', 'images', 'categories'];
plurals.forEach((fn) => {
  let sing = fn.replace(/ies$/, 'y');
  sing = sing.replace(/e?s$/, '');
  methods[sing] = function(n) {
    n = n || 0;
    return this[fn](n);
  };
});

Object.keys(methods).forEach((k) => {
  Document.prototype[k] = methods[k];
});

//alias these ones
Document.prototype.isDisambig = Document.prototype.isDisambiguation;
Document.prototype.citations = Document.prototype.references;
Document.prototype.redirectsTo = Document.prototype.redirectTo;
Document.prototype.redirect = Document.prototype.redirectTo;
Document.prototype.redirects = Document.prototype.redirectTo;

module.exports = Document;
