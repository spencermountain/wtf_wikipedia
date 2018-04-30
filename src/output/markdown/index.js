const doSection = require('./section');
const doInfobox = require('./infobox');

const toMarkdown = function(doc, options) {
  let data = doc.data;
  let md = '';
  //add the title on the top
  // if (data.title) {
  //   md += '# ' + data.title + '\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    md += doc.infoboxes().map(infobox => doInfobox(infobox, options)).join('\n\n');
  }
  //render each section
  md += data.sections.map(s => doSection(s, options)).join('\n\n');
  return md;
};
module.exports = toMarkdown;
