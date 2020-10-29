const getRedirects = require('./getRedirects')
const getIncoming = require('./getIncoming')
const getPageViews = require('./getPageViews')
const getTransclusions = require('./getTransclusions')
const getCategory = require('./category/getCategory')
const randomCategory = require('./category/getRandom')

const addMethod = function (models) {
  // doc methods
  models.Doc.prototype.getRedirects = function () {
    return getRedirects(this, models.http)
  }
  models.Doc.prototype.getIncoming = function () {
    return getIncoming(this, models.http)
  }
  models.Doc.prototype.getPageViews = function () {
    return getPageViews(this, models.http)
  }

  // constructor methods
  models.wtf.getRandomCategory = function (options) {
    return randomCategory(options, models.http)
  }
  models.wtf.getTemplatePages = function (template, options) {
    return getTransclusions(template, options, models.http)
  }
  models.wtf.getCategoryPages = function (category, options) {
    return getCategory(category, options, models.wtf)
  }
}
module.exports = addMethod
