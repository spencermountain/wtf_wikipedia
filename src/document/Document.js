const parse = require('./index');
const toMarkdown = require('../output/markdown');
const toHtml = require('../output/html');
const toLatex = require('../output/latex');
const defaults = require('../lib/defaults');
// const Image = require('../section/image/Image');

//
const Document = function(wiki, options) {
  this.options = options || {};
  this.data = parse(wiki, this.options);
};

const methods = {
  isRedirect : function() {
    return this.data.type === 'redirect';
  },
  isDisambiguation : function() {
    return this.data.type === 'disambiguation';
  },
  // redirectTo : function() {
  //   return p
  // },
  // disambigpages : function() {
  //   return p
  // },
  categories : function(n) {
    if (typeof n === 'number') {
      return this.data.categories[n];
    }
    return this.data.categories || [];
  },
  sections : function(n) {
    let arr = this.data.sections || [];
    arr.forEach((sec) => sec.doc = this);
    //grab a specific section, by its title
    if (typeof n === 'string') {
      let str = n.toLowerCase().trim();
      return arr.find((s) => {
        return s.title.toLowerCase() === str;
      });
    }
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  section(n) {
    let res = this.sections(n);
    if (res.length) {
      return res[0] || null;
    }
    return res;
  },
  sentences : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      sec.sentences().forEach((s) => {
        arr.push(s);
      });
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  images : function(n) {
    let arr = [];
    //grab image from infobox, first
    this.infoboxes().forEach((info) => {
      if (info.data.image) {
        arr.push(info.data.image.data);
      }
    });
    this.sections().forEach((sec) => {
      sec.images().forEach((img) => {
        arr.push(img);
      });
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  links : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      sec.links().forEach((l) => {
        arr.push(l);
      });
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  tables : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      if (sec.tables()) {
        sec.tables().forEach((t) => {
          arr.push(t);
        });
      }
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  citations : function(n) {
    if (typeof n === 'number') {
      return this.data.citations[n];
    }
    return this.data.citations || [];
  },
  infoboxes : function(n) {
    if (typeof n === 'number') {
      return this.data.infoboxes[n];
    }
    return this.data.infoboxes || [];
  },
  coordinates : function(n) {
    if (typeof n === 'number') {
      return this.data.coordinates[n];
    }
    return this.data.coordinates || [];
  },
  plaintext : function(options) {
    options = Object.assign(defaults, options || {});
    let arr = this.sections().map(sec => sec.plaintext(options));
    return arr.join('\n\n');
  },
  markdown : function(options) {
    options = Object.assign(defaults, options || {});
    return toMarkdown(this, options);
  },
  latex : function(options) {
    options = Object.assign(defaults, options || {});
    return toLatex(this, options);
  },
  html : function(options) {
    options = Object.assign(defaults, options || {});
    return toHtml(this, options);
  },
  json : function() {
    return this.data;
  },
  debug: function() {
    console.log('\n');
    this.sections().forEach((sec) => {
      let indent = ' - ';
      for(let i = 0; i < sec.depth; i += 1) {
        indent = ' -' + indent;
      }
      console.log(indent + (sec.title || '(Intro)'));
    });
  }
};

Object.keys(methods).forEach((k) => {
  Document.prototype[k] = methods[k];
});
//alias this one
Document.prototype.toHTML = Document.prototype.html;
Document.prototype.isDisambig = Document.prototype.isDisambiguation;
Document.prototype.toJson = Document.prototype.json;

module.exports = Document;
