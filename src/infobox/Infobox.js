const toMarkdown = require('../output/markdown/infobox');
const toHtml = require('../output/html/infobox');
const Image = require('../image/Image');

//a formal key-value data table about a topic
const Infobox = function(obj, wiki) {
  this._type = obj.type;
  // this.data = obj.data;
  //hush these properties in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: obj.data
  });
};

const methods = {
  type: function() {
    return this._type;
  },
  links: function() {
    let links = [];
    Object.keys(this.data).forEach((k) => {
      this.data[k].links().forEach((l) => links.push(l));
    });
    return links;
  },
  image: function() {
    let obj = this.get('image');
    if (!obj) {
      return null;
    }
    return new Image(obj.text());
  },
  get : function(key) {
    key = key.toLowerCase();
    let keys = Object.keys(this.data);
    for(let i = 0; i < keys.length; i += 1) {
      let tmp = keys[i].toLowerCase().trim();
      if (key === tmp) {
        return this.data[keys[i]];
      }
    }
    return null;
  },
  markdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  wikitext : function() {
    return this.wiki;
  },
  html : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  plaintext : function() {
    return '';
  },
  json : function() {
    return Object.keys(this.data).reduce((h, k) => {
      if (this.data[k]) {
        h[k] = this.data[k].json();
      }
      return h;
    }, {});
  },
  keyValue : function() {
    return Object.keys(this.data).reduce((h, k) => {
      if (this.data[k]) {
        h[k] = this.data[k].text();
      }
      return h;
    }, {});
  }
};
//aliases
methods.template = methods.type;
methods.images = methods.image;
methods.data = methods.keyValue;

Object.keys(methods).forEach((k) => {
  Infobox.prototype[k] = methods[k];
});
module.exports = Infobox;
