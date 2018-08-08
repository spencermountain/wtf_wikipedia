const toHtml = require('./toHtml');
const toMarkdown = require('./toMarkdown');
const toLatex = require('./toLatex');

const Table = function(data, wiki) {
  this.data = data;
  //hush this property in console
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

const methods = {
  wikitext() {
    return this.wiki;
  },
  json() {
    return this.data.map((o) => {
      let row = {};
      Object.keys(o).forEach((k) => {
        row[k] = o[k].json();
      });
      return row;
    });
  },
  html(options) {
    return toHtml(this.data, options);
  },
  markdown(options) {
    return toMarkdown(this.data, options);
  },
  latex(options) {
    return toLatex(this.data, options);
  }
};
Object.keys(methods).forEach((k) => {
  Table.prototype[k] = methods[k];
});
const aliases = {
  toMarkdown: 'markdown',
  toHtml: 'html',
  HTML: 'html',
  toJSON: 'json',
  toJson: 'json',
  JSON: 'json',
  toLatex: 'latex',
};
Object.keys(aliases).forEach((k) => {
  Table.prototype[k] = methods[aliases[k]];
});
module.exports = Table;
