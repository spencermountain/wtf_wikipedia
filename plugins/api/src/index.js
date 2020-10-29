const getRedirects = require('./getRedirects')

const addMethod = function (models, templates, wtf, http) {
  models.Doc.prototype.redirects = function () {
    return getRedirects(this, http)
  }
}
module.exports = addMethod
