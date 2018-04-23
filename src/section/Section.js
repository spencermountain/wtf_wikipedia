const toMarkdown = require('../output/markdown/section');
const toHtml = require('../output/html/section');
const Sentence = require('../sentence/Sentence');
const defaults = require('../lib/defaults');

//the stuff between headings - 'History' section for example
const Section = function(data) {
  this.data = data;
  this.title = data.title;
  this.depth = data.depth;
  this.doc = null;
// this.sentences = data.sentences;
};

const methods = {
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
    if (n !== undefined) {
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
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  tables: function(n) {
    if (n !== undefined) {
      return this.data.tables[n];
    }
    return this.data.tables || [];
  },
  templates: function() {
    return this.data.templates || [];
  },
  lists: function(n) {
    if (n !== undefined) {
      return this.data.lists[n];
    }
    return this.data.lists || [];
  },
  interwiki: function(n) {
    if (n !== undefined) {
      return this.data.interwiki[n];
    }
    return this.data.interwiki || [];
  },
  images: function(n) {
    if (n !== undefined) {
      return this.data.images[n];
    }
    return this.data.images || [];
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
  children: function() {
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

  toMarkdown : function(options) {
    options = Object.assign(defaults, options || {});
    return toMarkdown(this, options);
  },
  toHtml : function(options) {
    options = Object.assign(defaults, options || {});
    return toHtml(this, options);
  },
  toPlaintext : function(options) {
    options = Object.assign(defaults, options || {});
    return this.sentences().map(s => s.toPlaintext(options)).join(' ');
  },
  toJSON : function() {
    return this.data;
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
