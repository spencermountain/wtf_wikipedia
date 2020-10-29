const getRedirects = require('./getRedirects')
const getIncoming = require('./getIncoming')
const getPageViews = require('./getPageViews')
const randomCategory = require('./category/getRandom')

const addMethod = function (models) {
  models.Doc.prototype.redirects = function () {
    return getRedirects(this, models.http)
  }
  models.Doc.prototype.incomingLinks = function () {
    return getIncoming(this, models.http)
  }
  models.Doc.prototype.pageViews = function () {
    return getPageViews(this, models.http)
  }
  models.wtf.randomCategory = function (options) {
    return randomCategory(options, models.http)
  }
}
module.exports = addMethod
