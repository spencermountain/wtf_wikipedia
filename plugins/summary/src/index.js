const summary = require('./summary')

const plugin = function(models) {
  // add a new method to main class
  models.Doc.prototype.summary = function(options) {
    return summary(this, options)
  }
}
module.exports = plugin
