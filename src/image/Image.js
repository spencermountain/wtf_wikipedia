const Hashes = require('jshashes');
const fetch = require('cross-fetch');
const toMarkdown = require('../output/markdown/image');
const toHtml = require('../output/html/image');
const server = 'https://upload.wikimedia.org/wikipedia/commons/';

const encodeTitle = function(file) {
  let title = file.replace(/^(image|file?)\:/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');
  return title;
};

//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
const makeSrc = function(file) {
  let title = encodeTitle(file);
  let hash = new Hashes.MD5().hex(title);
  let path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/';
  title = encodeURIComponent(title);
  path += title;
  return path;
};

//the class for our image generation functions
const Image = function(file) {
  this.file = file;
  this.text = ''; //to be compatible as an infobox value
};

const methods = {
  url() {
    return server + makeSrc(this.file);
  },
  thumbnail(size) {
    size = size || 300;
    let path = makeSrc(this.file);
    let title = encodeTitle(this.file);
    title = encodeURIComponent(title);
    return server + 'thumb/' + path + '/' + size + 'px-' + title;
  },
  format() {
    let arr = this.file.split('.');
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
  html : function(options) {
    options = options || {};
    return toHtml(this, options);
  },
  json: function() {
    return {
      file: this.file,
      url: this.url(),
      thumb: this.thumbnail(),
    };
  }
};

Object.keys(methods).forEach((k) => {
  Image.prototype[k] = methods[k];
});
//aliases
Image.prototype.src = Image.prototype.url;
Image.prototype.thumb = Image.prototype.thumbnail;
module.exports = Image;
