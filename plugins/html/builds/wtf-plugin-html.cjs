/*! wtf-plugin-html 1.0.0 MIT */
'use strict';

var version = '1.0.0';

const escape$6 = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const defaults$4 = {
  title: true,
  infoboxes: true,
  headers: true,
  sections: true,
  links: true,
};
//we should try to make this look like the wikipedia does, i guess.
const softRedirect = function (doc) {
  const link = doc.redirectTo();
  let href = link.page;
  href = './' + href.replace(/ /g, '_');
  if (link.anchor) {
    href += '#' + link.anchor;
  }
  return `  <div class="redirect">
  ↳ <a class="link" href="${escape$6(href)}">${escape$6(link.text || link.page)}</a>
  </div>`
};

//turn a Doc object into a HTML string
const toHtml$5 = function (options) {
  options = { ...defaults$4, ...options };
  let html = '';
  //add page title
  // only an explicit title, not one guessed from the first bolded text
  const title = this.options().title;
  if (options.title === true && title) {
    html += '<title>' + escape$6(title) + '</title>\n';
  }
  //if it's a redirect page, give it a 'soft landing':
  if (this.isRedirect() === true) {
    html += softRedirect(this);
    return html
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true) {
    html += this.infoboxes()
      .map((i) => i.html(options))
      .join('\n');
  }
  //render each section
  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    html += this.sections()
      .map((s) => s.html(options))
      .join('\n');
  }
  //default off
  if (options.references === true) {
    html += '\n<h2>References</h2>\n';
    html += this.references()
      .map((c) => c.html(options))
      .join('\n');
  }
  return html
};

// CJK scripts do not put spaces between sentences
const cjk = '\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Bopomofo}。、，！？：；「」『』（）';
const cjkEnd = new RegExp(`[${cjk}]$`, 'u');
const cjkStart = new RegExp(`^[${cjk}]`, 'u');

// join rendered sentences, deciding the separator from their plain text
const joinSentences = (sentences, render) =>
  sentences.reduce((str, s, i) => {
    const out = render(s);
    if (i === 0) {
      return out
    }
    if (cjkEnd.test(sentences[i - 1].text()) && cjkStart.test(s.text())) {
      return str + out
    }
    return str + ' ' + out
  }, '');

const escape$5 = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const defaults$3 = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true,
};

const doSection = function (options) {
  options = { ...defaults$3, ...options };
  let html = '';
  //make the header
  if (options.headers === true && this.title()) {
    // '== title ==' is an h2, like wikipedia
    const num = 2 + this.depth();
    html += '  <h' + num + '>' + escape$5(this.title()) + '</h' + num + '>';
    html += '\n';
  }
  //put any images under the header
  if (options.images === true) {
    const imgs = this.images();
    if (imgs.length > 0) {
      html += imgs.map((image) => image.html(options)).join('\n');
    }
  }
  //make a html table
  if (options.tables === true) {
    html += this.tables()
      .map((t) => t.html(options))
      .join('\n');
  }
  const doLists = (lists) => {
    if (options.lists !== true) {
      return ''
    }
    return lists.map((list) => list.html(options)).join('\n')
  };

  //write the sentence text, with each paragraph's lists after its text
  if (options.paragraphs === true && this.paragraphs().length > 0) {
    html += '  <div class="text">\n';
    this.paragraphs().forEach((p) => {
      if (p.sentences().length > 0) {
        html += '    <p class="paragraph">\n';
        html += '      ' + joinSentences(p.sentences(), (s) => s.html(options));
        html += '\n    </p>\n';
      }
      html += doLists(p.lists());
    });
    html += '  </div>\n';
  } else {
    html += doLists(this.lists());
    if (options.sentences === true) {
      html += '      ' + joinSentences(this.sentences(), (s) => s.html(options));
    }
  }
  return '<div class="section">\n' + html + '</div>\n'
};

const defaults$2 = {
  sentences: true,
};

const toHtml$4 = function (options) {
  options = { ...defaults$2, ...options };
  let html = '';
  if (options.sentences === true) {
    html += this.sentences()
      .map((s) => s.html(options))
      .join('\n');
  }
  return html
};

//escape a string like 'fun*2.Co' for a regExpr
function escapeRegExp(str) {
  return str.replace(/[\-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

// rough plaintext of some wikitext, enough to count words
const stripWiki = (str) =>
  str
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[\s\S]*?<\/ref>/g, '')
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/\{\{[^{}]*\}\}/g, '') // once more, for one level of nesting
    .replace(/\[\[(?:[^\][|]*\|)?([^\][]*)\]\]/g, '$1')
    .replace(/\[https?:\/\/\S+ ([^\]]*)\]/g, '$1')
    .replace(/'{2,}/g, '');

// count how many times `text` appears in `str`
const countIn = (str, text) => {
  let n = 0;
  let at = str.indexOf(text);
  while (at !== -1) {
    n += 1;
    at = str.indexOf(text, at + text.length);
  }
  return n
};

// which occurrence of its text does this link stand on?
// found by locating the link in the sentence's wikitext and counting the same words before it
const linkOccurrence = function (sentence, link, cursor = { at: 0 }) {
  const wiki = sentence.wikitext() || '';
  const linkWiki = link.wikitext() || '';
  const text = link.text() || link.page() || '';
  if (!wiki || !linkWiki || !text) {
    return 0
  }
  const idx = wiki.indexOf(linkWiki, cursor.at);
  if (idx === -1) {
    return 0
  }
  cursor.at = idx + linkWiki.length;
  return countIn(stripWiki(wiki.slice(0, idx)), text)
};

//sometimes text-replacements can be ambiguous - words used multiple times..
// `nth` picks which occurrence (0-based) to replace; falls back to the first
const smartReplace = function (all, text, result, nth = 0) {
  if (!text || !all) {
    return all
  }
  if (typeof all === 'number') {
    all = String(all);
  }
  const fn = typeof result === 'function' ? result : () => result;
  //try a word-boundary replace
  const reg = new RegExp('\\b' + escapeRegExp(text) + '\\b', 'g');
  const matches = [...all.matchAll(reg)];
  if (matches.length > 0) {
    const m = matches[nth] || matches[0];
    return all.slice(0, m.index) + fn(m[0]) + all.slice(m.index + m[0].length)
  }
  //otherwise, fall-back to a much messier, dangerous replacement
  let at = all.indexOf(text);
  for (let i = 0; i < nth && at !== -1; i += 1) {
    const next = all.indexOf(text, at + text.length);
    if (next === -1) {
      break
    }
    at = next;
  }
  if (at === -1) {
    return all
  }
  return all.slice(0, at) + fn(text) + all.slice(at + text.length)
};

const defaults$1 = {
  links: true,
  formatting: true,
};
const escape$4 = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BOLD_OPEN = '\uE000';
const BOLD_CLOSE = '\uE001';
const ITALIC_OPEN = '\uE002';
const ITALIC_CLOSE = '\uE003';
// one private-use char per link, so later replacements never touch generated markup
const linkToken = (n) => String.fromCharCode(0xe010 + n);

// create links, bold, italic in html
const doSentence = function (options) {
  options = { ...defaults$1, ...options };
  let text = escape$4(this.text());
  // mark bold/italic spans first, so a bolded link wraps the whole <a>
  if (options.formatting === true) {
    this.bolds().forEach(({ text: str }) => {
      str = escape$4(str);
      text = smartReplace(text, str, () => BOLD_OPEN + str + BOLD_CLOSE);
    });
    this.italics().forEach(({ text: str }) => {
      str = escape$4(str);
      text = smartReplace(text, str, () => ITALIC_OPEN + str + ITALIC_CLOSE);
    });
  }
  const tags = [];
  if (options.links === true) {
    const cursor = { at: 0 };
    this.links().forEach((link) => {
      const str = escape$4(link.text() || link.page());
      const nth = linkOccurrence(this, link, cursor);
      const token = linkToken(tags.length);
      tags.push(link.html());
      text = smartReplace(text, str, () => token, nth);
    });
  }
  text = text
    .replace(/[\uE010-\uE0FF]/g, (c) => tags[c.charCodeAt(0) - 0xe010] ?? '')
    .replace(/\uE000/g, '<b>')
    .replace(/\uE001/g, '</b>')
    .replace(/\uE002/g, '<i>')
    .replace(/\uE003/g, '</i>');
  return '<span class="sentence">' + text + '</span>'
};

const toHtml$3 = function () {
  const classNames = 'link';
  let href = this.href() || '';
  href = href.replace(/ /g, '_');
  //use the url as the text, for bare external links like [https://foo.com]
  let str = this.text() || this.page() || href;
  str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  href = href.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return `<a class="${classNames}" href="${href}">${str}</a>`
};

const escape$3 = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const defaults = {
  images: true,
};
const dontDo = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  signature_alt: true,
};

//
const infobox = function (Block, options) {
  options = { ...defaults, ...options };
  const data = this.json().data;
  let html = '<table class="infobox">\n';
  html += '  <thead>\n';
  html += '  </thead>\n';
  html += '  <tbody>\n';
  //put image and caption on the top
  if (options.images === true && data.image) {
    html += '    <tr>\n';
    html += '       <td colspan="2" style="text-align:center">\n';
    html += '       ' + this.image().html() + '\n';
    html += '       </td>\n';
    if (data.caption || data.alt) {
      const caption = data.caption ? new Block(data.caption).html(options) : new Block(data.alt).html(options);
      html += '       <td colspan="2" style="text-align:center">\n';
      html += '         ' + caption + '\n';
      html += '       </td>\n';
    }
    html += '    </tr>\n';
  }
  Object.keys(data).forEach((k) => {
    if (dontDo[k] === true) {
      return
    }
    const blocks = [].concat(data[k]);
    let key = k.replace(/_/g, ' ');
    key = key.charAt(0).toUpperCase() + key.substring(1); //titlecase it
    const val = blocks.map((block) => new Block(block).html(options)).join(' ');
    html += '    <tr>\n';
    html += '      <td>' + escape$3(key) + '</td>\n';
    html += '      <td>' + val + '</td>\n';
    html += '    </tr>\n';
  });
  html += '  </tbody>\n';
  html += '</table>\n';
  return html
};

const escape$2 = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const makeImage = function () {
  return '  <img src="' + escape$2(this.thumbnail()) + '" alt="' + escape$2(this.alt()) + '"/>'
};

//
const toHtml$2 = function (Block, options) {
  let html = '  <ul class="list">\n';
  this.lines().forEach((s) => {
    html += '    <li>' + new Block(s.json('xl')).html(options) + '</li>\n';
  });
  html += '  </ul>\n';
  return html
};

const escape$1 = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const toHtml$1 = function (options = {}) {
  const data = this.json().data || {};
  if (data && data.url && data.title) {
    let str = escape$1(data.title);
    const url = escape$1(data.url);
    if (options.links === true) {
      str = `<a href="${url}">${str}</a>`;
    }
    return `<div class="reference">⌃ ${str} </div>`
  }
  if (data.encyclopedia) {
    const str = escape$1(data.encyclopedia);
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (data.title) {
    //cite book, etc
    let str = escape$1(data.title);
    if (data.author) {
      str += ' ' + escape$1(data.author);
    }
    if (data.first && data.last) {
      str += ' ' + escape$1(data.first) + ' ' + escape$1(data.last);
    }
    return `<div class="reference">⌃ ${str}</div>`
  }
  if (data.inline) {
    return `<div class="reference">⌃ ${escape$1(data.inline.text)}</div>`
  }
  return ''
};

const escape = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

//turn a json table into a html table
const toHtml = function (Block, options) {
  const rows = this.json().rows;
  if (rows.length === 0) {
    return ''
  }
  let html = '<table class="table">\n';
  //make header
  html += '  <thead>\n';
  html += '  <tr>\n';

  this.headers().forEach((header) => {
    html += '    <td>' + escape(header.text()) + '</td>\n';
  });
  html += '  </tr>\n';
  html += '  </thead>\n';
  html += '  <tbody>\n';

  //make rows
  rows.forEach((o) => {
    html += '  <tr>\n';
    Object.keys(o).forEach((k) => {
      const val = new Block(o[k]).html(options);
      html += '    <td>' + val + '</td>\n';
    });
    html += '  </tr>\n';
  });
  html += '  </tbody>\n';
  html += '</table>\n';
  return html
};

const plugin = function (models) {
  models.Doc.prototype.html = toHtml$5;

  models.Section.prototype.html = doSection;

  models.Paragraph.prototype.html = toHtml$4;

  models.Block.prototype.html = doSentence;

  models.Image.prototype.html = makeImage;

  models.Infobox.prototype.html = function (options) {
    return infobox.call(this, models.Block, options)
  };

  models.Link.prototype.html = toHtml$3;

  models.List.prototype.html = function (options) {
    return toHtml$2.call(this, models.Block, options)
  };

  models.Reference.prototype.html = toHtml$1;

  models.Table.prototype.html = function (options) {
    return toHtml.call(this, models.Block, options)
  };

  // models.Template.html = function(opts) {}
};
plugin.version = version;

module.exports = plugin;
