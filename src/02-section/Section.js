const toMarkdown = require('./toMarkdown');
const toHtml = require('./toHtml');
const toJSON = require('./toJson');
const toLatex = require('./toLatex');
const setDefaults = require('../_lib/setDefaults');
const aliasList = require('../_lib/aliases');

const defaults = {
  tables: true,
  references: true,
  paragraphs: true,
  templates: true,
  infoboxes: true,
};

//the stuff between headings - 'History' section for example
const Section = function(data) {
  this.depth = data.depth;
  this.doc = null;
  Object.defineProperty(this, 'doc', {
    enumerable: false,
    value: null
  });
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
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
    let arr = this.paragraphs().reduce((list, p) => {
      return list.concat(p.sentences());
    }, []);
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr || [];
  },
  paragraphs: function(n) {
    let arr = this.data.paragraphs || [];
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr || [];
  },
  paragraph: function(n) {
    let arr = this.data.paragraphs || [];
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr[0];
  },
  links: function(n) {
    let arr = [];
    this.infoboxes().forEach(templ => {
      templ.links(n).forEach(link => arr.push(link));
    });
    this.sentences().forEach(s => {
      s.links(n).forEach(link => arr.push(link));
    });
    this.tables().forEach(t => {
      t.links(n).forEach(link => arr.push(link));
    });
    this.lists().forEach(list => {
      list.links(n).forEach(link => arr.push(link));
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
  tables: function(clue) {
    if (typeof clue === 'number') {
      return this.data.tables[clue];
    }
    return this.data.tables || [];
  },
  templates: function(clue) {
    let arr = this.data.templates || [];
    if (typeof clue === 'number') {
      return arr[clue];
    }
    if (typeof clue === 'string') {
      clue = clue.toLowerCase();
      return arr.filter(o => o.template === clue || o.name === clue);
    }
    return arr;
  },
  infoboxes: function(clue) {
    let arr = this.data.infoboxes || [];
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
  },
  coordinates: function(clue) {
    let arr = [].concat(this.templates('coord'), this.templates('coor'));
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
  },
  lists: function(clue) {
    let arr = [];
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.lists());
    });
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
  },
  interwiki(num) {
    let arr = [];
    this.paragraphs().forEach(p => {
      arr = arr.concat(p.interwiki());
    });
    if (typeof num === 'number') {
      return arr[num];
    }
    return arr || [];
  },
  images: function(clue) {
    let arr = [];
    this.paragraphs().forEach((p) => {
      arr = arr.concat(p.images());
    });
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr || [];
  },
  references: function(clue) {
    let arr = this.data.references || [];
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
    this.children().forEach(sec => (bads[sec.title()] = true));
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
    for (let i = index + 1; i < sections.length; i += 1) {
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
      for (let i = index + 1; i < sections.length; i += 1) {
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
    for (let i = index; i >= 0; i -= 1) {
      if (sections[i] && sections[i].depth < this.depth) {
        return sections[i];
      }
    }
    return null;
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
    let pList = this.paragraphs();
    pList = pList.map(p => p.text(options));
    return pList.join('\n\n');
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
//aliases
methods.next = methods.nextSibling;
methods.last = methods.lastSibling;
methods.previousSibling = methods.lastSibling;
methods.previous = methods.lastSibling;
methods.citations = methods.references;
Object.keys(methods).forEach(k => {
  Section.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach(k => {
  Section.prototype[k] = methods[aliasList[k]];
});
module.exports = Section;
