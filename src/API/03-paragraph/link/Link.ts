import type { LinkData } from '../../../types/index.ts'
import wikis from '../../../_data/interwiki.ts'

class Link {
  #data: LinkData

  constructor(data: LinkData) {
    this.#data = data
  }

  text() {
    let txt = this.#data.text || this.#data.page || ''
    // remove bold/italics
    txt = txt.replace(/'{2,}/g, '')
    return txt
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
      obj.interwiki = this.interwiki()
      obj.page = this.page()
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
      const destination = this.interwiki()
      const wiki = typeof destination === 'string' ? destination : destination?.wiki
      url = 'https://en.wikipedia.org/wiki/$1'
      if (Object.hasOwn(wikis, wiki)) {
        url = 'http://' + wikis[wiki]
        // Qualified language prefixes override the project's default language.
        if (typeof destination === 'object') {
          url = url.replace('://en.', `://${destination.lang}.`)
        }
      }
      url = url.replace(/\$1/g, page)
    } else {
      //internal link
      url = `./${this.page()}`
    }
    //add anchor on the end
    if (this.anchor()) {
      url += '#' + this.anchor()
    }
    return url
  }
}

export default Link
