const toMarkdown = require('../output/markdown/infobox');
const toHtml = require('../output/html/infobox');
//a formal key-value data table about a topic
const Infobox = function(obj) {
  this.template = obj.template;
  this.data = obj.data;
// this.type = this.template; //duplicate
};

const methods = {
  markdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
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
