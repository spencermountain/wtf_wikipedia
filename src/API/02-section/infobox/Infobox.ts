import Image from '../../03-paragraph/image/Image.ts'
import Sentence from '../../03-paragraph/sentence/Sentence.ts'
import normalizeFile from '../../../parse/03-paragraph/02-images/normalize.ts'
import latLngs from '../../../_data/lat-lngs.ts'
import dmsCoordinates from './_lib.ts'
import type { InfoboxData } from '../../../types/index.ts'

const normalize = (str = '') => {
  str = str.toLowerCase()
  str = str.replace(/[-_]/g, ' ')
  return str.trim()
}

//a formal key-value data table about a topic
class Infobox {
  #data: InfoboxData

  constructor(data: InfoboxData) {
    this.#data = data
  }

  type() {
    return this.#data.type
  }

  template() {
    return this.type()
  }

  links() {
    return [] //todo
    // return Object.values(this.#data).flatMap((block) => block.links.map((obj) => new Link(obj)))
  }

  image() {
    const fields = ['image', 'image2', 'logo', 'image_skyline', 'image_flag', 'image_file', '画像']
    const field = fields.map((key) => this.get(key)).find((value) => value?.text().trim() || value?.wikitext().trim())
    if (!field) {
      return null
    }
    const wiki = field.wikitext().trim()
    const file = normalizeFile(wiki.startsWith('[[') ? wiki : field.text())
    return new Image({ file, wiki, caption: this.get('caption')?.json() })
  }

  images() {
    const image = this.image()
    return image ? [image] : []
  }

  // TODO: Mixed scalar/array lookup results are outside the collection API for now.
  get(want: string) {
    let allKeys = Object.keys(this.#data.data).filter(
      (key) => typeof this.#data.data[key] === 'object' && this.#data.data[key] !== null
    )
    let key = normalize(want)
    for (let i = 0; i < allKeys.length; i += 1) {
      let tmp = normalize(allKeys[i])
      if (key === tmp) {
        return new Sentence(this.#data.data[allKeys[i]])
      }
    }
    return null
  }

  text() {
    return ''
  }

  json(options = { encode: false }) {
    return this.#data
  }

  wikitext() {
    return this.#data.wiki || ''
  }

  keyValue() {
    return Object.fromEntries(
      Object.entries(this.#data.data)
        .filter(([, value]) => value !== null && typeof value === 'object' && !Array.isArray(value))
        .map(([key, value]) => [key, value.text || ''])
    )
  }

  // TODO: Plain coordinate data remains outside the collection API.
  coordinates() {
    // loop through i18n latitude and longitude properties
    for (let i = 0; i < latLngs.length; i += 1) {
      let a = latLngs[i]
      const latText = this.get(a[0])?.text().trim()
      const lonText = this.get(a[1])?.text().trim()
      if (!latText || !lonText) {
        continue
      }
      const lat = Number(latText)
      const lon = Number(lonText)
      if (typeof lat === 'number' && typeof lon === 'number' && Number.isFinite(lat) && Number.isFinite(lon)) {
        return { template: 'infobox/lat-long', lat, lon }
      }
    }
    return dmsCoordinates(this)
  }
}

export default Infobox
