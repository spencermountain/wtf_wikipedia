/* wtf-plugin-wikitext 0.2.0  MIT */
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
    var sections = this.sections(); // sections = sections.filter((s) => s.title() !== 'References')

    text += sections.map(function (s) {
      return s.wikitext(options);
    }).join('\n');
  } // add categories on the bottom


  if (options.categories === true) {
    text += '\n';
    this.categories().forEach(function (cat) {
      return text += "\n[[Category: ".concat(cat, "]]");
    });
  }

  return text;
};

var _01Doc = toWiki;

var defaults$1 = {};

var doTemplate = function doTemplate(obj) {
  var data = '';
  var name = obj.template;
  Object.keys(obj).forEach(function (k) {
    if (k !== 'template') {
      data += " | ".concat(k, " = ").concat(obj[k]);
    }
  });
  return "{{".concat(name).concat(data, "}} ");
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
    text += doTemplate(tmpl) + '\n';
  }); //make a table

  if (options.tables === true) {
    text += this.tables().map(function (t) {
      return t.wikitext(options);
    }).join('\n');
  } // make a html bullet-list


  if (options.lists === true) {
    text += this.lists().map(function (list) {
      return list.text(options);
    }).join('\n');
  }

  text += this.paragraphs().map(function (p) {
    return p.wikitext(options);
  }).join('\n'); // render references
  // these will be out of place

  this.references().forEach(function (ref) {
    text += ref.wikitext(options) + '\n';
  });
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
  var text = "[[".concat(this.file(), "|thumb");
  var caption = this.data.caption;

  if (caption) {
    text += "|".concat(this.data.caption.wikitext());
  }

  return text + ']]';
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
  var _this = this;

  if (this.data.inline) {
    return "<ref>".concat(this.data.inline.wikitext(), "</ref>");
  }

  var type = this.data.type || 'cite web';
  var data = '';
  Object.keys(this.data).forEach(function (k) {
    if (k !== 'template' && k !== 'type') {
      data += " | ".concat(k, " = ").concat(_this.data[k]);
    }
  });
  return "<ref>{{".concat(type).concat(data, "}}</ref>");
};

var reference = toWiki$8;

var toWiki$9 = function toWiki(options) {
  var rows = this.data;
  var wiki = "{| class=\"wikitable\"\n"; // draw headers

  var headers = Object.keys(rows[0]);
  headers = headers.filter(function (k) {
    return /^col[0-9]/.test(k) !== true;
  });

  if (headers.length > 0) {
    wiki += '|-\n';
    headers.forEach(function (k) {
      wiki += '! ' + k + '\n';
    });
  } //make rows


  rows.forEach(function (o) {
    wiki += '|-\n';
    Object.keys(o).forEach(function (k) {
      var val = o[k].wikitext(options);
      wiki += '| ' + val + '\n';
    });
  });
  wiki += "|}";
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

export default src;
