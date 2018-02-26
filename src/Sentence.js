
//where we store the formatting, link, date information
const Sentence = function(data, doc) {
  this.data = data;
  this.document = doc;
};

const methods = {
  toMarkdown : function(options) {},
  toHtml : function(options) {}
};

Object.keys(methods).forEach((k) => {
  Sentence.prototype[k] = methods[k];
});
module.exports = Sentence;
