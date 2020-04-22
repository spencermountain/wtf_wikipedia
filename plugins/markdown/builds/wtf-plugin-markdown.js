/* wtf-plugin-markdown 0.2.0  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.wtfPerson = factory());
}(this, (function () { 'use strict';

  var defaults = {
    redirects: true,
    infoboxes: true,
    templates: true,
    sections: true
  }; // we should try to make this look like the wikipedia does, i guess.

  var softRedirect = function softRedirect(doc) {
    var link = doc.redirectTo();
    var href = link.page;
    href = './' + href.replace(/ /g, '_');

    if (link.anchor) {
      href += '#' + link.anchor;
    }

    return "\u21B3 [".concat(link.text, "](").concat(href, ")");
  }; //turn a Doc object into a markdown string


  var toMarkdown = function toMarkdown(options) {
    options = Object.assign({}, defaults, options);
    var data = this.data;
    var md = ''; //if it's a redirect page, give it a 'soft landing':

    if (options.redirects === true && this.isRedirect() === true) {
      return softRedirect(this); //end it here
    } //render infoboxes (up at the top)


    if (options.infoboxes === true && options.templates === true) {
      md += this.infoboxes().map(function (infobox) {
        return infobox.markdown(options);
      }).join('\n\n');
    } //render each section


    if (options.sections === true || options.paragraphs === true || options.sentences === true) {
      md += data.sections.map(function (s) {
        return s.markdown(options);
      }).join('\n\n');
    } //default false


    if (options.references === true) {
      md += '## References';
      md += this.citations().map(function (c) {
        return c.json(options);
      }).join('\n');
    }

    return md;
  };

  var _01Doc = toMarkdown;

  var defaults$1 = {
    headers: true,
    images: true,
    tables: true,
    lists: true,
    paragraphs: true
  };

  var doSection = function doSection(options) {
    options = Object.assign({}, defaults$1, options);
    var md = ''; //make the header

    if (options.headers === true && this.title()) {
      var header = '##';

      for (var i = 0; i < this.depth; i += 1) {
        header += '#';
      }

      md += header + ' ' + this.title() + '\n';
    } //put any images under the header


    if (options.images === true) {
      var images = this.images();

      if (images.length > 0) {
        md += images.map(function (img) {
          return img.markdown();
        }).join('\n');
        md += '\n';
      }
    } //make a mardown table


    if (options.tables === true) {
      var tables = this.tables();

      if (tables.length > 0) {
        md += '\n';
        md += tables.map(function (table) {
          return table.markdown(options);
        }).join('\n');
        md += '\n';
      }
    } //make a mardown bullet-list


    if (options.lists === true) {
      var lists = this.lists();

      if (lists.length > 0) {
        md += lists.map(function (list) {
          return list.markdown(options);
        }).join('\n');
        md += '\n';
      }
    } //finally, write the sentence text.


    if (options.paragraphs === true || options.sentences === true) {
      md += this.paragraphs().map(function (p) {
        return p.sentences().map(function (s) {
          return s.markdown(options);
        }).join(' ');
      }).join('\n\n');
    }

    return md;
  };

  var _02Section = doSection;

  var defaults$2 = {
    sentences: true
  };

  var toMarkdown$1 = function toMarkdown(options) {
    options = Object.assign({}, defaults$2, options);
    var md = '';

    if (options.sentences === true) {
      md += this.sentences().reduce(function (str, s) {
        str += s.markdown(options) + '\n';
        return str;
      }, {});
    }

    return md;
  };

  var _03Paragraph = toMarkdown$1;

  //escape a string like 'fun*2.Co' for a regExpr
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
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
    links: true,
    formatting: true
  }; //create links, bold, italic in markdown

  var toMarkdown$2 = function toMarkdown(options) {
    options = Object.assign({}, defaults$3, options);
    var md = this.text(); //turn links back into links

    if (options.links === true) {
      this.links().forEach(function (link) {
        var mdLink = link.markdown();
        var str = link.text() || link.page();
        md = smartReplace_1(md, str, mdLink);
      });
    } //turn bolds into **bold**


    if (options.formatting === true) {
      this.bold().forEach(function (b) {
        md = smartReplace_1(md, b, '**' + b + '**');
      }); //support *italics*

      this.italic().forEach(function (i) {
        md = smartReplace_1(md, i, '*' + i + '*');
      });
    }

    return md;
  };

  var _04Sentence = toMarkdown$2;

  // add `[text](href)` to the text
  var toMarkdown$3 = function toMarkdown() {
    var href = this.href();
    href = href.replace(/ /g, '_'); // href = encodeURIComponent(href)

    var str = this.text() || this.page();
    return '[' + str + '](' + href + ')';
  };

  var _05Link = toMarkdown$3;

  //markdown images are like this: ![alt text](href)
  var toMarkdown$4 = function toMarkdown() {
    var alt = this.data.file.replace(/^(file|image):/i, '');
    alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
    return '![' + alt + '](' + this.thumbnail() + ')';
  };

  var image = toMarkdown$4;

  //center-pad each cell, to make the table more legible
  var pad = function pad(str, cellWidth) {
    str = str || '';
    str = String(str);
    cellWidth = cellWidth || 15;
    var diff = cellWidth - str.length;
    diff = Math.ceil(diff / 2);

    for (var i = 0; i < diff; i += 1) {
      str = ' ' + str;

      if (str.length < cellWidth) {
        str = str + ' ';
      }
    }

    return str;
  };

  var pad_1 = pad;

  var dontDo = {
    image: true,
    caption: true,
    alt: true,
    signature: true,
    'signature alt': true
  };
  var defaults$4 = {
    images: true
  }; //
  // render an infobox as a table with two columns, key + value

  var doInfobox = function doInfobox(options) {
    var _this = this;

    options = Object.assign({}, defaults$4, options);
    var md = '|' + pad_1('', 35) + '|' + pad_1('', 30) + '|\n';
    md += '|' + pad_1('---', 35) + '|' + pad_1('---', 30) + '|\n'; //todo: render top image here (somehow)

    Object.keys(this.data).forEach(function (k) {
      if (dontDo[k] === true) {
        return;
      }

      var key = '**' + k + '**';
      var s = _this.data[k];
      var val = s.markdown(options); //markdown is more newline-sensitive than wiki

      val = val.split(/\n/g).join(', ');
      md += '|' + pad_1(key, 35) + '|' + pad_1(val, 30) + ' |\n';
    });
    return md;
  };

  var infobox = doInfobox;

  //
  var toMarkdown$5 = function toMarkdown(options) {
    return this.lines().map(function (s) {
      var str = s.markdown(options);
      return ' * ' + str;
    }).join('\n');
  };

  var list = toMarkdown$5;

  //
  var toMarkdown$6 = function toMarkdown() {
    if (this.data && this.data.url && this.data.title) {
      return "\u2303 [".concat(this.data.title, "](").concat(this.data.url, ")");
    } else if (this.data.encyclopedia) {
      return "\u2303 ".concat(this.data.encyclopedia);
    } else if (this.data.title) {
      //cite book, etc
      var str = this.data.title;

      if (this.data.author) {
        str += this.data.author;
      }

      if (this.data.first && this.data.last) {
        str += this.data.first + ' ' + this.data.last;
      }

      return "\u2303 ".concat(str);
    } else if (this.inline) {
      return "\u2303 ".concat(this.inline.markdown());
    }

    return '';
  };

  var reference = toMarkdown$6;

  /* this is a markdown table:
  | Tables        | Are           | Cool  |
  | ------------- |:-------------:| -----:|
  | col 3 is      | right-aligned | $1600 |
  | col 2 is      | centered      |   $12 |
  | zebra stripes | are neat      |    $1 |
  */

  var makeRow = function makeRow(arr) {
    arr = arr.map(function (s) {
      return pad_1(s, 14);
    });
    return '| ' + arr.join(' | ') + ' |';
  }; //markdown tables are weird


  var doTable = function doTable(options) {
    var md = '';

    if (!this || this.length === 0) {
      return md;
    }

    var rows = this.data;
    var keys = Object.keys(rows[0]); //first, grab the headers
    //remove auto-generated number keys

    var headers = keys.map(function (k) {
      if (/^col[0-9]/.test(k) === true) {
        return '';
      }

      return k;
    }); //draw the header (necessary!)

    md += makeRow(headers) + '\n';
    md += makeRow(headers.map(function () {
      return '---';
    })) + '\n'; //do each row..

    md += rows.map(function (row) {
      //each column..
      var arr = keys.map(function (k) {
        if (!row[k]) {
          return '';
        }

        return row[k].markdown(options) || '';
      }); //make it a nice padded row

      return makeRow(arr);
    }).join('\n');
    return md + '\n';
  };

  var table = doTable;

  var plugin = function plugin(models) {
    models.Doc.prototype.markdown = _01Doc;
    models.Section.prototype.markdown = _02Section;
    models.Paragraph.prototype.markdown = _03Paragraph;
    models.Sentence.prototype.markdown = _04Sentence;
    models.Link.prototype.markdown = _05Link;
    models.Image.prototype.markdown = image;
    models.Infobox.prototype.markdown = infobox;
    models.Table.prototype.markdown = table;
    models.List.prototype.markdown = list;
    models.Reference.prototype.markdown = reference;
  };

  var src = plugin;

  return src;

})));
//# sourceMappingURL=wtf-plugin-markdown.js.map
