const byInfobox = require('./byInfobox')
const byCategory = require('./byCategory')
const byTemplate = require('./byTemplate')
const bySection = require('./bySection')
const byTitle = require('./byTitle')
const byDescription = require('./byDescription')
const skipPage = require('./_skip')
const score = require('./score')

const plugin = function (models) {
  // add a new method to main class
  models.Doc.prototype.classify = function (options) {
    let doc = this
    let res = {}

    // dont classify these
    if (skipPage(doc, options)) {
      return score(res, options)
    }

    //look for 'infobox person', etc
    res.infobox = byInfobox(doc, options)

    //look for '{{coord}}'
    res.template = byTemplate(doc, options)

    //look for '==early life=='
    res.section = bySection(doc, options)

    //look for 'foo (film)'
    res.title = byTitle(doc, options)
    //look for 'foo (film)'
    res.description = byDescription(doc, options)

    //look for 'Category: 1992 Births', etc
    res.category = byCategory(doc, options)

    return score(res, options)
  }
}
module.exports = plugin
