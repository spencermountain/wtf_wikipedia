/* wtf-plugin-html 0.1.0  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.wtf = factory());
}(this, (function () { 'use strict';

  var defaults = {
    title: true,
    infoboxes: true,
    headers: true,
    sections: true,
    links: true
  }; // we should try to make this look like the wikipedia does, i guess.

  var softRedirect = function softRedirect(doc) {
    var link = doc.redirectTo();
    var href = link.page;
    href = './' + href.replace(/ /g, '_');

    if (link.anchor) {
      href += '#' + link.anchor;
    }

    return "  <div class=\"redirect\">\n  \u21B3 <a class=\"link\" href=\"./".concat(href, "\">").concat(link.text, "</a>\n  </div>");
  }; //turn a Doc object into a HTML string


  var toHtml = function toHtml(options) {
    options = Object.assign({}, defaults, options);
    var data = this.data;
    var html = ''; //add page title

    if (options.title === true && data.title) {
      html += '<title>' + data.title + '</title>\n';
    } //if it's a redirect page, give it a 'soft landing':


    if (this.isRedirect() === true) {
      html += softRedirect(this);
      return html;
    } //render infoboxes (up at the top)


    if (options.infoboxes === true) {
      html += this.infoboxes().map(function (i) {
        return i.html(options);
      }).join('\n');
    } //render each section


    if (options.sections === true || options.paragraphs === true || options.sentences === true) {
      html += data.sections.map(function (s) {
        return s.html(options);
      }).join('\n');
    } //default off


    if (options.references === true) {
      html += '<h2>References</h2>';
      html += this.references().map(function (c) {
        return c.html(options);
      }).join('\n');
    }

    return html;
  };

  var _01Doc = toHtml;

  var defaults$1 = {
    headers: true,
    images: true,
    tables: true,
    lists: true,
    paragraphs: true
  };

  var doSection = function doSection(options) {
    options = Object.assign({}, defaults$1, options);
    var html = ''; //make the header

    if (options.headers === true && this.title()) {
      var num = 1 + this.depth;
      html += '  <h' + num + '>' + this.title() + '</h' + num + '>';
      html += '\n';
    } //put any images under the header


    if (options.images === true) {
      var imgs = this.images();

      if (imgs.length > 0) {
        html += imgs.map(function (image) {
          return image.html(options);
        }).join('\n');
      }
    } //make a html table


    if (options.tables === true) {
      html += this.tables().map(function (t) {
        return t.html(options);
      }).join('\n');
    } // //make a html bullet-list


    if (options.lists === true) {
      html += this.lists().map(function (list) {
        return list.html(options);
      }).join('\n');
    } //finally, write the sentence text.


    if (options.paragraphs === true && this.paragraphs().length > 0) {
      html += '  <div class="text">\n';
      this.paragraphs().forEach(function (p) {
        html += '    <p class="paragraph">\n';
        html += '      ' + p.sentences().map(function (s) {
          return s.html(options);
        }).join(' ');
        html += '\n    </p>\n';
      });
      html += '  </div>\n';
    } else if (options.sentences === true) {
      html += '      ' + this.sentences().map(function (s) {
        return s.html(options);
      }).join(' ');
    }

    return '<div class="section">\n' + html + '</div>\n';
  };

  var _02Section = doSection;

  var defaults$2 = {
    sentences: true
  };

  var toHtml$1 = function toHtml(options) {
    options = Object.assign({}, defaults$2, options);
    var html = '';

    if (options.sentences === true) {
      html += this.sentences().map(function (s) {
        return s.html(options);
      }).join('\n');
    }

    return html;
  };

  var _03Paragraph = toHtml$1;

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
  }; // create links, bold, italic in html

  var doSentence = function doSentence(options) {
    options = Object.assign({}, defaults$3, options);
    var text = this.text(); //turn links into <a href>

    if (options.links === true) {
      this.links().forEach(function (link) {
        var str = link.text() || link.page();
        var tag = link.html();
        text = smartReplace_1(text, str, tag);
      });
    }

    if (options.formatting === true) {
      //support bolds
      this.bold().forEach(function (str) {
        var tag = '<b>' + str + '</b>';
        text = smartReplace_1(text, str, tag);
      }); //do italics

      this.italic().forEach(function (str) {
        var tag = '<i>' + str + '</i>';
        text = smartReplace_1(text, str, tag);
      });
    }

    return '<span class="sentence">' + text + '</span>';
  };

  var _04Sentence = doSentence;

  var capitalise = function capitalise(str) {
    if (str && typeof str === 'string') {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return '';
  };

  var helpers = {
    capitalise: capitalise
  };

  var toHtml$2 = function toHtml() {
    var href = '';
    var classNames = 'link';

    if (this.site()) {
      //use an external link
      href = this.site();
      classNames += ' external';
    } else {
      //otherwise, make it a relative internal link
      var page = this.page();
      href = helpers.capitalise(page);
      href = './' + href.replace(/ /g, '_'); //add anchor

      if (this.anchor()) {
        href += "#".concat(this.anchor());
      }
    }

    var str = this.text() || this.page();
    return "<a class=\"".concat(classNames, "\" href=\"").concat(href, "\">").concat(str, "</a>");
  };

  var _05Link = toHtml$2;

  var defaults$4 = {
    images: true
  };
  var dontDo = {
    image: true,
    caption: true,
    alt: true,
    signature: true,
    'signature alt': true
  }; //

  var infobox = function infobox(options) {
    var _this = this;

    options = Object.assign({}, defaults$4, options);
    var html = '<table class="infobox">\n';
    html += '  <thead>\n';
    html += '  </thead>\n';
    html += '  <tbody>\n'; //put image and caption on the top

    if (options.images === true && this.data.image) {
      html += '    <tr>\n';
      html += '       <td colspan="2" style="text-align:center">\n';
      html += '       ' + this.image().html() + '\n';
      html += '       </td>\n';

      if (this.data.caption || this.data.alt) {
        var caption = this.data.caption ? this.data.caption.html(options) : this.data.alt.html(options);
        html += '       <td colspan="2" style="text-align:center">\n';
        html += '         ' + caption + '\n';
        html += '       </td>\n';
      }

      html += '    </tr>\n';
    }

    Object.keys(this.data).forEach(function (k) {
      if (dontDo[k] === true) {
        return;
      }

      var s = _this.data[k];
      var key = k.replace(/_/g, ' ');
      key = key.charAt(0).toUpperCase() + key.substring(1); //titlecase it

      var val = s.html(options);
      html += '    <tr>\n';
      html += '      <td>' + key + '</td>\n';
      html += '      <td>' + val + '</td>\n';
      html += '    </tr>\n';
    });
    html += '  </tbody>\n';
    html += '</table>\n';
    return html;
  };

  var infobox_1 = infobox;

  var makeImage = function makeImage() {
    return '  <img src="' + this.thumbnail() + '" alt="' + this.alt() + '"/>';
  };

  var image = makeImage;

  var plugin = function plugin(models) {
    models.Doc.prototype.html = _01Doc;
    models.Section.prototype.html = _02Section;
    models.Paragraph.prototype.html = _03Paragraph;
    models.Sentence.prototype.html = _04Sentence;
    models.Image.prototype.html = image;
    models.Infobox.prototype.html = infobox_1;
    models.Link.prototype.html = _05Link; // models.Template.html = function(opts) {}
  };

  var src = plugin;

  return src;

})));
//# sourceMappingURL=wtf-plugin-html.js.map
