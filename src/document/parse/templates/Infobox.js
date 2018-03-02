const toMarkdown = require('../../../output/markdown/infobox');
const toHtml = require('../../../output/html/infobox');
//a formal key-value data table about a topic
const Infobox = function(obj) {
  this.template = obj.template;
  this.data = obj.data;
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
  }
};

Object.keys(methods).forEach((k) => {
  Infobox.prototype[k] = methods[k];
});
module.exports = Infobox;
