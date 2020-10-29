const getRedirects = require('./getRedirects')
const getIncoming = require('./getIncoming')
const getPageViews = require('./getPageViews')

const addMethod = function (models, _templates, _wtf, http) {
  models.Doc.prototype.redirects = function () {
    return getRedirects(this, http)
  }
  models.Doc.prototype.incomingLinks = function () {
    return getIncoming(this, http)
  }
  models.Doc.prototype.pageViews = function () {
    return getPageViews(this, http)
  }
}
module.exports = addMethod
