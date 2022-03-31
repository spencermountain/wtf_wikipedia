import toJson from './toJson.js'
const server = 'wikipedia.org'

const encodeTitle = function (file) {
  let title = file.replace(/^(image|file?):/i, '')
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.trim().replace(/ /g, '_')
  return title
}

//the wikimedia image url is a little silly:
const makeSrc = function (file) {
  let title = encodeTitle(file)
  title = encodeURIComponent(title)
  return title
}

//the class for our image generation functions
const Image = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}

const methods = {
  file() {
    let file = this.data.file || ''
    if (file) {
      const regFile = /^(image|file):/i
      if (!regFile.test(file)) {// if there's no 'File:', add it
        file = `File:${file}`
      }
      file = file.trim()
      //titlecase it
      file = file.charAt(0).toUpperCase() + file.substring(1)
      //spaces to underscores
      file = file.replace(/ /g, '_')
    }
    return file
  },
  alt() {
    let str = this.data.alt || this.data.file || ''
    str = str.replace(/^(file|image):/i, '')
    str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, '')
    return str.replace(/_/g, ' ')
  },
  caption() {
    if (this.data.caption) {
      return this.data.caption.text()
    }
    return ''
  },
  links() {
    if (this.data.caption) {
      return this.data.caption.links()
    }
    return []
  },
  url() {
    // let lang = 'en' //this.language() || 'en' //hmm: get actual language?
    let fileName = makeSrc(this.file())
    let domain = this.data.domain || server
    let path = `wiki/Special:Redirect/file`
    return `https://${domain}/${path}/${fileName}`
  },
  thumbnail(size) {
    size = size || 300
    return this.url() + '?width=' + size
  },
  format() {
    let arr = this.file().split('.')
    if (arr[arr.length - 1]) {
      return arr[arr.length - 1].toLowerCase()
    }
    return null
  },
  json: function (options) {
    options = options || {}
    return toJson(this, options)
  },
  text: function () {
    return ''
  },
  wikitext: function () {
    return this.data.wiki || ''
  },
}

Object.keys(methods).forEach((k) => {
  Image.prototype[k] = methods[k]
})

Image.prototype.src = Image.prototype.url
Image.prototype.thumb = Image.prototype.thumbnail
export default Image
