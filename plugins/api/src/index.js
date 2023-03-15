import getRedirects from './getRedirects.js'
import getIncoming from './getIncoming.js'
import getPageViews from './getPageViews.js'
import getTransclusions from './getTransclusions.js'
import getCategory from './getCategory.js'
import getRandomPage from './getRandom.js'
import getRandomCategory from './getRandomCategory.js'
import fetchList from './fetchList.js'

const addMethod = function (models) {
  // doc methods
  models.Doc.prototype.getRedirects = function () {
    return getRedirects(this.title(), this.options(), models.http)
  }
  models.Doc.prototype.getIncoming = function () {
    return getIncoming(this.title(), this.options(), models.http)
  }
  models.Doc.prototype.getPageViews = function () {
    return getPageViews(this, this.options(), models.http)
  }

  // constructor methods
  models.wtf.getRandomPage = function (options) {
    return getRandomPage(options, models.http, models.wtf)
  }
  models.wtf.getRandomCategory = function (options) {
    return getRandomCategory(options, models.http)
  }
  models.wtf.getTemplatePages = function (template, options) {
    return getTransclusions(template, options, models.http)
  }
  models.wtf.getCategoryPages = function (category, options) {
    return getCategory(category, options, models.http)
  }
  models.wtf.fetchList = function (list, options) {
    return fetchList(list, options, models.wtf)
  }
  models.wtf.getIncoming = function (title, options) {
    return getIncoming(title, options, models.http)
  }
  models.wtf.getRedirects = function (title, options) {
    return getRedirects(title, options, models.http)
  }
  // aliases
  models.wtf.random = models.wtf.getRandomPage
}
export default addMethod
