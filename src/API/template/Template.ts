import fromText from '../../parse/sentences/index.ts'
import type { TemplateData } from '../../types/index.ts'

class Template {
  #data: TemplateData
  #text: string
  #wiki: string

  constructor(data: TemplateData, text = '', wiki = '') {
    this.#data = data
    this.#text = text
    this.#wiki = wiki
  }

  text() {
    let str = this.#text || ''
    return fromText(str).text
  }

  json() {
    return this.#data || {}
  }

  wikitext() {
    return this.#wiki || ''
  }
}

export default Template
