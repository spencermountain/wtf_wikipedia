const aliasList = require('../lib/aliases');
const setDefaults = require('../lib/setDefaults');
const toJson = require('./toJson');
const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toLatex = require('./toLatex');
const defaults = {};

const toText = (list, options) => {
  return list.map((s) => {
    let str = s.text(options);
    return ' * ' + str;
  }).join('\n');
};

const List = function(data, wiki) {
  this.data = data;
  //hush this property in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

const methods = {
  wikitext() {
    return this.wiki;
  },
  links() {
    let links = [];
    this.data.forEach((s) => {
      links = links.concat(s.links());
    });
    return links;
  },
  markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  json(options) {
    options = setDefaults(options, defaults);
    return toJson(this, options);
  },
  text() {
    return toText(this.data);
  }
};

Object.keys(methods).forEach((k) => {
  List.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach((k) => {
  List.prototype[k] = methods[aliasList[k]];
});
module.exports = List;
