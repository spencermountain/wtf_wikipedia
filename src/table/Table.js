const Table = function(data) {};

const methods = {
  wikitext() {
    return this.wiki;
  },
};
Object.keys(methods).forEach((k) => {
  Table.prototype[k] = methods[k];
});
module.exports = Table;
