const toMarkdown = require('../../output/markdown/image');
const toHtml = require('../../output/html/image');
//
const Image = function(data, doc) {
  this.data = data;
  this.document = doc;
};

const methods = {
  toMarkdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  toHtml : function(options) {
    options = options || {};
    return toHtml(this, options);
  }
};

Object.keys(methods).forEach((k) => {
  Image.prototype[k] = methods[k];
});
module.exports = Image;
