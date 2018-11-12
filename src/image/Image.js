const fetch = require('cross-fetch');
const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toLatex = require('./toLatex');
const server = 'https://wikipedia.org/wiki/Special:Redirect/file/';
const aliasList = require('../_lib/aliases');

const encodeTitle = function(file) {
  let title = file.replace(/^(image|file?)\:/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.trim().replace(/ /g, '_');
  return title;
};

//the wikimedia image url is a little silly:
const makeSrc = function(file) {
  let title = encodeTitle(file);
  title = encodeURIComponent(title);
  return title;
};

//the class for our image generation functions
const Image = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods = {
  file() {
    return this.data.file || '';
  },
  alt() {
    let str = this.data.alt || this.data.file || '';
    str = str.replace(/^(file|image):/i, '');
    str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
    return str.replace(/_/g, ' ');
  },
  caption() {
    return this.data.text || '';
  },
  links() {
    return []; //not ready yet
  },
  url() {
    return server + makeSrc(this.file());
  },
  thumbnail(size) {
    size = size || 300;
    let path = makeSrc(this.file());
    return server + path + '?width=' + size;
  },
  format() {
    let arr = this.file().split('.');
    if (arr[arr.length - 1]) {
      return arr[arr.length - 1].toLowerCase();
    }
    return null;
  },
  exists(callback) { //check if the image (still) exists
    return new Promise((cb) => {
      fetch(this.url(), {
        method: 'HEAD',
      }).then(function(res) {
        const exists = res.status === 200;
        //support callback non-promise form
        if (callback) {
          callback(exists);
        }
        cb(exists);
      });
    });
  },
  markdown : function(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  latex : function(options) {
    return toLatex(this, options);
  },
  html : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  json: function() {
    return {
      file: this.file(),
      url: this.url(),
      thumb: this.thumbnail(),
    };
  },
  text: function() {
    return '';
  }
};

Object.keys(methods).forEach((k) => {
  Image.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach((k) => {
  Image.prototype[k] = methods[aliasList[k]];
});
Image.prototype.src = Image.prototype.url;
Image.prototype.thumb = Image.prototype.thumbnail;
module.exports = Image;
