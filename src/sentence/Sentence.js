const toHtml = require('./toHtml');
const toMarkdown = require('./toMarkdown');
const toJSON = require('./toJson');
const toLatex = require('./toLatex');
const aliasList = require('../lib/aliases');

//where we store the formatting, link, date information
const Sentence = function(data, wiki) {
  this.data = data;
  //hush this property in console
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

const methods = {
  links: function(n) {
    let arr = this.data.links || [];
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  bolds: function(n) {
    let arr = [];
    if (this.data && this.data.fmt && this.data.fmt.bold) {
      arr = this.data.fmt.bold || [];
    }
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  italics: function(n) {
    let arr = [];
    if (this.data && this.data.fmt && this.data.fmt.italic) {
      arr = this.data.fmt.italic || [];
    }
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  dates: function(n) {
    let arr = [];
    if (this.data && this.data.dates) {
      arr = this.data.dates || [];
    }
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  markdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  html : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  text : function() {
    return this.data.text || '';
  },
  json : function(options) {
    return toJSON(this, options);
  },
  latex : function(options) {
    return toLatex(this, options);
  }
};

Object.keys(methods).forEach((k) => {
  Sentence.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach((k) => {
  Sentence.prototype[k] = methods[aliasList[k]];
});
Sentence.prototype.italic = Sentence.prototype.italics;
Sentence.prototype.bold = Sentence.prototype.bolds;
Sentence.prototype.plaintext = Sentence.prototype.text;

module.exports = Sentence;
