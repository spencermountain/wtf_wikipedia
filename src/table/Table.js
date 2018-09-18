const toHtml = require('./toHtml');
const toMarkdown = require('./toMarkdown');
const toLatex = require('./toLatex');
const aliasList = require('../lib/aliases');

const Table = function(data) {
  this.data = data;
};

const methods = {
  links() {
    let links = [];
    this.data.forEach((r) => {
      Object.keys(r).forEach((k) => {
        links = links.concat(r[k].links());
      });
    });
    return links;
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
  },
  text() {
    return '';
  }
};
Object.keys(methods).forEach((k) => {
  Table.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach((k) => {
  Table.prototype[k] = methods[aliasList[k]];
});
module.exports = Table;
