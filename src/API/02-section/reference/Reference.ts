import encodeObj from '../../_lib/encode.ts'
import type { ReferenceData } from '../../../types/index.ts'

//also called 'citations'
class Reference {
  #data: ReferenceData
  #wiki: string

  constructor(data: ReferenceData) {
    this.#data = data
  }

  title() {
    let data = this.#data || {}
    return data.title || data.encyclopedia || data.author || ''
  }

  links() {
    const items = this.#data.inline?.links() || []
    return items
  }

  text() {
    return '' //nah, skip these.
  }

  wikitext() {
    return this.#wiki || ''
  }

  json(options: any = {}) {
    let json = this.#data || {}
    //encode them, for mongodb
    if (options.encode === true) {
      json = { ...json }
      json = encodeObj(json)
    }
    return json
  }
}

export default Reference
