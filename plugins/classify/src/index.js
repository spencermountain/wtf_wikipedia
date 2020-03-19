const byCategory = require('./byCategory')
const byInfobox = require('./byInfobox')
const types = require('./_types')

const plugin = function(models) {
  // add a new method to main class
  models.Doc.prototype.classify = function(options) {
    let doc = this
    let found = null

    //look for 'infobox person', etc
    found = byInfobox(doc)
    if (types[found]) {
      return found
    }
    //look for 'Category: 1992 Births', etc
    found = byCategory(doc)
    if (types[found]) {
      return found
    }
    return found
  }
}
module.exports = plugin
