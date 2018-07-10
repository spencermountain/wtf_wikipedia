const parse = require('./index');
const sectionMap = require('./_sectionMap');
const toMarkdown = require('../output/markdown');
const toHtml = require('../output/html');
const toJSON = require('../output/json');
const toLatex = require('../output/latex');
const setDefaults = require('../lib/setDefaults');

const defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  citations: true,
  images: true,
  sentences: true,
};

//
const Document = function(wiki, options) {
  this.options = options || {};
  this.data = parse(wiki, this.options);

  // preserve wiki sources in Document to access
  Object.defineProperty(this, 'wiki', {
    enumerable: false, // hide it in console.logs
    value: wiki
  });
};

const methods = {
  title : function() {
    if (this.options.title) {
      return this.options.title;
    }
    let guess = null;
    //guess the title of this page from first sentence bolding
    let sen = this.sentences(0);
    if (sen) {
      guess = sen.bolds(0);
    }
    return guess;
  },
  // allow reparsing after alteration of downloaded wiki source
  reparse : function () {
    this.data = parse(this.wiki, this.options);
  },
  wikitext : function() {
    return this.wiki;
  },
  isRedirect : function() {
    return this.data.type === 'redirect';
  },
  isDisambiguation : function() {
    return this.data.type === 'disambiguation';
  },
  categories : function(clue) {
    if (typeof clue === 'number') {
      return this.data.categories[clue];
    }
    return this.data.categories || [];
  },
  sections : function(clue) {
    let arr = this.data.sections || [];
    arr.forEach((sec) => sec.doc = this);
    //grab a specific section, by its title
    if (typeof clue === 'string') {
      let str = clue.toLowerCase().trim();
      return arr.find((s) => {
        return s.title().toLowerCase() === str;
      });
    }
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
  },
  sentences : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      sec.sentences().forEach((s) => {
        arr.push(s);
      });
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  images : function(clue) {
    let arr = sectionMap(this, 'images', null);
    //grab image from infobox, first
    this.infoboxes().forEach((info) => {
      if (info.data.image) {
        arr.unshift(info.image()); //put it at the top
      }
    });
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
  },
  links : function(clue) {
    return sectionMap(this, 'links', clue);
  },
  tables : function(clue) {
    return sectionMap(this, 'tables', clue);
  },
  templates : function(clue) {
    return sectionMap(this, 'templates', clue);
  },
  infoboxes : function(clue) {
    return sectionMap(this, 'infoboxes', clue);
  },
  citations : function(clue) {
    return sectionMap(this, 'citations', clue);
  },
  coordinates : function(clue) {
    return sectionMap(this, 'coordinates', clue);
  },
  plaintext : function(options) {
    options = setDefaults(options, defaults);
    let arr = this.sections().map(sec => sec.plaintext(options));
    return arr.join('\n\n');
  },
  markdown : function(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  latex : function(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  html : function(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  json : function(options) {
    return toJSON(this, options);
  },
  debug: function() {
    console.log('\n');
    this.sections().forEach((sec) => {
      let indent = ' - ';
      for(let i = 0; i < sec.depth; i += 1) {
        indent = ' -' + indent;
      }
      console.log(indent + (sec.title() || '(Intro)'));
    });
  }
};

//add singular-methods
let plurals = ['sections', 'infoboxes', 'sentences', 'citations', 'coordinates', 'tables', 'links', 'images', 'categories'];
plurals.forEach((fn) => {
  let sing = fn.replace(/ies$/, 'y');
  sing = sing.replace(/e?s$/, '');
  methods[sing] = function(n) {
    let res = this[fn](n);
    if (res.length) {
      return res[0] || null;
    }
    return res;
  };
});

Object.keys(methods).forEach((k) => {
  Document.prototype[k] = methods[k];
});
//alias this one
Document.prototype.toHTML = Document.prototype.html;
Document.prototype.isDisambig = Document.prototype.isDisambiguation;
Document.prototype.toJson = Document.prototype.json;
Document.prototype.text = Document.prototype.plaintext;
Document.prototype.references = Document.prototype.citations;
Document.prototype.original = Document.prototype.wikitext;
Document.prototype.wikiscript = Document.prototype.wikitext;

module.exports = Document;
