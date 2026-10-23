import Link from '../../03-paragraph/link/Link.ts'
import type { ReferenceData } from '../../../types/index.ts'

//also called 'citations'
class Reference {
  #data: ReferenceData

  constructor(data: ReferenceData) {
    this.#data = data
  }

  links() {
    const items = this.#data.inline?.links || []
    return items.map((item) => new Link(item))
  }

  text() {
    return '' //nah, skip these.
  }

  wikitext() {
    return this.#data.wiki || ''
  }

  json() {
    return this.#data || {}
  }
}

export default Reference
