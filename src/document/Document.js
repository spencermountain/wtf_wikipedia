const parse = require('./parse');
const getImages = require('./images');
const toMarkdown = require('../output/markdown');
const toHtml = require('../output/html');

//
const Document = function(wiki, options) {
  this.options = options || {};
  this.data = parse(wiki, this.options);
};

const methods = {
  isRedirect : function() {
    return this.data.type === 'redirect';
  },
  // followRedirect : function() {
  //   return p
  // },
  categories : function(n) {
    if (n !== undefined) {
      return this.data.categories[n];
    }
    return this.data.categories;
  },
  sections : function(n) {
    if (n !== undefined) {
      return this.data.sections[n];
    }
    return this.data.sections;
  },
  sentences : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      sec.sentences().forEach((s) => {
        arr.push(s);
      });
    });
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  images : function(n) {
    let arr = getImages(this);
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  links : function(n) {
    let arr = [];
    this.sentences().forEach((s) => {
      s.links.forEach((l) => {
        arr.push(l);
      });
    });
    if (n !== undefined) {
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
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  citations : function(n) {
    if (n !== undefined) {
      return this.data.citations[n];
    }
    return this.data.citations;
  },
  infoboxes : function(n) {
    if (n !== undefined) {
      return this.data.infoboxes[n];
    }
    return this.data.infoboxes;
  },
  coordinates : function(n) {
    if (n !== undefined) {
      return this.data.coordinates[n];
    }
    return this.data.coordinates;
  },
  toPlaintext : function(options) {
    options = options || {};
    let arr = this.sections().map(sec => sec.toPlaintext(options));
    return arr.join('\n\n');
  },
  toMarkdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  toHtml : function(options) {
    options = options || {};
    return toHtml(this, options);
  }
};

Object.keys(methods).forEach((k) => {
  Document.prototype[k] = methods[k];
});
//alias this one
Document.prototype.toHTML = Document.prototype.toHtml;

module.exports = Document;
