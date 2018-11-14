const parseTemplates = require('../../templates');
//this is a non-traditional template, for some reason
//https://en.wikipedia.org/wiki/Template:Election_box
const parseElection = function(wiki, section) {
  wiki = wiki.replace(/\{\{election box begin([\s\S]+?)\{\{election box end\}\}/gi, (tmpl) => {
    let data = {
      templates: []
    };
    //put it through our full template parser..
    parseTemplates(tmpl, data, {});
    //okay, pull it apart into something sensible..
    let start = data.templates.find((t) => t.template === 'election box') || {};
    let candidates = data.templates.filter((t) => t.template === 'election box candidate');
    let summary = data.templates.find((t) => t.template === 'election box gain' || t.template === 'election box hold') || {};
    if (candidates.length > 0 || summary) {
      section.templates.push({
        template: 'election box',
        title: start.title,
        candidates: candidates,
        summary: summary.data
      });
    }
    //remove it all
    return '';
  });
  return wiki;
};
module.exports = parseElection;
