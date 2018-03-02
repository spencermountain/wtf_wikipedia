const toMarkdown = require('../../../output/markdown/section');
const toHtml = require('../../../output/html/section');

//the stuff between headings - 'History' section for example
const Section = function(data) {
  this.data = data;
  this.title = data.title;
  this.depth = data.depth;
// this.sentences = data.sentences;
};

const methods = {
  indentation: function() {
    return this.data.depth;
  },
  sentences: function(n) {
    if (n !== undefined) {
      return this.data.sentences[n];
    }
    return this.data.sentences || [];
  },
  tables: function(n) {
    if (n !== undefined) {
      return this.data.tables[n];
    }
    return this.data.tables;
  },
  templates: function() {
    return this.data.templates;
  },
  lists: function(n) {
    if (n !== undefined) {
      return this.data.lists[n];
    }
    return this.data.lists;
  },
  images: function(n) {
    if (n !== undefined) {
      return this.data.images[n];
    }
    return this.data.images;
  },
  children: function() {},
  parent: function() {},

  toMarkdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  toHtml : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  toPlaintext : function() {
    return this.sentences().map(a => a.text).join(' ');
  },
  toJSON : function() {
    return this.data;
  },
};

Object.keys(methods).forEach((k) => {
  Section.prototype[k] = methods[k];
});
module.exports = Section;
