const byInfobox = require('./byInfobox')
const byCategory = require('./byCategory')
const byTemplate = require('./byTemplate')
const bySection = require('./bySection')
const byTitle = require('./byTitle')
const skipPage = require('./_skip')
const types = require('./_types')

const score = function(res) {
  // let scores = {}
  return res
}

const plugin = function(models) {
  // add a new method to main class
  models.Doc.prototype.classify = function(options) {
    let doc = this
    let found = null
    let res = {}

    // dont classify these
    if (skipPage(doc)) {
      return null
    }

    //look for 'infobox person', etc
    res.infobox = byInfobox(doc)

    //look for '{{coord}}'
    res.template = byTemplate(doc)

    //look for '==early life=='
    res.section = bySection(doc)

    //look for 'foo (film)'
    res.title = byTitle(doc)

    //look for 'Category: 1992 Births', etc
    res.category = byCategory(doc)

    // let scored = score(res)
    return res
  }
}
module.exports = plugin
