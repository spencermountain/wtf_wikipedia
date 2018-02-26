const parse = require('./parse');
const toMarkdown = require('./output/markdown');
const toHTML = require('./output/html');

//
const Document = function(wiki, options) {
  this.options = options || {};
  this.data = parse(wiki, this.options);
};
const methods = {
  isRedirect : function() {
    return this.data.type === 'redirect';
  },
  // followRedirect : function() {
  //   return p
  // },
  categories : function() {
    return this.data.categories;
  },
  sections : function() {
    return this.data.sections;
  },
  toMarkdown : function(options) {
    options = options || {};
    return toMarkdown(this.wiki, options);
  },
  toHtml : function(options) {
    options = options || {};
    return toHTML(this.wiki, options);
  }
};

Object.keys(methods).forEach((k) => {
  Document.prototype[k] = methods[k];
});
Document.prototype.toHTML = Document.prototype.toHtml;

module.exports = Document;
