const toJSON = require('./toJson');
const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toLatex = require('./toLatex');
const setDefaults = require('../lib/setDefaults');
const defaults = {
  sentences: true
};

const Paragraph = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods = {
  sentences: function(num) {
    if (typeof num === 'number') {
      return this.data.sentences[num];
    }
    return this.data.sentences || [];
  },
  references: function(num) {
    if (typeof num === 'number') {
      return this.data.references[num];
    }
    return this.data.references;
  },
  lists: function(num) {
    if (typeof num === 'number') {
      return this.data.lists[num];
    }
    return this.data.lists;
  },
  images(num) {
    if (typeof num === 'number') {
      return this.data.images[num];
    }
    return this.data.images || [];
  },
  links: function(num) {
    let arr = [];
    this.sentences().forEach(s => {
      arr = arr.concat(s.links());
    });
    if (typeof num === 'number') {
      return arr[num];
    }
    return arr || [];
  },
  interwiki(num) {
    let arr = [];
    this.sentences().forEach(s => {
      arr = arr.concat(s.interwiki());
    });
    if (typeof num === 'number') {
      return arr[num];
    }
    return arr || [];
  },
  markdown: function(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html: function(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  text: function(options) {
    options = setDefaults(options, defaults);
    return this.sentences()
      .map(s => s.text(options))
      .join(' ');
  },
  latex: function(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  json: function(options) {
    options = setDefaults(options, defaults);
    return toJSON(this, options);
  }
};
methods.citations = methods.references;
Object.keys(methods).forEach(k => {
  Paragraph.prototype[k] = methods[k];
});
module.exports = Paragraph;
