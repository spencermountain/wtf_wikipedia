const toJSON = require('./toJson');
const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toLatex = require('./toLatex');
const setDefaults = require('../_lib/setDefaults');
const defaults = {
  sentences: true,
  lists: true,
  images: true,
};

const Paragraph = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods = {
  sentences: function(num) {
    if (typeof num === 'number') {
      return this.data.sentences[num];
    }
    return this.data.sentences || [];
  },
  references: function(num) {
    if (typeof num === 'number') {
      return this.data.references[num];
    }
    return this.data.references;
  },
  lists: function(num) {
    if (typeof num === 'number') {
      return this.data.lists[num];
    }
    return this.data.lists;
  },
  images(num) {
    if (typeof num === 'number') {
      return this.data.images[num];
    }
    return this.data.images || [];
  },
  links: function(n) {
    let arr = [];
    this.sentences().forEach(s => {
      arr = arr.concat(s.links(n));
    });
    if (typeof n === 'number') {
      return arr[n];
    } else if (typeof n === 'string') { //grab a specific link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find(o => o.page === n);
      return link === undefined ? [] : [link];
    }
    return arr || [];
  },
  interwiki(num) {
    let arr = [];
    this.sentences().forEach(s => {
      arr = arr.concat(s.interwiki());
    });
    if (typeof num === 'number') {
      return arr[num];
    }
    return arr || [];
  },
  markdown: function(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html: function(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  text: function(options) {
    options = setDefaults(options, defaults);
    let str = this.sentences()
      .map(s => s.text(options))
      .join(' ');
    this.lists().forEach((list) => {
      str += '\n' + list.text();
    });
    return str;
  },
  latex: function(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  json: function(options) {
    options = setDefaults(options, defaults);
    return toJSON(this, options);
  }
};
methods.citations = methods.references;
Object.keys(methods).forEach(k => {
  Paragraph.prototype[k] = methods[k];
});
module.exports = Paragraph;
