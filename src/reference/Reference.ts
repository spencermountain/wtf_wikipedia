import encodeObj from '../_lib/encode.ts'

//also called 'citations'
class Reference {
  declare data: any
  declare wiki: string

  constructor(data, wiki) {
    Object.defineProperty(this, 'data', {
      enumerable: false,
      value: data,
    })
    Object.defineProperty(this, 'wiki', {
      enumerable: false,
      value: wiki,
    })
  }

  title() {
    let data = this.data
    return data.title || data.encyclopedia || data.author || ''
  }

  links() {
    return [] //nah, skip these.
  }

  text() {
    return '' //nah, skip these.
  }

  wikitext() {
    return this.wiki || ''
  }

  json(options: any = {}) {
    let json = this.data || {}
    //encode them, for mongodb
    if (options.encode === true) {
      json = Object.assign({}, json)
      json = encodeObj(json)
    }
    return json
  }
}

export default Reference
