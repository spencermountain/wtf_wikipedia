
//a formal key-value data table about a topic
const Infobox = function(data, doc) {
  this.data = data;
  this.document = doc;
};

const methods = {
  toMarkdown : function(options) {},
  toHtml : function(options) {}
};

Object.keys(methods).forEach((k) => {
  Infobox.prototype[k] = methods[k];
});
module.exports = Infobox;
