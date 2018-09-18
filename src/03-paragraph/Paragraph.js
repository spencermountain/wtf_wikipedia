let Sentence = require('../04-sentence/Sentence');
const toJSON = require('./toJson');
const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toLatex = require('./toLatex');
const setDefaults = require('../lib/setDefaults');
const defaults = {
  sentences: true
};

class Paragraph {
  constructor(data) {
    this.data = data;
  }
  wikitext() {
    return this.data.wiki;
  }
  sentences(n) {
    let arr = this.data.sentences.map(s => {
      s = new Sentence(s);
      return s;
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr || [];
  }
  references() {
    return this.data.references;
  }
  links(n) {
    let arr = this.sentences().map(s => {
      s.links();
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr || [];
  }
  markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  }
  html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  }
  text(options) {
    options = setDefaults(options, defaults);
    return this.sentences()
      .map(s => s.text(options))
      .join(' ');
  }
  latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  }
  json(options) {
    options = setDefaults(options, defaults);
    return toJSON(this, options);
  }
}
module.exports = Paragraph;
