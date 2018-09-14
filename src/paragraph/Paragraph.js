let eachSentence = require('../sentence').eachSentence;
let Sentence = require('../sentence/Sentence');
const toJSON = require('./toJson');
const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toLatex = require('./toLatex');
const setDefaults = require('../lib/setDefaults');
const defaults = {
  sentences: true
};

class Paragraph {
  constructor(wiki, section) {
    this.data = {
      wiki: wiki,
      section: section
    };
    this._section = section;
    this.data.sentences = eachSentence(this, wiki);
  }
  wikitext() {
    return this.data.wiki;
  }
  section() {
    return this._section;
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
