/* wtf-plugin-latex 1.0.0  MIT */
const defaults$4 = {
  infoboxes: true,
  sections: true
};

// we should try to make this look like the wikipedia does, i guess.
function softRedirect (doc) {
  let link = doc.redirectTo();
  let href = link.page;
  href = './' + href.replace(/ /g, '_');
  //add anchor
  if (link.anchor) {
    href += '#' + link.anchor;
  }
  return '↳ \\href{' + href + '}{' + link.text + '}'
}

//
function toLatex$6 (options) {
  options = Object.assign({}, defaults$4, options);
  let out = '';
  //if it's a redirect page, give it a 'soft landing':
  if (this.isRedirect() === true) {
    return softRedirect(this) //end it here.
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true) {
    out += this.infoboxes()
      .map((i) => i.latex(options))
      .join('\n');
  }
  //render each section
  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    out += this.sections()
      .map((s) => s.latex(options))
      .join('\n');
  }
  //default off
  //render citations
  if (options.references === true) {
    out += this.references()
      .map((c) => c.latex(options))
      .join('\n');
  }
  return out
}

const defaults$3 = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true
};
//map '==' depth to 'subsection', 'subsubsection', etc
function doSection (options) {
  options = Object.assign({}, defaults$3, options);
  let out = '';
  let num = 1;

  //make the header
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
      vOpen +=
        '\n% section with depth=' + num + ' undefined - use subparagraph instead\n\\subparagraph{';
      vClose = '} \\\\ \n';
    }
    out += vOpen + this.title() + vClose;
    out += '\n';
  }

  //put any images under the header
  if (options.images === true && this.images()) {
    out += this.images()
      .map((img) => img.latex(options))
      .join('\n');
    //out += '\n';
  }

  //make a out table
  if (options.tables === true && this.tables()) {
    out += this.tables()
      .map((t) => t.latex(options))
      .join('\n');
  }

  //make a out bullet-list
  if (options.lists === true && this.lists()) {
    out += this.lists()
      .map((list) => list.latex(options))
      .join('\n');
  }

  //finally, write the sentence text.
  if (options.paragraphs === true || options.sentences === true) {
    out += this.paragraphs()
      .map((s) => s.latex(options))
      .join(' ');
    out += '\n';
  }

  //let title_tag = ' SECTION depth=' + num + ' - TITLE: ' + section.title + '\n';
  //wrap a section comment
  //out = '\n% BEGIN' + title_tag + out + '\n% END' + title_tag;
  return out
}

const defaults$2 = {
  sentences: true
};

function toLatex$5 (options) {
  options = Object.assign({}, defaults$2, options);
  let out = '';
  if (options.sentences === true) {
    out += '\n\n% BEGIN Paragraph\n';
    out += this.sentences().reduce((str, s) => {
      str += s.latex(options) + '\n';
      return str
    }, '');
    out += '% END Paragraph';
  }
  return out
}

//escape a string like 'fun*2.Co' for a regExpr
function escapeRegExp (str) {
  return str.replace(/[\-[\]/{}()*+?.\\^$|]/g, '\\$&')
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

const defaults$1 = {
  links: true,
  formatting: true
};
// create links, bold, italic in latex
function toLatex$4 (options) {
  options = Object.assign({}, defaults$1, options);
  let text = this.text();
  //turn links back into links
  if (options.links === true && this.links().length > 0) {
    this.links().forEach((link) => {
      let tag = link.latex();
      let str = link.text() || link.page();
      text = smartReplace(text, str, tag);
    });
  }
  if (options.formatting === true) {
    if (this.data.fmt) {
      if (this.data.fmt.bold) {
        this.data.fmt.bold.forEach((str) => {
          let tag = '\\textbf{' + str + '}';
          text = smartReplace(text, str, tag);
        });
      }
      if (this.data.fmt.italic) {
        this.data.fmt.italic.forEach((str) => {
          let tag = '\\textit{' + str + '}';
          text = smartReplace(text, str, tag);
        });
      }
    }
  }
  return text
}

function toLatex$3 () {
  let href = this.href();
  href = href.replace(/ /g, '_');
  let str = this.text() || this.page();
  return '\\href{' + href + '}{' + str + '}'
}

//
function toLatex$2 () {
  let alt = this.alt();
  let out = '\\begin{figure}';
  out += '\n\\includegraphics[width=\\linewidth]{' + this.thumb() + '}';
  out += '\n\\caption{' + alt + '}';
  // out += '\n%\\label{fig:myimage1}';
  out += '\n\\end{figure}';
  return out
}

const dontDo = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  'signature alt': true
};

const defaults = {
  images: true
};

//
function infobox (options) {
  options = Object.assign({}, defaults, options);
  let out = '\n \\vspace*{0.3cm} % Info Box\n\n';
  out += '\\begin{tabular}{|@{\\qquad}l|p{9.5cm}@{\\qquad}|} \n';
  out += '  \\hline  %horizontal line\n';
  //todo: render top image here
  Object.keys(this.data).forEach((k) => {
    if (dontDo[k] === true) {
      return
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
  return out
}

//
function toLatex$1 (options) {
  let out = '\\begin{itemize}\n';
  this.lines().forEach((s) => {
    out += '  \\item ' + s.text(options) + '\n';
  });
  out += '\\end{itemize}\n';
  return out
}

//not so impressive right now
function toLatex () {
  let str = this.title();
  return '⌃ ' + str + '\n'
}

//create a formal LATEX table
function doTable (options) {
  let rows = this.data;
  let out = '\n%\\vspace*{0.3cm}\n';
  out +=
    '\n% BEGIN TABLE: only left align columns in LaTeX table with horizontal line separation between columns';
  out +=
    "\n% Format Align Column: 'l'=left 'r'=right align, 'c'=center, 'p{5cm}'=block with column width 5cm ";
  out += '\n\\begin{tabular}{|';
  Object.keys(rows[0]).forEach(() => {
    out += 'l|';
  });
  out += '} \n';
  out += '\n  \\hline  %horizontal line\n';
  //make header
  out += '\n  % BEGIN: Table Header';
  let vSep = '   ';
  Object.keys(rows[0]).forEach((k) => {
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
  out += '\n  \\hline  % ----- table row -----';
  ////make rows
  rows.forEach((o) => {
    vSep = ' ';
    out += '\n  % ----- table row -----';
    Object.keys(o).forEach((k) => {
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
  return out
}

function plugin (models) {
  models.Doc.prototype.latex = toLatex$6;
  models.Section.prototype.latex = doSection;
  models.Paragraph.prototype.latex = toLatex$5;
  models.Sentence.prototype.latex = toLatex$4;
  models.Image.prototype.latex = toLatex$2;
  models.Link.prototype.latex = toLatex$3;
  models.Image.prototype.latex = toLatex$2;
  models.Infobox.prototype.latex = infobox;
  models.List.prototype.latex = toLatex$1;
  models.Reference.prototype.latex = toLatex;
  models.Table.prototype.latex = doTable;
}

export { plugin as default };
