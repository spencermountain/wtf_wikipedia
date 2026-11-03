/*! wtf-plugin-markdown 1.0.1 MIT */
'use strict';

var version = '1.0.1';

const defaults$4 = {
  redirects: true,
  infoboxes: true,
  templates: true,
  sections: true,
};
//we should try to make this look like the wikipedia does, i guess.
const softRedirect = function (doc) {
  const link = doc.redirectTo();
  let href = link.page;
  href = './' + href.replace(/ /g, '_');
  if (link.anchor) {
    href += '#' + link.anchor;
  }
  return `↳ [${link.text}](${href})`
};

//turn a Doc object into a markdown string
const toMarkdown$6 = function (options) {
  options = { ...defaults$4, ...options };
  const data = this;
  let md = '';
  //if it's a redirect page, give it a 'soft landing':
  if (options.redirects === true && this.isRedirect() === true) {
    return softRedirect(this) //end it here
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && options.templates === true) {
    const boxes = this.infoboxes().map((infobox) => infobox.markdown(options));
    if (boxes.length > 0) {
      // a blank line, so the text after is not read as another table row
      md += boxes.join('\n\n') + '\n';
    }
  }
  //render each section
  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    md += data
      .sections()
      .map((s) => s.markdown(options))
      .join('\n\n');
  }
  //default false
  if (options.references === true) {
    md += '\n\n## References\n';
    md += this.citations()
      .map((c) => c.markdown(options))
      .join('\n');
  }
  return md
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

const defaults$3 = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true,
};

const doSection = function (options) {
  options = { ...defaults$3, ...options };
  let md = '';

  //make the header
  if (options.headers === true && this.title()) {
    let header = '##';
    for (let i = 0; i < this.depth(); i += 1) {
      header += '#';
    }
    md += header + ' ' + this.title() + '\n';
  }

  //put any images under the header
  if (options.images === true) {
    const images = this.images();
    if (images.length > 0) {
      md += images.map((img) => img.markdown()).join('\n');
      md += '\n';
    }
  }

  //make a markdown table
  if (options.tables === true) {
    const tables = this.tables();
    if (tables.length > 0) {
      md += '\n';
      md += tables.map((table) => table.markdown(options)).join('\n');
      md += '\n';
    }
  }

  const doLists = (lists) => {
    if (options.lists !== true || lists.length === 0) {
      return ''
    }
    return lists.map((list) => list.markdown(options)).join('\n')
  };

  //write the sentence text, with each paragraph's lists after its text
  if (options.paragraphs === true || options.sentences === true) {
    md += this.paragraphs()
      .map((p) => {
        const parts = [joinSentences(p.sentences(), (s) => s.markdown(options)), doLists(p.lists())];
        return parts.filter((str) => str).join('\n')
      })
      .filter((str) => str)
      .join('\n\n');
  } else {
    md += doLists(this.lists());
  }

  return md
};

const defaults$2 = {
  sentences: true
};

const toMarkdown$5 = function (options) {
  options = { ...defaults$2, ...options };
  let md = '';
  if (options.sentences === true) {
    md += this.sentences().reduce((str, s) => {
      str += s.markdown(options) + '\n';
      return str
    }, {});
  }
  return md
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

// escape the characters markdown would otherwise read as markup
const escape = (str) => String(str).replace(/[\\*_`[\]]/g, '\\$&');

const BOLD_OPEN = '';
const BOLD_CLOSE = '';
const ITALIC_OPEN = '';
const ITALIC_CLOSE = '';
// one private-use char per link, so later replacements never touch generated markup
const linkToken = (n) => String.fromCharCode(0xe010 + n);

//create links, bold, italic in markdown
const toMarkdown$4 = function (options) {
  options = { ...defaults$1, ...options };
  let md = escape(this.text());
  const links = [];
  //turn links back into links
  if (options.links === true) {
    const cursor = { at: 0 };
    this.links().forEach((link) => {
      const str = escape(link.text() || link.page());
      const nth = linkOccurrence(this, link, cursor);
      const href = (link.href() || '').replace(/ /g, '_');
      const token = linkToken(links.length);
      links.push({ text: str, href });
      md = smartReplace(md, str, () => token, nth);
    });
  }
  // wrap a span - in the text, or inside a link's label
  const wrap = (str, open, close) => {
    const reg = new RegExp('\\b' + str.replace(/[\-[\]/{}()*+?.\\^$|]/g, '\\$&') + '\\b');
    if (reg.test(md) || md.includes(str)) {
      md = smartReplace(md, str, () => open + str + close);
      return
    }
    const link = links.find((l) => l.text === str);
    if (link) {
      link.text = open + link.text + close;
    }
  };
  if (options.formatting === true) {
    this.bolds().forEach(({ text: b }) => wrap(escape(b), BOLD_OPEN, BOLD_CLOSE));
    this.italics().forEach(({ text: i }) => wrap(escape(i), ITALIC_OPEN, ITALIC_CLOSE));
  }
  md = [...md]
    .map((c) => {
      const n = c.charCodeAt(0) - 0xe010;
      if (n < 0 || n >= links.length) {
        return c
      }
      return '[' + links[n].text + '](' + links[n].href + ')'
    })
    .join('')
    .replace(//g, '**')
    .replace(//g, '**')
    .replace(//g, '*')
    .replace(//g, '*');
  return md
};

// add `[text](href)` to the text
const toMarkdown$3 = function () {
  let href = this.href() || '';
  href = href.replace(/ /g, '_');
  // href = encodeURIComponent(href)
  //use the url as the text, for bare external links like [https://foo.com]
  const str = this.text() || this.page() || href;
  return '[' + str + '](' + href + ')'
};

//markdown images are like this: ![alt text](href)
const toMarkdown$2 = function () {
  let alt = this.file().replace(/^(file|image):/i, '');
  alt = alt
    .replace(/\.(jpg|jpeg|png|gif|svg)/i, '')
    .split('_')
    .join(' ');
  return '![' + alt + '](' + this.thumbnail() + ')'
};

//center-pad each cell, to make the table more legible
const pad = (str, cellWidth) => {
  str ||= '';
  str = String(str);
  cellWidth ||= 15;
  let diff = cellWidth - str.length;
  diff = Math.ceil(diff / 2);
  for (let i = 0; i < diff; i += 1) {
    str = ' ' + str;
    if (str.length < cellWidth) {
      str = str + ' ';
    }
  }
  return str
};

const dontDo = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  signature_alt: true
};

const defaults = {
  images: true
};

// render an infobox as a table with two columns, key + value
const doInfobox = function (Sentence, options) {
  options = { ...defaults, ...options };
  const data = this.json().data;
  let md = '|' + pad('', 35) + '|' + pad('', 30) + '|\n';
  md += '|' + pad('---', 35) + '|' + pad('---', 30) + '|\n';
  //todo: render top image here (somehow)
  Object.keys(data).forEach((k) => {
    if (dontDo[k] === true) {
      return
    }
    const key = '**' + k + '**';
    const blocks = [].concat(data[k]);
    let val = blocks.map((block) => new Sentence(block).markdown(options)).join(' ');
    //markdown is more newline-sensitive than wiki
    val = val.replaceAll('\n', ', ');
    md += '|' + pad(key, 35) + '|' + pad(val, 30) + ' |\n';
  });
  return md
};

//
const toMarkdown$1 = function (Sentence, options) {
  return this.lines()
    .map((s) => {
      const str = new Sentence(s.json('xl')).markdown(options);
      return ' * ' + str
    })
    .join('\n')
};

//
const toMarkdown = function () {
  const data = this.json().data;
  if (data && data.url && data.title) {
    return `⌃ [${data.title}](${data.url})`
  } else if (data.encyclopedia) {
    return `⌃ ${data.encyclopedia}`
  } else if (data.title) {
    //cite book, etc
    let str = data.title;
    if (data.author) {
      str += ' ' + data.author;
    }
    if (data.first && data.last) {
      str += ' ' + data.first + ' ' + data.last;
    }
    return `⌃ ${str}`
  } else if (data.inline) {
    return `⌃ ${data.inline.text}`
  }
  return ''
};

/* this is a markdown table:
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
*/

const makeRow = (arr) => {
  arr = arr.map((s) => pad(s, 14));
  return '| ' + arr.join(' | ') + ' |'
};

//markdown tables are weird
const doTable = function (Sentence, options) {
  let md = '';
  if (!this || this.length === 0) {
    return md
  }
  const rows = this.json().rows;
  if (rows.length === 0) {
    return ''
  }
  const keys = Object.keys(rows[0]);
  const blocks = this.headers();
  const headers = keys.map((_key, i) => {
    return blocks[i] ? new Sentence(blocks[i].json('xl')).markdown(options) : ''
  });
  //draw the header (necessary!)
  md += makeRow(headers) + '\n';
  md += makeRow(headers.map(() => '---')) + '\n';
  //do each row..
  md += rows
    .map((row) => {
      //each column..
      const arr = keys.map((k) => {
        if (!row[k]) {
          return ''
        }
        return new Sentence(row[k]).markdown(options) || ''
      });
      //make it a nice padded row
      return makeRow(arr)
    })
    .join('\n');
  return md + '\n'
};

const plugin = function (models) {
  models.Doc.prototype.markdown = toMarkdown$6;
  models.Section.prototype.markdown = doSection;
  models.Paragraph.prototype.markdown = toMarkdown$5;
  models.Block.prototype.markdown = toMarkdown$4;
  models.Link.prototype.markdown = toMarkdown$3;
  models.Image.prototype.markdown = toMarkdown$2;
  models.Infobox.prototype.markdown = function (options) {
    return doInfobox.call(this, models.Block, options)
  };
  models.Table.prototype.markdown = function (options) {
    return doTable.call(this, models.Block, options)
  };
  models.List.prototype.markdown = function (options) {
    return toMarkdown$1.call(this, models.Block, options)
  };
  models.Reference.prototype.markdown = toMarkdown;
};
plugin.version = version;

module.exports = plugin;
