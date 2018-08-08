const toHtml = require('./toHtml');
const Table = function(data) {
  this.rows = data;
};

const methods = {
  wikitext() {
    return this.wiki;
  },
  json() {
    return this.rows.map((o) => {
      let row = {};
      Object.keys(o).forEach((k) => {
        row[k] = o[k].json();
      });
      return row;
    });
  },
  html() {
    return toHtml(this.rows);
  }
};
Object.keys(methods).forEach((k) => {
  Table.prototype[k] = methods[k];
});
module.exports = Table;
