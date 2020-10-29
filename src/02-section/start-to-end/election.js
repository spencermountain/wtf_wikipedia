const parseTemplates = require('../../template')

/**
 * parses out the `Election_box` template from the wiki text
 *
 * this is a non-traditional template, for some reason
 * https://en.wikipedia.org/wiki/Template:Election_box
 *
 * @private
 * @param {Catcher} catcher an object to provide and catch data
 */
const parseElection = function (catcher) {
  catcher.text = catcher.text.replace(/\{\{election box begin([\s\S]+?)\{\{election box end\}\}/gi, tmpl => {
    let data = {
      _wiki: tmpl,
      _templates: [],
    }

    //put it through our full template parser..
    parseTemplates(data)

    //okay, pull it apart into something sensible..
    let templates = data._templates.map(t => t.json())

    let start = templates.find(t => t.template === 'election box') || {}
    let candidates = templates.filter(t => t.template === 'election box candidate')
    let summary = templates.find(t => t.template === 'election box gain' || t.template === 'election box hold') || {}

    if (candidates.length > 0 || summary) {
      catcher.templates.push({
        template: 'election box',
        title: start.title,
        candidates: candidates,
        summary: summary.data,
      })
    }

    //return empty string to remove the template from the wiki text
    return ''
  })
}

module.exports = parseElection
