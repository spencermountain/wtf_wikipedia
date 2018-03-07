const toHtml = require('../../../../output/html/sentence');
const toMarkdown = require('../../../../output/markdown/sentence');

//where we store the formatting, link, date information
const Sentence = function(data) {
  this.data = data;
};

const methods = {
  links: function(n) {
    let arr = this.data.links || [];
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  bolds: function(n) {
    if (!this.data || !this.data.fmt || !this.data.fmt.bold) {
      return [];
    }
    let arr = this.data.fmt.bold || [];
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  italics: function(n) {
    if (!this.data || !this.data.fmt || !this.data.fmt.italic) {
      return [];
    }
    let arr = this.data.fmt.italic || [];
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  dates: function(n) {
    if (!this.data || !this.data.dates) {
      return [];
    }
    let arr = this.data.dates || [];
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  toMarkdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  toHtml : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  toPlaintext : function() {
    return this.data.text || '';
  }
};

Object.keys(methods).forEach((k) => {
  Sentence.prototype[k] = methods[k];
});
//aliases
Sentence.prototype.italic = Sentence.prototype.italics;
Sentence.prototype.bold = Sentence.prototype.bolds;
Sentence.prototype.text = Sentence.prototype.toPlaintext;
module.exports = Sentence;
