import type { TemplateData } from '../../../types/index.ts'
import Link from '../../03-paragraph/link/Link.ts'

class Template {
  #data: TemplateData

  constructor(data: TemplateData) {
    this.#data = data
  }
  get type() {
    return this.#data.kind || this.#data.template.toLowerCase().replace(/_/g, ' ')
  }
  get kind() {
    return this.#data.kind
  }
  text() {
    return this.#data.text
  }
  links() {
    return (this.#data.links || []).map((link) => new Link(link))
  }
  json() {
    return this.#data
  }
  wikitext() {
    return this.#data.wiki
  }
  isEmpty() {
    return this.#data.template === ''
  }
  static empty() {
    return new Template({ template: '', kind: null, wiki: '', text: '', data: {} })
  }
}

export default Template
