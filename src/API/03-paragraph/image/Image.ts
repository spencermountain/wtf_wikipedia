import Link from '../link/Link.ts'
import type { ImageData, DocInfo } from '../../../types/index.ts'
const server = 'wikipedia.org'

const encodeTitle = function (file: string) {
  let title = file.replace(/^(image|file?):/i, '')
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.trim().replace(/ /g, '_')
  return title
}

//the wikimedia image url is a little silly:
const makeSrc = function (file: string) {
  let title = encodeTitle(file)
  title = encodeURIComponent(title)
  return title
}

//the class for our image generation functions
class Image {
  #data: ImageData

  constructor(data: ImageData, info: DocInfo = {}) {
    this.#data = data
    if (info.domain && info.domain !== data.domain) {
      this.#data = { ...data, domain: info.domain }
    }
  }

  file() {
    return this.#data.file || ''
  }

  alt() {
    let str = this.#data.alt || this.#data.file || ''
    str = str.replace(/^(file|image):/i, '')
    str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, '')
    return str.replace(/_/g, ' ')
  }

  caption() {
    if (this.#data.caption) {
      return this.#data.caption.text
    }
    return ''
  }

  links() {
    const arr = this.#data.caption?.links || []
    return arr.map((l) => new Link(l))
  }

  url() {
    // let lang = 'en' //this.language() || 'en' //hmm: get actual language?
    let fileName = makeSrc(this.file())
    let domain = this.#data.domain || server
    let path = `wiki/Special:Redirect/file`
    return `https://${domain}/${path}/${fileName}`
  }

  src() {
    return this.url()
  }

  thumbnail(size: number = 300) {
    return this.url() + '?width=' + size
  }

  format() {
    let arr = this.file().split('.')
    if (arr.at(-1)) {
      return arr.at(-1).toLowerCase()
    }
    return null
  }

  json(format = 'lg') {
    const json = structuredClone(this.#data)
    if (format === 'xl') {
      return json
    }
    delete json.wiki
    return json
  }

  text() {
    return ''
  }

  wikitext() {
    return this.#data.wiki || ''
  }
}

export default Image
