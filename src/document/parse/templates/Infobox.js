const toMarkdown = require('../../../output/markdown/infobox');
const toHtml = require('../../../output/html/infobox');
//a formal key-value data table about a topic
const Infobox = function(obj) {
  this.template = obj.template;
  this.data = obj.data;
// this.type = this.template; //duplicate
};

const methods = {
  toMarkdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  toHtml : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  toPlaintext : function() {
    return '';
  },
  toJSON : function() {
    return this.data;
  },
  keyValue : function() {
    return Object.keys(this.data).reduce((h, k) => {
      h[k] = this.data[k].text();
      return h;
    }, {});
  }
};

Object.keys(methods).forEach((k) => {
  Infobox.prototype[k] = methods[k];
});
module.exports = Infobox;
