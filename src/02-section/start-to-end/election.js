const parseTemplates = require('../../template')
//this is a non-traditional template, for some reason
//https://en.wikipedia.org/wiki/Template:Election_box
const parseElection = function(section) {
  let wiki = section.wiki
  wiki = wiki.replace(/\{\{election box begin([\s\S]+?)\{\{election box end\}\}/gi, tmpl => {
    let data = {
      wiki: tmpl,
      templates: []
    }
    //put it through our full template parser..
    parseTemplates(data)
    //okay, pull it apart into something sensible..
    let templates = data.templates.map(t => t.json())
    let start = templates.find(t => t.template === 'election box') || {}
    let candidates = templates.filter(t => t.template === 'election box candidate')
    let summary = templates.find(t => t.template === 'election box gain' || t.template === 'election box hold') || {}
    if (candidates.length > 0 || summary) {
      section.templates.push({
        template: 'election box',
        title: start.title,
        candidates: candidates,
        summary: summary.data
      })
    }
    //remove it all
    return ''
  })
  section.wiki = wiki
}
module.exports = parseElection
