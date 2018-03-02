const doInfobox = require('./infobox');
const doSection = require('./section');

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

//
const toHtml = function(doc, options) {
  options = Object.assign(defaults, options);
  let data = doc.data;
  let html = '';
  //add the title on the top
  // if (options.title === true && data.title) {
  //   html += '<h1>' + data.title + '</h1>\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    html += data.infoboxes.map(o => doInfobox(o, options)).join('\n');
  }
  //render each section
  html += data.sections.map(s => doSection(s, options)).join('\n');
  return html;
};
module.exports = toHtml;
