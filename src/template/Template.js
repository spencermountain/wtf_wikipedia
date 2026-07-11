import { fromText } from '../04-sentence/index.js'

class Template {
  constructor(data, text = '', wiki = '') {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data,
    })
    Object.defineProperty(this, '_text', {
      enumerable: false,
      value: text,
    })
    Object.defineProperty(this, 'wiki', {
      enumerable: false,
      value: wiki,
    })
  }

  text() {
    let str = this._text || ''
    return fromText(str).text()
  }

  json() {
    return this.data || {}
  }

  wikitext() {
    return this.wiki || ''
  }
}

export default Template
