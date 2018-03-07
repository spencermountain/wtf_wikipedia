const toMarkdown = require('../../../output/markdown/section');
const toHtml = require('../../../output/html/section');
const Sentence = require('./sentence/Sentence');
const defaults = require('../../defaults');

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
    let arr = this.data.sentences.map((s) => {
      s = new Sentence(s);
      return s;
    });
    if (n !== undefined) {
      return arr[n];
    }
    return arr || [];
  },
  links: function(n) {
    let arr = [];
    this.lists().forEach((list) => {
      list.forEach((s) => {
        s.links().forEach((link) => arr.push(link));
      });
    });
    //todo: add links from tables..
    // this.tables().forEach((t) => {
    //   t.links().forEach((link) => arr.push(link));
    // });
    this.sentences().forEach((s) => {
      s.links().forEach((link) => arr.push(link));
    });
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  tables: function(n) {
    if (n !== undefined) {
      return this.data.tables[n];
    }
    return this.data.tables || [];
  },
  templates: function() {
    return this.data.templates || [];
  },
  lists: function(n) {
    if (n !== undefined) {
      return this.data.lists[n];
    }
    return this.data.lists || [];
  },
  interwiki: function(n) {
    if (n !== undefined) {
      return this.data.interwiki[n];
    }
    return this.data.interwiki || [];
  },
  images: function(n) {
    if (n !== undefined) {
      return this.data.images[n];
    }
    return this.data.images || [];
  },
  children: function() {},
  parent: function() {},

  toMarkdown : function(options) {
    options = Object.assign(defaults, options || {});
    return toMarkdown(this, options);
  },
  toHtml : function(options) {
    options = Object.assign(defaults, options || {});
    return toHtml(this, options);
  },
  toPlaintext : function(options) {
    options = Object.assign(defaults, options || {});
    return this.sentences().map(s => s.toPlaintext(options)).join(' ');
  },
  toJSON : function() {
    return this.data;
  },
};

Object.keys(methods).forEach((k) => {
  Section.prototype[k] = methods[k];
});
module.exports = Section;
