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
    const items = this.#data.data.inline?.links || []
    return items.map((item) => new Link(item))
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

  json() {
    return this.#data || {}
  }
}

export default Reference
