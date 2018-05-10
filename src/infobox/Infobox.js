const toMarkdown = require('../output/markdown/infobox');
const toHtml = require('../output/html/infobox');
//a formal key-value data table about a topic
const Infobox = function(obj, wiki) {
  this.template = obj.template;
  this.data = obj.data;
  //hush these properties in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

const methods = {
  markdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  wikitext : function() {
    return this.wiki;
  },
  html : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  plaintext : function() {
    return '';
  },
  json : function() {
    return Object.keys(this.data).reduce((h, k) => {
      if (this.data[k]) {
        h[k] = this.data[k].json();
      }
      return h;
    }, {});
  },
  keyValue : function() {
    return Object.keys(this.data).reduce((h, k) => {
      if (this.data[k]) {
        h[k] = this.data[k].text();
      }
      return h;
    }, {});
  }
};

Object.keys(methods).forEach((k) => {
  Infobox.prototype[k] = methods[k];
});
module.exports = Infobox;
