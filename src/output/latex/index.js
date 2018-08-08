const doInfobox = require('./infobox');
const setDefaults = require('../../lib/setDefaults');
// const doMath = require('./math');

const defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  title: true,
  images: true,
  links: true,
  formatting: true,
  sentences: true,
};


const doList = (list) => {
  let out = '\\begin{itemize}\n';
  list.forEach((o) => {
    out += '  \\item ' + o.text + '\n';
  });
  out += '\\end{itemize}\n';
  return out;
};

const doSection = (section, options) => {
  let out = '';
  let num = 1;
  //make the header
  if (options.title === true && section.title()) {
    num = 1 + section.depth;
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
    out += vOpen + section.title() + vClose;
    out += '\n';
  }
  //put any images under the header
  if (section.images() && options.images === true) {
    out += section.images().map((image) => image.latex(options)).join('\n');
  //out += '\n';
  }
  //make a out table
  if (section.tables() && options.tables === true) {
    out += section.tables().map((t) => t.latex(options)).join('\n');
  }
  // //make a out bullet-list
  if (section.lists() && options.lists === true) {
    out += section.lists().map((list) => doList(list, options)).join('\n');
  }
  //finally, write the sentence text.
  if (section.sentences() && options.sentences === true) {
    //out += '\n\n% BEGIN Paragraph\n'
    out += section.sentences().map((s) => s.latex(options)).join(' ');
    //out += '\n% END Paragraph';
    out += '\n';
  }
  // var title_tag = ' SECTION depth=' + num + ' - TITLE: ' + section.title + '\n';
  // wrap a section comment
  //out = '\n% BEGIN' + title_tag + out + '\n% END' + title_tag;
  return out;
};
//
const toLatex = function(doc, options) {
  options = setDefaults(options, defaults);
  let data = doc.data;
  let out = '';
  //add the title on the top
  // if (options.title === true && data.title) {
  //   out += '\\section{' + data.title + '}\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    out += data.infoboxes.map(o => doInfobox(o, options)).join('\n');
  }
  //render each section
  out += doc.sections().map(s => doSection(s, options)).join('\n');
  return out;
};
module.exports = toLatex;
