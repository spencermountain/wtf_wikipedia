const setDefaults = require('../lib/setDefaults');
const toLatex = require('./toLatex');
const toHtml = require('./toHtml');
const toMarkdown = require('./toJson');
const toJson = require('./toJson');
const defaults = {};

//also called 'citations'
class Reference {
  constructor(data) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data
    });
  }
  title() {
    let data = this.data;
    return data.title || data.encyclopedia || data.author || '';
  }
  links(n) {
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
  }
  text() {
    return ''; //nah, skip these.
  }
  markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  }
  html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  }
  latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  }
  json(options) {
    options = setDefaults(options, defaults);
    return toJson(this, options);
  }
}
module.exports = Reference;
