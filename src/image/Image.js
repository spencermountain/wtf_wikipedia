import toJson from './toJson.js'
const server = 'wikipedia.org'

/**
 * @private
 * @param {string} file
 * @returns
 */
function encodeTitle (file) {
  let title = file.replace(/^(image|file?):/i, '')
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.trim().replace(/ /g, '_')
  return title
}

/**
 * the wikimedia image url is a little silly
 *
 * @private
 * @param {string} file
 * @returns
 */
function makeSrc (file) {
  let title = encodeTitle(file)
  title = encodeURIComponent(title)
  return title
}

//the class for our image generation functions
class Image {
  constructor (data) {
    this.data = data
  }

  /**
   *
   * @returns {string} the "title" of the image
   */
  file () {
    let file = this.data.file || ''
    if (file) {
      const regFile = /^(image|file):/i
      if (!regFile.test(file)) {
        // if there's no 'File:', add it
        file = `File:${file}`
      }
      file = file.trim()
      //titlecase it
      file = file.charAt(0).toUpperCase() + file.substring(1)
      //spaces to underscores
      file = file.replace(/ /g, '_')
    }
    return file
  }

  alt () {
    let str = this.data.alt || this.data.file || ''
    str = str.replace(/^(file|image):/i, '')
    str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, '')
    return str.replace(/_/g, ' ')
  }

  /**
   *
   * @returns {string} the caption of the image
   */
  caption () {
    if (this.data.caption) {
      return this.data.caption.text()
    }
    return ''
  }

  /**
   *
   * @returns
   */
  links () {
    if (this.data.caption) {
      return this.data.caption.links()
    }
    return []
  }

  /**
   *
   * @returns {string} the url of the image
   */
  url () {
    // let lang = 'en' //this.language() || 'en' //hmm: get actual language?
    let fileName = makeSrc(this.file())
    let domain = this.data.domain || server
    let path = `wiki/Special:Redirect/file`
    return `https://${domain}/${path}/${fileName}`
  }

  /**
   *
   * @param {number} [size] the size of the desired thumbnail
   * @returns {string} the url of the thumbnail
   */
  thumbnail (size) {
    size = size || 300
    return this.url() + '?width=' + size
  }

  /**
   *
   * @returns {string | null} the extension of the image
   */
  format () {
    let arr = this.file().split('.')
    if (arr[arr.length - 1]) {
      return arr[arr.length - 1].toLowerCase()
    }
    return null
  }

  /**
   *
   * @param {object} [options]
   * @returns
   */
  json (options) {
    options = options || {}
    return toJson(this, options)
  }

  /**
   * NOT IMPLEMENTED
   * @returns {string} the text of the image
   */
  text () {
    return ''
  }

  /**
   *
   * @returns {string} the wikitext of the image
   */
  wikitext () {
    return this.data.wiki || ''
  }
}

Image.prototype.src = Image.prototype.url
Image.prototype.thumb = Image.prototype.thumbnail

export default Image
