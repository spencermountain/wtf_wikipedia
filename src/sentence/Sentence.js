const toHtml = require('../output/html/sentence');
const toMarkdown = require('../output/markdown/sentence');
const toJSON = require('../output/json/sentence');

//where we store the formatting, link, date information
const Sentence = function(data) {
  this.data = data;
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
    if (!this.data || !this.data.fmt || !this.data.fmt.bold) {
      return [];
    }
    let arr = this.data.fmt.bold || [];
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  italics: function(n) {
    if (!this.data || !this.data.fmt || !this.data.fmt.italic) {
      return [];
    }
    let arr = this.data.fmt.italic || [];
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  dates: function(n) {
    if (!this.data || !this.data.dates) {
      return [];
    }
    let arr = this.data.dates || [];
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
  plaintext : function() {
    return this.data.text || '';
  },
  json : function(options) {
    return toJSON(this, options);
  }
};

Object.keys(methods).forEach((k) => {
  Sentence.prototype[k] = methods[k];
});
//aliases
Sentence.prototype.italic = Sentence.prototype.italics;
Sentence.prototype.bold = Sentence.prototype.bolds;
Sentence.prototype.text = Sentence.prototype.plaintext;

module.exports = Sentence;
