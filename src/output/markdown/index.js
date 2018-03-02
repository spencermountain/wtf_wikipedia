const doSection = require('./section');
const doInfobox = require('./infobox');

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

const toMarkdown = function(doc, options) {
  options = Object.assign(defaults, options);
  let data = doc.data;
  let md = '';
  //add the title on the top
  // if (data.title) {
  //   md += '# ' + data.title + '\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    md += data.infoboxes.map(o => doInfobox(o, options)).join('\n');
  }
  //render each section
  md += data.sections.map(s => doSection(s, options)).join('\n\n');
  return md;
};
module.exports = toMarkdown;
