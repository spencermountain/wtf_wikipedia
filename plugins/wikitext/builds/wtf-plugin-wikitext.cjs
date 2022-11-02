/* wtf-plugin-wikitext 2.0.0  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtfWikitext = factory());
})(this, (function () { 'use strict';

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
  function toWiki$a (options) {
    options = options || {};
    options = Object.assign({}, defaults$3, options);
    let text = '';

    //if it's a redirect page
    if (this.isRedirect() === true) {
      return `#REDIRECT [[${this.redirectTo().page}]]`
    }

    //render infoboxes (up at the top)
    if (options.infoboxes === true) {
      text += this.infoboxes()
        .map((i) => i.makeWikitext(options))
        .join('\n');
    }

    //render each section
    if (options.sections === true || options.paragraphs === true || options.sentences === true) {
      let sections = this.sections();
      text += sections.map((s) => s.makeWikitext(options)).join('\n');
    }

    // add categories on the bottom
    if (options.categories === true) {
      text += '\n';
      this.categories().forEach((cat) => (text += `\n[[Category: ${cat}]]`));
    }
    return text
  }

  const defaults$2 = {};

  function doTemplate (obj) {
    let data = '';
    let name = obj.template;
    Object.keys(obj).forEach((k) => {
      if (k !== 'template') {
        data += ` | ${k} = ${obj[k]}`;
      }
    });
    return `{{${name}${data}}} `
  }

  function toWiki$9 (options) {
    options = options || {};
    options = Object.assign({}, defaults$2, options);
    let text = '';
    if (this.title()) {
      let side = '==';
      text += `\n${side} ${this.title()} ${side}\n`;
    }
    // render some templates?
    if (options.templates === true) {
      this.templates().forEach((tmpl) => {
        text += doTemplate(tmpl.json()) + '\n';
      });
    }

    //make a table
    if (options.tables === true) {
      text += this.tables()
        .map((t) => t.makeWikitext(options))
        .join('\n');
    }

    // make a html bullet-list
    if (options.lists === true) {
      text += this.lists()
        .map((list) => list.text(options))
        .join('\n');
    }
    text += this.paragraphs()
      .map((p) => {
        return p.makeWikitext(options)
      })
      .join('\n');

    // render references
    // these will be out of place
    this.references().forEach((ref) => {
      text += ref.makeWikitext(options) + '\n';
    });

    return text
  }

  const defaults$1 = {};

  function toWiki$8 (options) {
    options = options || {};
    options = Object.assign({}, defaults$1, options);
    let text = '';

    // do images
    this.images().forEach((img) => {
      text += img.makeWikitext();
    });
    // do lists
    this.lists().forEach((list) => {
      text += list.makeWikitext();
    });
    // render sentences
    text += this.sentences()
      .map((s) => {
        return s.makeWikitext(options)
      })
      .join('\n');
    return text
  }

  //escape a string like 'fun*2.Co' for a regExpr
  function escapeRegExp (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }

  //sometimes text-replacements can be ambiguous - words used multiple times..
  function smartReplace (all, text, result) {
    if (!text || !all) {
      return all
    }

    if (typeof all === 'number') {
      all = String(all);
    }
    text = escapeRegExp(text);
    //try a word-boundary replace
    let reg = new RegExp('\\b' + text + '\\b');
    if (reg.test(all) === true) {
      all = all.replace(reg, result);
    } else {
      //otherwise, fall-back to a much messier, dangerous replacement
      // console.warn('missing \'' + text + '\'');
      all = all.replace(text, result);
    }
    return all
  }

  const defaults = {
    links: true
  };

  function toWiki$7 (options) {
    options = options || {};
    options = Object.assign({}, defaults, options);
    let text = this.text();
    if (options.links === true) {
      this.links().forEach((link) => {
        let str = link.text() || link.page();
        let tag = link.makeWikitext();
        text = smartReplace(text, str, tag);
      });
    }
    if (options.formatting === true) {
      //support bolds
      this.bold().forEach((str) => {
        let tag = '**' + str + '**';
        text = smartReplace(text, str, tag);
      });
      //do italics
      this.italic().forEach((str) => {
        let tag = '***' + str + '***';
        text = smartReplace(text, str, tag);
      });
    }

    return text
  }

  // add `[text](href)` to the text
  function toWiki$6 () {
    //if it's an external link, we good
    if (this.site()) {
      if (this.text()) {
        return `[${this.site()}|${this.text()}]`
      }
      return `[${this.site()}]`
    }
    let page = this.page() || '';
    if (this.anchor()) {
      page += `#${this.anchor()}`;
    }

    let str = this.text() || '';
    if (str && str.toLowerCase() !== page.toLowerCase()) {
      return `[[${page}|${str}]]`
    }
    return `[[${page}]]`
  }

  function toWiki$5 () {
    let text = `[[${this.file()}|thumb`;
    let caption = this.data.caption;
    if (caption) {
      text += `|${this.data.caption.wikitext()}`;
    }
    return text + ']]'
  }

  function toWiki$4 () {
    let text = `{{${this.data.template || ''}`;
    Object.keys(this.data).forEach((k) => {
      if (k === 'template') {
        return
      }
      let val = this.data[k];
      if (val) {
        text += `| ${k} = ${val || ''}`;
      }
    });
    text += '}}\n';
    return text
  }

  function toWiki$3 () {
    let text = `{{Infobox ${this._type || ''}\n`;
    Object.keys(this.data).forEach((k) => {
      let val = this.data[k];
      if (val) {
        text += `| ${k} = ${val.wikitext() || ''}\n`;
      }
    });
    text += '}}\n';
    return text
  }

  function toWiki$2 () {
    let txt = '';
    this.lines().forEach((s) => {
      txt += `* ${s.wikitext()}\n`;
    });
    return txt
  }

  function toWiki$1 () {
    if (this.data.inline) {
      return `<ref>${this.data.inline.wikitext()}</ref>`
    }
    let type = this.data.type || 'cite web';
    let data = '';
    Object.keys(this.data).forEach((k) => {
      if (k !== 'template' && k !== 'type') {
        data += ` | ${k} = ${this.data[k]}`;
      }
    });
    return `<ref>{{${type}${data}}}</ref>`
  }

  function toWiki (options) {
    let rows = this.data;
    let wiki = `{| class="wikitable"\n`;

    // draw headers
    let headers = Object.keys(rows[0]);
    headers = headers.filter((k) => /^col[0-9]/.test(k) !== true);
    if (headers.length > 0) {
      wiki += '|-\n';
      headers.forEach((k) => {
        wiki += '! ' + k + '\n';
      });
    }
    //make rows
    rows.forEach((o) => {
      wiki += '|-\n';
      Object.keys(o).forEach((k) => {
        let val = o[k].wikitext(options);
        wiki += '| ' + val + '\n';
      });
    });
    wiki += `|}`;
    return wiki
  }

  function plugin (models) {
    models.Doc.prototype.makeWikitext = toWiki$a;
    models.Section.prototype.makeWikitext = toWiki$9;
    models.Paragraph.prototype.makeWikitext = toWiki$8;
    models.Sentence.prototype.makeWikitext = toWiki$7;
    models.Link.prototype.makeWikitext = toWiki$6;
    models.Image.prototype.makeWikitext = toWiki$5;
    models.Infobox.prototype.makeWikitext = toWiki$3;
    models.Template.prototype.makeWikitext = toWiki$4;
    models.Table.prototype.makeWikitext = toWiki;
    models.List.prototype.makeWikitext = toWiki$2;
    models.Reference.prototype.makeWikitext = toWiki$1;
  }

  return plugin;

}));
