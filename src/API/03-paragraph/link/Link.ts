import type { LinkData } from '../../../types/index.ts'
import wikis from '../../../_data/interwiki.ts'

class Link {
  #data: LinkData

  constructor(data: LinkData) {
    this.#data = data
  }

  text() {
    return this.#data.text
  }

  json() {
    let obj: any = {}
    if (this.#data.text !== undefined) {
      obj.text = this.#data.text
    }
    obj.type = this.type()
    if (obj.type === 'internal') {
      obj.page = this.page()
    } else if (obj.type === 'interwiki') {
      if (this.#data.lang !== undefined) {
        obj.lang = this.#data.lang
      }
      if (this.#data.project !== undefined) {
        obj.project = this.#data.project
      }
      if (this.#data.prefix !== undefined) {
        obj.prefix = this.#data.prefix
      }
      obj.page = this.page()
      if (this.#data.inline !== undefined) {
        obj.inline = this.#data.inline
      }
    } else {
      obj.site = this.site()
    }
    let anchor = this.anchor()
    if (anchor) {
      obj.anchor = anchor
    }
    return obj
  }

  wikitext() {
    let txt = this.#data.wiki || ''
    return txt
  }

  page() {
    return this.#data.page
  }

  anchor() {
    return this.#data.anchor || ''
  }

  wiki() {
    return this.#data.wiki
  }

  interwiki() {
    return this.#data.interwiki
  }

  type() {
    return this.#data.type
  }

  site() {
    return this.#data.site
  }

  //create a url for any type of link
  href() {
    let type = this.type()
    if (type === 'external') {
      return this.site()
    }
    let page = this.page()
    page = page.replace(/ /g, '_')
    page = encodeURIComponent(page)
    let url = ''

    if (type === 'interwiki') {
      const wiki = this.#data.prefix || this.#data.project || this.#data.lang
      url = 'https://en.wikipedia.org/wiki/$1'
      if (Object.hasOwn(wikis, wiki)) {
        url = 'http://' + wikis[wiki]
        // Qualified language prefixes override the project's default language.
        if (this.#data.project && this.#data.lang) {
          url = url.replace('://en.', `://${this.#data.lang}.`)
        }
      }
      url = url.replace(/\$1/g, page)
    } else {
      //internal link
      url = `./${page}`
    }
    //add anchor on the end
    if (this.anchor()) {
      url += '#' + this.anchor()
    }
    return url
  }
}

export default Link
