const setDefaults = require('../_lib/setDefaults');
const toLatex = require('./toLatex');
const toHtml = require('./toHtml');
const toMarkdown = require('./toJson');
const toJson = require('./toJson');
const defaults = {};

//also called 'citations'
const Reference = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods = {
  title: function() {
    let data = this.data;
    return data.title || data.encyclopedia || data.author || '';
  },
  links: function(n) {
    let arr = [];
    if (typeof n === 'number') {
      return arr[n];
    }
    //grab a specific link..
    if (typeof n === 'number') {
      return arr[n];
    } else if (typeof n === 'string') { //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find(o => o.page === n);
      return link === undefined ? [] : [link];
    }
    return arr || [];
  },
  text: function() {
    return ''; //nah, skip these.
  },
  markdown: function(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html: function(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  latex: function(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  json: function(options) {
    options = setDefaults(options, defaults);
    return toJson(this, options);
  }
};
Object.keys(methods).forEach((k) => {
  Reference.prototype[k] = methods[k];
});
module.exports = Reference;
