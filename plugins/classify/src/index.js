const classify = require('./classify')

const plugin = function(models) {
  // add a new method to main class
  models.Doc.prototype.classify = function(options) {
    return classify(this, options)
  }
}
module.exports = plugin
