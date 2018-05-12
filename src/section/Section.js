const toMarkdown = require('../output/markdown/section');
const toHtml = require('../output/html/section');
const toJSON = require('../output/json/section');
const Sentence = require('../sentence/Sentence');
const Infobox = require('../infobox/Infobox');
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
const Section = function(data, wiki) {
  this.data = data;
  this.depth = data.depth;
  this.doc = null;
  //hush these properties in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
  Object.defineProperty(this, 'doc', {
    enumerable: false,
    value: null
  });
};

const methods = {
  title: function() {
    return this.data.title || '';
  },
  wikitext: function() {
    return this.wiki || '';
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
    this.infoboxes().forEach((templ) => {
      templ.links().forEach((link) => arr.push(link));
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
  tables: function(clue) {
    if (typeof clue === 'number') {
      return this.data.tables[clue];
    }
    return this.data.tables || [];
  },
  templates: function(clue) {
    if (typeof clue === 'number') {
      return this.data.templates[clue];
    }
    let arr = this.data.templates || [];
    if (typeof clue === 'string') {
      clue = clue.toLowerCase();
      return arr.filter(o => o.template === clue);
    }
    return arr;
  },
  infoboxes: function(clue) {
    let arr = this.templates('infobox');
    if (typeof clue === 'number') {
      return new Infobox(arr[clue]);
    }
    return arr.map((obj) => {
      return new Infobox(obj);
    });
  },
  lists: function(clue) {
    if (typeof clue === 'number') {
      return this.data.lists[clue];
    }
    return this.data.lists || [];
  },
  interwiki: function(clue) {
    if (typeof clue === 'number') {
      return this.data.interwiki[clue];
    }
    return this.data.interwiki || [];
  },
  images: function(clue) {
    if (typeof clue === 'number') {
      return this.data.images[clue];
    }
    return this.data.images || [];
  },
  citations: function(clue) {
    let arr = this.templates('citation'); //.map(o => o.data);
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
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
      // children.forEach((c) => console.log(c));
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
methods.original = methods.wikitext;
methods.wikiscript = methods.wikitext;
methods.references = methods.citations;
Object.keys(methods).forEach((k) => {
  Section.prototype[k] = methods[k];
});


module.exports = Section;
