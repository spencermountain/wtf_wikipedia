let Sentence = require('../04-sentence/Sentence');
const toJSON = require('./toJson');
const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toLatex = require('./toLatex');
const setDefaults = require('../lib/setDefaults');
const defaults = {
  sentences: true
};

const Paragraph = function(data) {
  this.data = data;
};

const methods = {
  sentences: function(n) {
    let arr = this.data.sentences || [];
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr || [];
  },
  references: function() {
    return this.data.references;
  },
  templates: function() {
    return this.data.templates;
  },
  links: function(n) {
    let arr = this.sentences().map(s => {
      s.links();
    });
    if (typeof n === 'number') {
      return arr[n];
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
