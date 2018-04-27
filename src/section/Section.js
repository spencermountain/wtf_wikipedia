const toMarkdown = require('../output/markdown/section');
const toHtml = require('../output/html/section');
const toJSON = require('../output/json/section');
const Sentence = require('../sentence/Sentence');
const setDefaults = require('../lib/setDefaults');
const defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  citations: true,
  images: true,
  sentences: true,
};

//the stuff between headings - 'History' section for example
const Section = function(data) {
  this.data = data;
  this.depth = data.depth;
  this.doc = null;
//hide this circular property in console.logs..
// Object.defineProperty(this, 'doc', {
//   enumerable: false, // hide it from for..in
//   value: null
// });
};

const methods = {
  title: function() {
    return this.data.title || '';
  },
  index: function() {
    if (!this.doc) {
      return null;
    }
    let index = this.doc.sections().indexOf(this);
    if (index === -1) {
      return null;
    }
    return index;
  },
  indentation: function() {
    return this.depth;
  },
  sentences: function(n) {
    let arr = this.data.sentences.map((s) => {
      s = new Sentence(s);
      return s;
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr || [];
  },
  links: function(n) {
    let arr = [];
    this.lists().forEach((list) => {
      list.forEach((s) => {
        s.links().forEach((link) => arr.push(link));
      });
    });
    //todo: add links from tables..
    // this.tables().forEach((t) => {
    //   t.links().forEach((link) => arr.push(link));
    // });
    this.sentences().forEach((s) => {
      s.links().forEach((link) => arr.push(link));
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  tables: function(n) {
    if (typeof n === 'number') {
      return this.data.tables[n];
    }
    return this.data.tables || [];
  },
  templates: function() {
    return this.data.templates || [];
  },
  lists: function(n) {
    if (typeof n === 'number') {
      return this.data.lists[n];
    }
    return this.data.lists || [];
  },
  interwiki: function(n) {
    if (typeof n === 'number') {
      return this.data.interwiki[n];
    }
    return this.data.interwiki || [];
  },
  images: function(n) {
    if (typeof n === 'number') {
      return this.data.images[n];
    }
    return this.data.images || [];
  },

  //transformations
  remove: function() {
    if (!this.doc) {
      return null;
    }
    let bads = {};
    bads[this.title()] = true;
    //remove children too
    this.children().forEach((sec) => bads[sec.title()] = true);
    let arr = this.doc.data.sections;
    arr = arr.filter(sec => bads.hasOwnProperty(sec.title()) !== true);
    this.doc.data.sections = arr;
    return this.doc;
  },

  //move-around sections like in jquery
  nextSibling: function() {
    if (!this.doc) {
      return null;
    }
    let sections = this.doc.sections();
    let index = this.index();
    for(let i = index + 1; i < sections.length; i += 1) {
      if (sections[i].depth < this.depth) {
        return null;
      }
      if (sections[i].depth === this.depth) {
        return sections[i];
      }
    }
    return null;
  },
  lastSibling: function() {
    if (!this.doc) {
      return null;
    }
    let sections = this.doc.sections();
    let index = this.index();
    return sections[index - 1] || null;
  },
  children: function(n) {
    if (!this.doc) {
      return null;
    }

    let sections = this.doc.sections();
    let index = this.index();
    let children = [];
    //(immediately preceding sections with higher depth)
    if (sections[index + 1] && sections[index + 1].depth > this.depth) {
      for(let i = index + 1; i < sections.length; i += 1) {
        if (sections[i].depth > this.depth) {
          children.push(sections[i]);
        } else {
          break;
        }
      }
    }
    if (typeof n === 'string') {
      n = n.toLowerCase();
      children.forEach((c) => console.log(c));
      return children.find(s => s.title().toLowerCase() === n);
    }
    if (typeof n === 'number') {
      return children[n];
    }
    return children;
  },
  parent: function() {
    if (!this.doc) {
      return null;
    }
    let sections = this.doc.sections();
    let index = this.index();
    for(let i = index; i >= 0; i -= 1) {
      if (sections[i].depth < this.depth) {
        return sections[i];
      }
    }
    return null;
  },

  markdown : function(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html : function(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  plaintext : function(options) {
    options = setDefaults(options, defaults);
    return this.sentences().map(s => s.plaintext(options)).join(' ');
  },
  json : function(options) {
    return toJSON(this, options);
  },
};
//aliases
methods.next = methods.nextSibling;
methods.last = methods.lastSibling;
methods.previousSibling = methods.lastSibling;
methods.previous = methods.lastSibling;
Object.keys(methods).forEach((k) => {
  Section.prototype[k] = methods[k];
});


module.exports = Section;
