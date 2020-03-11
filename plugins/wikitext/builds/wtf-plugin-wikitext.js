/* wtf-plugin-wikitext 0.1.0  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.wtf = factory());
}(this, (function () { 'use strict';

  var defaults = {
    images: true,
    tables: true,
    infoboxes: true,
    categories: true,
    lists: true,
    links: true,
    paragraphs: true
  };

  var toWiki = function toWiki(options) {
    options = options || {};
    options = Object.assign({}, defaults, options);
    var text = ''; //if it's a redirect page

    if (this.isRedirect() === true) {
      return "#REDIRECT [[".concat(this.redirectTo().page, "]]");
    } //render infoboxes (up at the top)


    if (options.infoboxes === true) {
      text += this.infoboxes().map(function (i) {
        return i.wikitext(options);
      }).join('\n');
    } //render each section


    if (options.sections === true || options.paragraphs === true || options.sentences === true) {
      var sections = this.sections();
      sections = sections.filter(function (s) {
        return s.title() !== 'References';
      });
      text += sections.map(function (s) {
        return s.wikitext(options);
      }).join('\n');
    } //default off


    if (options.references === true) {
      text += '== References ==';
      text += this.references().map(function (c) {
        return c.wiki(options);
      }).join('\n');
    } // add categories on the bottom


    if (options.categories === true) {
      text += '\n';
      this.categories().forEach(function (cat) {
        return text += "\n[[".concat(cat, "]]");
      });
    }

    return text;
  };

  var _01Doc = toWiki;

  var defaults$1 = {};

  var generic = function generic(tmpl) {
    var list = tmpl.list || [];
    list = list.join('|');
    return "{{".concat(tmpl.template, "|").concat(list, "}}\n");
  };

  var doTemplates = {
    main: generic
  };

  var toWiki$1 = function toWiki(options) {
    options = options || {};
    options = Object.assign({}, defaults$1, options);
    var text = '';

    if (this.title()) {
      var side = '==';
      text += "\n".concat(side, " ").concat(this.title(), " ").concat(side, "\n");
    } // render some templates?


    this.templates().forEach(function (tmpl) {
      if (doTemplates.hasOwnProperty(tmpl.template)) {
        text += doTemplates[tmpl.template](tmpl);
      }
    });
    text += this.paragraphs().map(function (p) {
      return p.wikitext(options);
    }).join('\n');
    return text;
  };

  var _02Section = toWiki$1;

  var defaults$2 = {};

  var toWiki$2 = function toWiki(options) {
    options = options || {};
    options = Object.assign({}, defaults$2, options);
    var text = ''; // do images

    this.images().forEach(function (img) {
      text += img.wikitext();
    }); // do lists

    this.lists().forEach(function (list) {
      text += list.wikitext();
    }); // render sentences

    text += this.sentences().map(function (s) {
      return s.wikitext(options);
    }).join('\n');
    return text;
  };

  var _03Paragraph = toWiki$2;

  //escape a string like 'fun*2.Co' for a regExpr
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  } //sometimes text-replacements can be ambiguous - words used multiple times..


  var smartReplace = function smartReplace(all, text, result) {
    if (!text || !all) {
      return all;
    }

    if (typeof all === 'number') {
      all = String(all);
    }

    text = escapeRegExp(text); //try a word-boundary replace

    var reg = new RegExp('\\b' + text + '\\b');

    if (reg.test(all) === true) {
      all = all.replace(reg, result);
    } else {
      //otherwise, fall-back to a much messier, dangerous replacement
      // console.warn('missing \'' + text + '\'');
      all = all.replace(text, result);
    }

    return all;
  };

  var smartReplace_1 = smartReplace;

  var defaults$3 = {
    links: true
  };

  var toWiki$3 = function toWiki(options) {
    options = options || {};
    options = Object.assign({}, defaults$3, options);
    var text = this.text();

    if (options.links === true) {
      this.links().forEach(function (link) {
        var str = link.text() || link.page();
        var tag = link.wikitext();
        text = smartReplace_1(text, str, tag);
      });
    }

    if (options.formatting === true) {
      //support bolds
      this.bold().forEach(function (str) {
        var tag = '**' + str + '**';
        text = smartReplace_1(text, str, tag);
      }); //do italics

      this.italic().forEach(function (str) {
        var tag = '***' + str + '***';
        text = smartReplace_1(text, str, tag);
      });
    }

    return text;
  };

  var _04Sentence = toWiki$3;

  // add `[text](href)` to the text
  var toWiki$4 = function toWiki() {
    //if it's an external link, we good
    if (this.site()) {
      if (this.text()) {
        return "[".concat(this.site(), "|").concat(this.text(), "]");
      }

      return "[".concat(this.site(), "]");
    }

    var page = this.page() || '';

    if (this.anchor()) {
      page += "#".concat(this.anchor());
    }

    var str = this.text() || '';

    if (str && str.toLowerCase() !== page.toLowerCase()) {
      return "[[".concat(page, "|").concat(str, "]]");
    }

    return "[[".concat(page, "]]");
  };

  var _05Link = toWiki$4;

  var toWiki$5 = function toWiki() {
    var text = "[[".concat(this.file(), "|thumb]]");
    return text;
  };

  var image = toWiki$5;

  var toWiki$6 = function toWiki() {
    var _this = this;

    var text = "{{Infobox ".concat(this._type || '', "\n");
    Object.keys(this.data).forEach(function (k) {
      var val = _this.data[k];

      if (val) {
        text += "| ".concat(k, " = ").concat(val.wikitext() || '', "\n");
      }
    });
    text += '}}\n';
    return text;
  };

  var infobox = toWiki$6;

  var toWiki$7 = function toWiki() {
    var txt = '';
    this.lines().forEach(function (s) {
      txt += "* ".concat(s.wikitext(), "\n");
    });
    return txt;
  };

  var list = toWiki$7;

  var toWiki$8 = function toWiki() {
    console.log(this);
    return "<ref> </ref>";
  };

  var reference = toWiki$8;

  var toWiki$9 = function toWiki() {
    console.log(this);
    var wiki = "{|\n";
    wiki += "\n|}";
    return wiki;
  };

  var table = toWiki$9;

  var plugin = function plugin(models) {
    models.Doc.prototype.wikitext = _01Doc;
    models.Section.prototype.wikitext = _02Section;
    models.Paragraph.prototype.wikitext = _03Paragraph;
    models.Sentence.prototype.wikitext = _04Sentence;
    models.Link.prototype.wikitext = _05Link;
    models.Image.prototype.wikitext = image;
    models.Infobox.prototype.wikitext = infobox;
    models.Table.prototype.wikitext = table;
    models.List.prototype.wikitext = list;
    models.Reference.prototype.wikitext = reference;
  };

  var src = plugin;

  return src;

})));
//# sourceMappingURL=wtf-plugin-wikitext.js.map
