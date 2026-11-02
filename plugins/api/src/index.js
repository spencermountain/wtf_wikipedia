import version from './_version.js'
import http from './_http.js'
import getRedirects from './getRedirects.js'
import getIncoming from './getIncoming.js'
import getPageViews from './getPageViews.js'
import getTransclusions from './getTransclusions.js'
import getCategory from './getCategory.js'
import getRandomPage from './getRandom.js'
import getRandomCategory from './getRandomCategory.js'
import fetchList from './fetchList.js'
import getParse from './getParse.js'
import getExtract from './getExtract.js'
import mainImage from './mainImage.js'
import commonsURL from './commonsURL.js'
import imageExists from './imageExists.js'
import imageLicense from './imageLicense.js'

const addMethod = function (models) {
  // doc methods
  models.Doc.prototype.getRedirects = function () {
    return getRedirects(this.title, this.options(), http)
  }
  models.Doc.prototype.getIncoming = function () {
    return getIncoming(this.title, this.options(), http)
  }
  models.Doc.prototype.getPageViews = function () {
    return getPageViews(this, this.options(), http)
  }
  models.Doc.prototype.mainImage = mainImage
  models.Doc.prototype.getHtml = function () {
    return getParse(this.title, this.options(), http, 'text')
  }
  models.Doc.prototype.getWikiscript = function () {
    return getParse(this.title, this.options(), http, 'wikitext')
  }
  models.Doc.prototype.getExtract = function (options) {
    return getExtract(this.title, { ...this.options(), ...options }, http)
  }

  // image methods
  models.Image.prototype.commonsURL = function () {
    return commonsURL(this.file())
  }
  models.Image.prototype.exists = function (options) {
    return imageExists(this.url(), options)
  }
  models.Image.prototype.license = function (options) {
    return imageLicense(this.file(), options, http)
  }

  // constructor methods
  models.wtf.getRandomPage = function (options) {
    return getRandomPage(options, http, models.wtf)
  }
  models.wtf.getRandomCategory = function (options) {
    return getRandomCategory(options, http)
  }
  models.wtf.getTemplatePages = function (template, options) {
    return getTransclusions(template, options, http)
  }
  models.wtf.getCategoryPages = function (category, options) {
    return getCategory(category, options, http)
  }
  models.wtf.fetchList = function (list, options) {
    return fetchList(list, options, models.wtf)
  }
  models.wtf.getIncoming = function (title, options) {
    return getIncoming(title, options, http)
  }
  models.wtf.getRedirects = function (title, options) {
    return getRedirects(title, options, http)
  }
  models.wtf.getHtml = function (title, options) {
    return getParse(title, options, http, 'text')
  }
  models.wtf.getWikiscript = function (title, options) {
    return getParse(title, options, http, 'wikitext')
  }
  models.wtf.getExtract = function (title, options) {
    return getExtract(title, options, http)
  }
  // aliases
  models.wtf.random = models.wtf.getRandomPage
}
addMethod.version = version

export default addMethod
