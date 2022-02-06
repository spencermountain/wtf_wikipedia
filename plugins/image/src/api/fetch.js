const unfetch = require('isomorphic-unfetch')
const makeUrl = require('../../../../src/_fetch/makeUrl')
const makeHeaders = require('../../../../src/_fetch/_headers')
const parse = require('./parse')

const methodsProps = { // the accepted methdos and the iiprop (imageinfo prop (URL parameter)) needed for each method
  license: "extmetadata",
  exists: "url"
}

/**
 * The error thrown when a method passed to the function is invalid
 * 
 * @class
 */
class InvalidMethod extends Error {
  constructor(invalidMethod) {
    super()
    const validMethods = Object.keys(methodsProps).join(', ')
    this.message = `'${invalidMethod}' cannot be passed to the 'images' method; `+
    `valid values are:\n${validMethods}`
    this.name = this.constructor.name
  }
}

/**
 * Fetches the information for an image or all the images.
 * 
 * @param {string[] | string} [methods] the methods that the data will be requested for
 * @param {Object[]} [images] an array of images (the old "images" method's results)
 * @returns {Promise<Object[]>} methods' results for an array of images
 * @throws {InvalidMethod} throws if a passed method is invalid
 */
function fetch( methods = "", images = []) {
  
  const isDoc = images.length ? true : false // whether the call is from a Document(".images()") or an Image
  let titles // will be a string or an array of strings
  let iiprop // will be a string
  const userAgent = isDoc ? this['_userAgent'] : this.data['_userAgent']
  const mpEntries = Object.entries(methodsProps)
  
  if (isDoc) {
    titles = images.map(i => i.file())

    // find the related iiprop for each method if an array, or for a single method if a string
    if (Array.isArray(methods)) {
      iiprop = []
      for (const m of methods) {
        for (const mp of mpEntries.entries()) { // mpEntries.entries(): [[<index>, [<method>, <iiprop>]], ...]
          if (m.toLowerCase() === mp[1][0]) {
            iiprop.push(mp[1][1])
            break
          }
          if (mp[0] === mpEntries.length - 1) { // if it's the last one and a match isn't found ...
            throw new InvalidMethod(m)
          }
        }
      }
      iiprop = iiprop.join("|")
    }
    else if (typeof methods === "string") {
      for (const mp of mpEntries) {
        if (methods.toLowerCase() === mp[0]) {
          iiprop = mp[1]
          break
        }
      }
      if (!iiprop) { // if a match isn't found ...
        throw new InvalidMethod(methods)
      }
    }
  }
  else {
    titles = this.file()
    for (const mp of mpEntries) {
      if (methods.toLowerCase() === mp[0]) {
        iiprop = mp[1]
        break
      }
    }
    if (!iiprop) { // if a match isn't found ...
      throw new InvalidMethod(methods)
    }
  }
  
  const options = {
    title: titles,
    domain: "commons.wikimedia.org",
    userAgent: userAgent
  }
  const params = {
    action: 'query',
    prop: "imageinfo",
    iiprop: iiprop,
    maxlag: 5,
    format: 'json',
    origin: '*',
  }
  const url = makeUrl(options, params)
  const headers = makeHeaders(options)
  return unfetch(url, headers)
    .then(res => res.json())
    .then(res => {
      if (!isDoc) {
        this.data.pluginData = {
          ...this.data.pluginData,
          ...parse(titles, res, isDoc)
        }
        return null
      }
      else{
        return parse(titles, res, isDoc)
      }
    })
    .catch(e => {
      console.error(e)
    })
}
module.exports = fetch
