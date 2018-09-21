const toHtml = require('./toHtml');
const toMarkdown = require('./toMarkdown');
const toLatex = require('./toLatex');
const aliasList = require('../lib/aliases');

const Table = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods = {
  links(n) {
    let links = [];
    this.data.forEach((r) => {
      Object.keys(r).forEach((k) => {
        links = links.concat(r[k].links());
      });
    });
    //grab a specific link..
    if (typeof n === 'number') {
      return links[n];
    } else if (typeof n === 'string') { //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = links.find(o => o.page === n);
      return link === undefined ? [] : [link];
    }
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
  keyValue(options) {
    let rows = this.json(options);
    rows.forEach((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text;
      });
    });
    return rows;
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
