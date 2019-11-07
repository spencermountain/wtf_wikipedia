const setDefaults = require('../_lib/setDefaults');
const defaults = {
  title: true,
  infoboxes: true,
  headers: true,
  sections: true,
  links: true,
  docinfo: {
    language:"en",
    domain:"wikipedia",
    // title:"My Title", title is defined as JSON data of document
    //"linktype":"absolute"
    linktype:"relative"
  },
  reveal:{
    refs_per_page:5,
    author:"Wiki Authors",
  }
};
// we should try to make this look like the wikipedia does, i guess.
const softRedirect = function(doc) {
  let link = doc.redirectTo();
  let href = link.page;
  href = './' + href.replace(/ /g, '_');
  if (link.anchor) {
    href += '#' + link.anchor;
  }
  return `  <div class="redirect">
  ↳ <a class="link" href="./${href}">${link.text}</a>
  </div>`;
};

//turn a Doc object into a HTML string
const toReveal = function(doc, options) {
  options = setDefaults(options, defaults);
  let data = doc.data;
  let html = '';
  //html += '<div class="reveal">\n';
  //html += '  <div class="slides" id="divslides">\n';
  //add presentation title page
  if (options.title === true && data.title) {
    html += '   <section id="firstslide">\n'
    html += '      <h1 class="title">'+ data.title +'</h1>\n'
    html += '      <h2 class="author">'+ options.author +'</h2>\n'
    html += '   </section>\n';
  }
  // html += '</head>\n';
  // html += '<body>\n';

  //if it's a redirect page, give it a 'soft landing':
  if (doc.isRedirect() === true) {
    html += softRedirect(doc);
    //return html + '\n  </div>\n</div>'; //end it here.
    return html; //end it here.
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true) {
    html += doc.infoboxes().map(i => i.html(options)).join('\n');
  }
  //render each section
  if (options.sections === true && (options.paragraphs === true || options.sentences === true)) {
    html += data.sections.map(s => s.reveal(options)).join('\n');
  }
  //default off
  if (options.references === true) {
    html +=   '<section id="wiki_references" class="level2">\n';
    html += '     <h2>References</h2>';
    // TODO: split into several slides, if length of references to long
    // References Count per Page - default 5 - set by options
    html += doc.references().map((c) => c.json(options)).join('\n');
    html += '   </section>\n';
  }
  //html += '  </div>\n';
  //html += '</div>';
  return html;
};
module.exports = toReveal;
