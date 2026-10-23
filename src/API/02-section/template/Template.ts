import type { TemplateData } from '../../../types/index.ts'

class Template {
  #data: TemplateData
  #text: string
  #wiki: string

  constructor(data: TemplateData, text = '', wiki = '') {
    this.#data = data
    this.#text = text
    this.#wiki = wiki
  }
  get type() {
    return this.#data.template || this.#data.name
  }

  text() {
    return this.#text || ''
  }

  json() {
    return this.#data || {}
  }

  wikitext() {
    return this.#wiki || ''
  }
  isEmpty() {
    return Object.keys(this.#data).length === 0
  }
  static empty() {
    return new Template({
      template: '',
    })
  }
}

export default Template
