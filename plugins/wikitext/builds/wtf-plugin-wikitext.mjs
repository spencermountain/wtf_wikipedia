/* wtf-plugin-wikitext 1.1.0  MIT */
const defaults$3 = {
  images: true,
  tables: true,
  templates: true,
  infoboxes: true,
  categories: true,
  lists: true,
  links: true,
  paragraphs: true
};

const toWiki$a = function (options) {
  options = options || {};
  options = Object.assign({}, defaults$3, options);
  let text = ''; //if it's a redirect page

  if (this.isRedirect() === true) {
    return `#REDIRECT [[${this.redirectTo().page}]]`;
  } //render infoboxes (up at the top)


  if (options.infoboxes === true) {
    text += this.infoboxes().map(i => i.makeWikitext(options)).join('\n');
  } //render each section


  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    let sections = this.sections();
    text += sections.map(s => s.makeWikitext(options)).join('\n');
  } // add categories on the bottom


  if (options.categories === true) {
    text += '\n';
    this.categories().forEach(cat => text += `\n[[Category: ${cat}]]`);
  }

  return text;
};

var _01Doc = toWiki$a;

const defaults$2 = {};

const doTemplate = function (obj) {
  let data = '';
  let name = obj.template;
  Object.keys(obj).forEach(k => {
    if (k !== 'template') {
      data += ` | ${k} = ${obj[k]}`;
    }
  });
  return `{{${name}${data}}} `;
};

const toWiki$9 = function (options) {
  options = options || {};
  options = Object.assign({}, defaults$2, options);
  let text = '';

  if (this.title()) {
    let side = '==';
    text += `\n${side} ${this.title()} ${side}\n`;
  } // render some templates?


  if (options.templates === true) {
    this.templates().forEach(tmpl => {
      text += doTemplate(tmpl.json()) + '\n';
    });
  } //make a table


  if (options.tables === true) {
    text += this.tables().map(t => t.makeWikitext(options)).join('\n');
  } // make a html bullet-list


  if (options.lists === true) {
    text += this.lists().map(list => list.text(options)).join('\n');
  }

  text += this.paragraphs().map(p => {
    return p.makeWikitext(options);
  }).join('\n'); // render references
  // these will be out of place

  this.references().forEach(ref => {
    text += ref.makeWikitext(options) + '\n';
  });
  return text;
};

var _02Section = toWiki$9;

const defaults$1 = {};

const toWiki$8 = function (options) {
  options = options || {};
  options = Object.assign({}, defaults$1, options);
  let text = ''; // do images

  this.images().forEach(img => {
    text += img.makeWikitext();
  }); // do lists

  this.lists().forEach(list => {
    text += list.makeWikitext();
  }); // render sentences

  text += this.sentences().map(s => {
    return s.makeWikitext(options);
  }).join('\n');
  return text;
};

var _03Paragraph = toWiki$8;

//escape a string like 'fun*2.Co' for a regExpr
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
} //sometimes text-replacements can be ambiguous - words used multiple times..


const smartReplace = function (all, text, result) {
  if (!text || !all) {
    return all;
  }

  if (typeof all === 'number') {
    all = String(all);
  }

  text = escapeRegExp(text); //try a word-boundary replace

  let reg = new RegExp('\\b' + text + '\\b');

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

const defaults = {
  links: true
};

const toWiki$7 = function (options) {
  options = options || {};
  options = Object.assign({}, defaults, options);
  let text = this.text();

  if (options.links === true) {
    this.links().forEach(link => {
      let str = link.text() || link.page();
      let tag = link.makeWikitext();
      text = smartReplace_1(text, str, tag);
    });
  }

  if (options.formatting === true) {
    //support bolds
    this.bold().forEach(str => {
      let tag = '**' + str + '**';
      text = smartReplace_1(text, str, tag);
    }); //do italics

    this.italic().forEach(str => {
      let tag = '***' + str + '***';
      text = smartReplace_1(text, str, tag);
    });
  }

  return text;
};

var _04Sentence = toWiki$7;

// add `[text](href)` to the text
const toWiki$6 = function () {
  //if it's an external link, we good
  if (this.site()) {
    if (this.text()) {
      return `[${this.site()}|${this.text()}]`;
    }

    return `[${this.site()}]`;
  }

  let page = this.page() || '';

  if (this.anchor()) {
    page += `#${this.anchor()}`;
  }

  let str = this.text() || '';

  if (str && str.toLowerCase() !== page.toLowerCase()) {
    return `[[${page}|${str}]]`;
  }

  return `[[${page}]]`;
};

var _05Link = toWiki$6;

const toWiki$5 = function () {
  let text = `[[${this.file()}|thumb`;
  let caption = this.data.caption;

  if (caption) {
    text += `|${this.data.caption.wikitext()}`;
  }

  return text + ']]';
};

var image = toWiki$5;

const toWiki$4 = function () {
  let text = `{{${this.data.template || ''}`;
  Object.keys(this.data).forEach(k => {
    if (k === 'template') {
      return;
    }

    let val = this.data[k];

    if (val) {
      text += `| ${k} = ${val || ''}`;
    }
  });
  text += '}}\n';
  return text;
};

var template = toWiki$4;

const toWiki$3 = function () {
  let text = `{{Infobox ${this._type || ''}\n`;
  Object.keys(this.data).forEach(k => {
    let val = this.data[k];

    if (val) {
      text += `| ${k} = ${val.wikitext() || ''}\n`;
    }
  });
  text += '}}\n';
  return text;
};

var infobox = toWiki$3;

const toWiki$2 = function () {
  let txt = '';
  this.lines().forEach(s => {
    txt += `* ${s.wikitext()}\n`;
  });
  return txt;
};

var list = toWiki$2;

const toWiki$1 = function () {
  if (this.data.inline) {
    return `<ref>${this.data.inline.wikitext()}</ref>`;
  }

  let type = this.data.type || 'cite web';
  let data = '';
  Object.keys(this.data).forEach(k => {
    if (k !== 'template' && k !== 'type') {
      data += ` | ${k} = ${this.data[k]}`;
    }
  });
  return `<ref>{{${type}${data}}}</ref>`;
};

var reference = toWiki$1;

const toWiki = function (options) {
  let rows = this.data;
  let wiki = `{| class="wikitable"\n`; // draw headers

  let headers = Object.keys(rows[0]);
  headers = headers.filter(k => /^col[0-9]/.test(k) !== true);

  if (headers.length > 0) {
    wiki += '|-\n';
    headers.forEach(k => {
      wiki += '! ' + k + '\n';
    });
  } //make rows


  rows.forEach(o => {
    wiki += '|-\n';
    Object.keys(o).forEach(k => {
      let val = o[k].wikitext(options);
      wiki += '| ' + val + '\n';
    });
  });
  wiki += `|}`;
  return wiki;
};

var table = toWiki;

const plugin = function (models) {
  models.Doc.prototype.makeWikitext = _01Doc;
  models.Section.prototype.makeWikitext = _02Section;
  models.Paragraph.prototype.makeWikitext = _03Paragraph;
  models.Sentence.prototype.makeWikitext = _04Sentence;
  models.Link.prototype.makeWikitext = _05Link;
  models.Image.prototype.makeWikitext = image;
  models.Infobox.prototype.makeWikitext = infobox;
  models.Template.prototype.makeWikitext = template;
  models.Table.prototype.makeWikitext = table;
  models.List.prototype.makeWikitext = list;
  models.Reference.prototype.makeWikitext = reference;
};

var src = plugin;

export default src;
