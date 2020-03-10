/* wtf-plugin-latex 0.0.1 MIT */
var defaults = {
  infoboxes: true,
  sections: true
}; // we should try to make this look like the wikipedia does, i guess.

var softRedirect = function softRedirect(doc) {
  var link = doc.redirectTo();
  var href = link.page;
  href = './' + href.replace(/ /g, '_'); //add anchor

  if (link.anchor) {
    href += '#' + link.anchor;
  }

  return '↳ \\href{' + href + '}{' + link.text + '}';
}; //


var toLatex = function toLatex(options) {
  options = Object.assign({}, defaults, options);
  var out = ''; //if it's a redirect page, give it a 'soft landing':

  if (this.isRedirect() === true) {
    return softRedirect(this); //end it here.
  } //render infoboxes (up at the top)


  if (options.infoboxes === true) {
    out += this.infoboxes().map(function (i) {
      return i.latex(options);
    }).join('\n');
  } //render each section


  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    out += this.sections().map(function (s) {
      return s.latex(options);
    }).join('\n');
  } //default off
  //render citations


  if (options.citations === true) {
    out += this.citations().map(function (c) {
      return c.latex(options);
    }).join('\n');
  }

  return out;
};

var _01Doc = toLatex;

var defaults$1 = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true
}; //map '==' depth to 'subsection', 'subsubsection', etc

var doSection = function doSection(options) {
  options = Object.assign({}, defaults$1, options);
  var out = '';
  var num = 1; //make the header

  if (options.headers === true && this.title()) {
    num = 1 + this.depth;
    var vOpen = '\n';
    var vClose = '}';

    switch (num) {
      case 1:
        vOpen += '\\chapter{';
        break;

      case 2:
        vOpen += '\\section{';
        break;

      case 3:
        vOpen += '\\subsection{';
        break;

      case 4:
        vOpen += '\\subsubsection{';
        break;

      case 5:
        vOpen += '\\paragraph{';
        vClose = '} \\\\ \n';
        break;

      case 6:
        vOpen += '\\subparagraph{';
        vClose = '} \\\\ \n';
        break;

      default:
        vOpen += '\n% section with depth=' + num + ' undefined - use subparagraph instead\n\\subparagraph{';
        vClose = '} \\\\ \n';
    }

    out += vOpen + this.title() + vClose;
    out += '\n';
  } //put any images under the header


  if (options.images === true && this.images()) {
    out += this.images().map(function (img) {
      return img.latex(options);
    }).join('\n'); //out += '\n';
  } //make a out tablew


  if (options.tables === true && this.tables()) {
    out += this.tables().map(function (t) {
      return t.latex(options);
    }).join('\n');
  } // //make a out bullet-list


  if (options.lists === true && this.lists()) {
    out += this.lists().map(function (list) {
      return list.latex(options);
    }).join('\n');
  } //finally, write the sentence text.


  if (options.paragraphs === true || options.sentences === true) {
    out += this.paragraphs().map(function (s) {
      return s.latex(options);
    }).join(' ');
    out += '\n';
  } // var title_tag = ' SECTION depth=' + num + ' - TITLE: ' + section.title + '\n';
  // wrap a section comment
  //out = '\n% BEGIN' + title_tag + out + '\n% END' + title_tag;


  return out;
};

var _02Section = doSection;

var defaults$2 = {
  sentences: true
};

var toLatex$1 = function toLatex(options) {
  options = Object.assign({}, defaults$2, options);
  var out = '';

  if (options.sentences === true) {
    out += '\n\n% BEGIN Paragraph\n';
    out += this.sentences().reduce(function (str, s) {
      str += s.latex(options) + '\n';
      return str;
    }, '');
    out += '% END Paragraph';
  }

  return out;
};

var _03Paragraph = toLatex$1;

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
}; // create links, bold, italic in latex

var toLatex$2 = function toLatex(options) {
  var _this = this;

  options = Object.assign({}, defaults$3, options);
  var text = this.plaintext(); //turn links back into links

  if (options.links === true && this.links().length > 0) {
    this.links().forEach(function (link) {
      var tag = link.latex();
      var str = _this.text || _this.page;
      text = smartReplace_1(text, str, tag);
    });
  }

  if (options.formatting === true) {
    if (this.data.fmt) {
      if (this.data.fmt.bold) {
        this.data.fmt.bold.forEach(function (str) {
          var tag = '\\textbf{' + str + '}';
          text = smartReplace_1(text, str, tag);
        });
      }

      if (this.data.fmt.italic) {
        this.data.fmt.italic.forEach(function (str) {
          var tag = '\\textit{' + str + '}';
          text = smartReplace_1(text, str, tag);
        });
      }
    }
  }

  return text;
};

var _04Sentence = toLatex$2;

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

var infobox = function infobox(options) {
  var _this = this;

  options = Object.assign({}, defaults$4, options);
  var out = '\n \\vspace*{0.3cm} % Info Box\n\n';
  out += '\\begin{tabular}{|@{\\qquad}l|p{9.5cm}@{\\qquad}|} \n';
  out += '  \\hline  %horizontal line\n'; //todo: render top image here

  Object.keys(this.data).forEach(function (k) {
    if (dontDo[k] === true) {
      return;
    }

    var s = _this.data[k];
    var val = s.latex(options);
    out += '  % ---------- \n';
    out += '      ' + k + ' & \n';
    out += '      ' + val + '\\\\ \n';
    out += '  \\hline  %horizontal line\n';
  });
  out += '\\end{tabular} \n';
  out += '\n\\vspace*{0.3cm}\n\n';
  return out;
};

var infobox_1 = infobox;

//
var toLatex$3 = function toLatex() {
  var alt = this.alt();
  var out = '\\begin{figure}';
  out += '\n\\includegraphics[width=\\linewidth]{' + this.thumb() + '}';
  out += '\n\\caption{' + alt + '}'; // out += '\n%\\label{fig:myimage1}';

  out += '\n\\end{figure}';
  return out;
};

var image = toLatex$3;

var plugin = function plugin(models) {
  models.Doc.latex = _01Doc;
  models.Section.latex = _02Section;
  models.Paragraph.latex = _03Paragraph;
  models.Sentence.latex = _04Sentence;
  models.Image.latex = image;
  models.Infobox.latex = infobox_1; // models.Link.latex = link
  // models.Template.latex = function(opts) {}
};

var src = plugin;

export default src;
