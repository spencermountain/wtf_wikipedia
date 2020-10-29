const getRedirects = require('./getRedirects')
const getIncoming = require('./getIncoming')
const getPageViews = require('./getPageViews')
const getTransclusions = require('./getTransclusions')
const getCategory = require('./category/getCategory')
const randomCategory = require('./category/getRandom')

const addMethod = function (models) {
  // doc methods
  models.Doc.prototype.redirects = function () {
    return getRedirects(this, models.http)
  }
  models.Doc.prototype.incomingLinks = function () {
    return getIncoming(this, models.http)
  }
  models.Doc.prototype.pageViews = function () {
    return getPageViews(this, models.http)
  }
  // constructor methods
  models.wtf.randomCategory = function (options) {
    return randomCategory(options, models.http)
  }
  models.wtf.getTemplate = function (template, options) {
    return getTransclusions(template, options, models.http)
  }
  models.wtf.getCategory = function (category, options) {
    return getCategory(category, options, models.wtf)
  }
}
module.exports = addMethod
