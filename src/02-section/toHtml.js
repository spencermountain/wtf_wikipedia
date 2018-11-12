const setDefaults = require('../_lib/setDefaults');
const defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true,
};
const doSection = (section, options) => {
  options = setDefaults(options, defaults);
  let html = '';
  //make the header
  if (options.headers === true && section.title()) {
    let num = 1 + section.depth;
    html += '  <h' + num + '>' + section.title() + '</h' + num + '>';
    html += '\n';
  }
  //put any images under the header
  if (options.images === true) {
    let imgs = section.images();
    if (imgs.length > 0) {
      html += imgs.map((image) => image.html(options)).join('\n');
    }
  }
  //make a html table
  if (options.tables === true) {
    html += section.tables().map((t) => t.html(options)).join('\n');
  }
  // //make a html bullet-list
  if (options.lists === true) {
    html += section.lists().map((list) => list.html(options)).join('\n');
  }
  //finally, write the sentence text.
  if (options.paragraphs === true && section.paragraphs().length > 0) {
    html += '  <div class="text">\n';
    section.paragraphs().forEach((p) => {
      html += '    <p class="paragraph">\n';
      html += '      ' + p.sentences().map((s) => s.html(options)).join(' ');
      html += '\n    </p>\n';
    });
    html += '  </div>\n';
  } else if (options.sentences === true) {
    html += '      ' + section.sentences().map((s) => s.html(options)).join(' ');
  }
  return '<div class="section">\n' + html + '</div>\n';
};
module.exports = doSection;
