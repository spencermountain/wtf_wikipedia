const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toLatex = require('./toLatex');
const toJson = require('./toJson');
const Image = require('../image/Image');
const aliasList = require('../_lib/aliases');

//a formal key-value data table about a topic
const Infobox = function(obj) {
  this._type = obj.type;
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: obj.data
  });
};

const methods = {
  type: function() {
    return this._type;
  },
  links: function(n) {
    let arr = [];
    Object.keys(this.data).forEach((k) => {
      this.data[k].links().forEach((l) => arr.push(l));
    });
    if (typeof n === 'number') {
      return arr[n];
    } else if (typeof n === 'string') { //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find(o => o.page === n);
      return link === undefined ? [] : [link];
    }
    return arr;
  },
  image: function() {
    let s = this.get('image');
    if (!s) {
      return null;
    }
    let obj = s.json();
    obj.file = obj.text;
    obj.text = '';
    return new Image(obj);
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
  html : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  latex : function(options) {
    options = options || {};
    return toLatex(this, options);
  },
  text : function() {
    return '';
  },
  json : function(options) {
    options = options || {};
    return toJson(this, options);
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

Object.keys(methods).forEach((k) => {
  Infobox.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach((k) => {
  Infobox.prototype[k] = methods[aliasList[k]];
});
Infobox.prototype.data = Infobox.prototype.keyValue;
Infobox.prototype.template = Infobox.prototype.type;
Infobox.prototype.images = Infobox.prototype.image;
module.exports = Infobox;
