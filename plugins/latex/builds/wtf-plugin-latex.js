/* wtf-plugin-latex 0.2.1  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtfLatex = factory());
})(this, (function () { 'use strict';

  const defaults$4 = {
    infoboxes: true,
    sections: true
  }; // we should try to make this look like the wikipedia does, i guess.

  const softRedirect = function (doc) {
    let link = doc.redirectTo();
    let href = link.page;
    href = './' + href.replace(/ /g, '_'); //add anchor

    if (link.anchor) {
      href += '#' + link.anchor;
    }

    return '↳ \\href{' + href + '}{' + link.text + '}';
  }; //


  const toLatex$6 = function (options) {
    options = Object.assign({}, defaults$4, options);
    let out = ''; //if it's a redirect page, give it a 'soft landing':

    if (this.isRedirect() === true) {
      return softRedirect(this); //end it here.
    } //render infoboxes (up at the top)


    if (options.infoboxes === true) {
      out += this.infoboxes().map(i => i.latex(options)).join('\n');
    } //render each section


    if (options.sections === true || options.paragraphs === true || options.sentences === true) {
      out += this.sections().map(s => s.latex(options)).join('\n');
    } //default off
    //render citations


    if (options.references === true) {
      out += this.references().map(c => c.latex(options)).join('\n');
    }

    return out;
  };

  var _01Doc = toLatex$6;

  const defaults$3 = {
    headers: true,
    images: true,
    tables: true,
    lists: true,
    paragraphs: true
  }; //map '==' depth to 'subsection', 'subsubsection', etc

  const doSection = function (options) {
    options = Object.assign({}, defaults$3, options);
    let out = '';
    let num = 1; //make the header

    if (options.headers === true && this.title()) {
      num = 1 + this.depth();
      let vOpen = '\n';
      let vClose = '}';

      if (num === 1) {
        vOpen += '\\chapter{';
      } else if (num === 2) {
        vOpen += '\\section{';
      } else if (num === 3) {
        vOpen += '\\subsection{';
      } else if (num === 4) {
        vOpen += '\\subsubsection{';
      } else if (num === 5) {
        vOpen += '\\paragraph{';
        vClose = '} \\\\ \n';
      } else if (num === 6) {
        vOpen += '\\subparagraph{';
        vClose = '} \\\\ \n';
      } else {
        vOpen += '\n% section with depth=' + num + ' undefined - use subparagraph instead\n\\subparagraph{';
        vClose = '} \\\\ \n';
      }

      out += vOpen + this.title() + vClose;
      out += '\n';
    } //put any images under the header


    if (options.images === true && this.images()) {
      out += this.images().map(img => img.latex(options)).join('\n'); //out += '\n';
    } //make a out table


    if (options.tables === true && this.tables()) {
      out += this.tables().map(t => t.latex(options)).join('\n');
    } //make a out bullet-list


    if (options.lists === true && this.lists()) {
      out += this.lists().map(list => list.latex(options)).join('\n');
    } //finally, write the sentence text.


    if (options.paragraphs === true || options.sentences === true) {
      out += this.paragraphs().map(s => s.latex(options)).join(' ');
      out += '\n';
    } //let title_tag = ' SECTION depth=' + num + ' - TITLE: ' + section.title + '\n';
    //wrap a section comment
    //out = '\n% BEGIN' + title_tag + out + '\n% END' + title_tag;


    return out;
  };

  var _02Section = doSection;

  const defaults$2 = {
    sentences: true
  };

  const toLatex$5 = function (options) {
    options = Object.assign({}, defaults$2, options);
    let out = '';

    if (options.sentences === true) {
      out += '\n\n% BEGIN Paragraph\n';
      out += this.sentences().reduce((str, s) => {
        str += s.latex(options) + '\n';
        return str;
      }, '');
      out += '% END Paragraph';
    }

    return out;
  };

  var _03Paragraph = toLatex$5;

  function escapeRegExp(str) {
    return str.replace(/[\-[\]/{}()*+?.\\^$|]/g, '\\$&');
  } //sometimes text-replacements can be ambiguous - words used multiple times..


  const smartReplace$1 = function (all, text, result) {
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

  var smartReplace_1 = smartReplace$1;

  const smartReplace = smartReplace_1;
  const defaults$1 = {
    links: true,
    formatting: true
  }; // create links, bold, italic in latex

  const toLatex$4 = function (options) {
    options = Object.assign({}, defaults$1, options);
    let text = this.text(); //turn links back into links

    if (options.links === true && this.links().length > 0) {
      this.links().forEach(link => {
        let tag = link.latex();
        let str = link.text() || link.page();
        text = smartReplace(text, str, tag);
      });
    }

    if (options.formatting === true) {
      if (this.data.fmt) {
        if (this.data.fmt.bold) {
          this.data.fmt.bold.forEach(str => {
            let tag = '\\textbf{' + str + '}';
            text = smartReplace(text, str, tag);
          });
        }

        if (this.data.fmt.italic) {
          this.data.fmt.italic.forEach(str => {
            let tag = '\\textit{' + str + '}';
            text = smartReplace(text, str, tag);
          });
        }
      }
    }

    return text;
  };

  var _04Sentence = toLatex$4;

  const toLatex$3 = function () {
    let href = this.href();
    href = href.replace(/ /g, '_');
    let str = this.text() || this.page();
    return '\\href{' + href + '}{' + str + '}';
  };

  var _05Link = toLatex$3;

  const toLatex$2 = function () {
    let alt = this.alt();
    let out = '\\begin{figure}';
    out += '\n\\includegraphics[width=\\linewidth]{' + this.thumb() + '}';
    out += '\n\\caption{' + alt + '}'; // out += '\n%\\label{fig:myimage1}';

    out += '\n\\end{figure}';
    return out;
  };

  var image$1 = toLatex$2;

  const dontDo = {
    image: true,
    caption: true,
    alt: true,
    signature: true,
    'signature alt': true
  };
  const defaults = {
    images: true
  }; //

  const infobox$1 = function (options) {
    options = Object.assign({}, defaults, options);
    let out = '\n \\vspace*{0.3cm} % Info Box\n\n';
    out += '\\begin{tabular}{|@{\\qquad}l|p{9.5cm}@{\\qquad}|} \n';
    out += '  \\hline  %horizontal line\n'; //todo: render top image here

    Object.keys(this.data).forEach(k => {
      if (dontDo[k] === true) {
        return;
      }

      let s = this.data[k];
      let val = s.latex(options);
      out += '  % ---------- \n';
      out += '      ' + k + ' & \n';
      out += '      ' + val + '\\\\ \n';
      out += '  \\hline  %horizontal line\n';
    });
    out += '\\end{tabular} \n';
    out += '\n\\vspace*{0.3cm}\n\n';
    return out;
  };

  var infobox_1 = infobox$1;

  const toLatex$1 = function (options) {
    let out = '\\begin{itemize}\n';
    this.lines().forEach(s => {
      out += '  \\item ' + s.text(options) + '\n';
    });
    out += '\\end{itemize}\n';
    return out;
  };

  var list$1 = toLatex$1;

  const toLatex = function () {
    let str = this.title();
    return '⌃ ' + str + '\n';
  };

  var reference$1 = toLatex;

  const doTable = function (options) {
    let rows = this.data;
    let out = '\n%\\vspace*{0.3cm}\n';
    out += '\n% BEGIN TABLE: only left align columns in LaTeX table with horizontal line separation between columns';
    out += "\n% Format Align Column: 'l'=left 'r'=right align, 'c'=center, 'p{5cm}'=block with column width 5cm ";
    out += '\n\\begin{tabular}{|';
    Object.keys(rows[0]).forEach(() => {
      out += 'l|';
    });
    out += '} \n';
    out += '\n  \\hline  %horizontal line\n'; //make header

    out += '\n  % BEGIN: Table Header';
    let vSep = '   ';
    Object.keys(rows[0]).forEach(k => {
      out += '\n    ' + vSep;

      if (k.indexOf('col-') === 0) {
        out += '\\textbf{' + k + '}';
      } else {
        out += '  ';
      }

      vSep = ' & ';
    });
    out += '\\\\ ';
    out += '\n  % END: Table Header';
    out += '\n  % BEGIN: Table Body';
    out += '\n  \\hline  % ----- table row -----'; ////make rows

    rows.forEach(o => {
      vSep = ' ';
      out += '\n  % ----- table row -----';
      Object.keys(o).forEach(k => {
        let s = o[k];
        let val = s.latex(options);
        out += '\n    ' + vSep + val + '';
        vSep = ' & ';
      });
      out += '  \\\\ '; // newline in latex table = two backslash \\

      out += '\n  \\hline  %horizontal line';
    });
    out += '\n    % END: Table Body';
    out += '\\end{tabular} \n';
    out += '\n\\vspace*{0.3cm}\n\n';
    return out;
  };

  var table$1 = doTable;

  const doc = _01Doc;
  const section = _02Section;
  const paragraph = _03Paragraph;
  const sentence = _04Sentence;
  const link = _05Link;
  const image = image$1;
  const infobox = infobox_1;
  const list = list$1;
  const reference = reference$1;
  const table = table$1;

  const plugin = function (models) {
    models.Doc.prototype.latex = doc;
    models.Section.prototype.latex = section;
    models.Paragraph.prototype.latex = paragraph;
    models.Sentence.prototype.latex = sentence;
    models.Image.prototype.latex = image;
    models.Link.prototype.latex = link;
    models.Image.prototype.latex = image;
    models.Infobox.prototype.latex = infobox;
    models.List.prototype.latex = list;
    models.Reference.prototype.latex = reference;
    models.Table.prototype.latex = table;
  };

  var src = plugin;

  return src;

}));
//# sourceMappingURL=wtf-plugin-latex.js.map
