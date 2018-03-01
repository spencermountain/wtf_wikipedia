
//structured row/column info within a Section
const Table = function(data, doc) {
  this.data = data;
  this.document = doc;
};

const methods = {
  toMarkdown : function(options) {},
  toHtml : function(options) {}
};

Object.keys(methods).forEach((k) => {
  Table.prototype[k] = methods[k];
});
module.exports = Table;
