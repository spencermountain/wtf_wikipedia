import Links from '../../03-paragraph/link/Links.ts'
import Link from '../../03-paragraph/link/Link.ts'
import type { ReferenceData } from '../../../types/index.ts'

//also called 'citations'
class Reference {
  #data: ReferenceData

  constructor(data: ReferenceData) {
    this.#data = data
  }

  get kind() {
    return this.#data.kind
  }

  links() {
    const items = this.#data.links || this.#data.data.inline?.links || []
    return Links.from(items.map((item) => new Link(item)))
  }

  text() {
    return '' //nah, skip these.
  }

  title() {
    return this.#data.data.title || ''
  }

  wikitext() {
    return this.#data.wiki || ''
  }

  json(format = 'lg') {
    const json = structuredClone(this.#data)
    if (format === 'xl') {
      return json
    }
    delete json.wiki
    return json
  }
  static empty() {
    return new Reference({ template: '', kind: 'reference', wiki: '', text: '', data: {} })
  }
}

export default Reference
