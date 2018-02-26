
//the stuff between headings - 'History' section for example
const Section = function(data, doc) {
  this.data = data;
  this.document = doc;
};

const methods = {
  indentation: function() {
    return this.data.depth;
  },
  children: function() {},
  parent: function() {},
  toMarkdown : function(options) {},
  toHtml : function(options) {}
};

Object.keys(methods).forEach((k) => {
  Section.prototype[k] = methods[k];
});
module.exports = Section;
