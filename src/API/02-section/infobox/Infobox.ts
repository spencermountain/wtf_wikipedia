import { infoboxType } from '../../../parse/templates/parse/infobox.ts'
import Image from '../../03-paragraph/image/Image.ts'
import parseImage from '../../../parse/03-paragraph/02-images/parse.ts'
import defaults from '../../../_lib/defaults.ts'
import latLngs from '../../../_data/lat-lngs.ts'
import Link from '../../03-paragraph/link/Link.ts'
import dmsCoordinates from './_lib.ts'
import { normalizeKey } from '../../../_lib/helpers.ts'
import type { InfoboxData, DocInfo } from '../../../types/index.ts'

const imgProperties = [
  'image',
  'image2',
  'logo',
  'image_skyline',
  'image_map', //not tested
  'image_map2', //not tested
  'image_flag',
  'image_coat',
  'image_file',
  '画像',
]

//a formal key-value data table about a topic
class Infobox {
  #data: InfoboxData
  #info: DocInfo

  constructor(data: InfoboxData, info: DocInfo = defaults) {
    this.#data = data
    this.#info = info
  }

  type() {
    return infoboxType(this.#data.template)
  }
  get kind() {
    return this.#data.kind
  }

  links() {
    let links = []
    Object.keys(this.#data.data).forEach((key) => {
      const value = this.#data.data[key]
      if (value?.links) {
        value.links.forEach((obj) => {
          links.push(new Link(obj))
        })
      }
    })
    return links
  }

  get(input: string) {
    if (typeof input === 'string') {
      const key = normalizeKey(input)
      return this.#data.data[key]
    }
    return null
  }
  getFirst(choices: string[]) {
    const key = choices.find((choice) => this.get(choice))
    return key === undefined ? undefined : this.get(key)
  }
  getAll(choices: string[]) {
    return choices.map((key) => this.get(key))
  }

  images() {
    const properties = imgProperties.filter((key) => this.get(key))
    return properties
      .map((key) => {
        const item = this.get(key)
        const caption = this.get(key === 'image2' ? 'caption2' : 'caption')
        const image = parseImage(item.wiki || '', this.#info)
        if (!image) {
          return null
        }
        // An explicit infobox caption takes precedence over embedded markup.
        if (caption) {
          image.caption = caption
        }
        return new Image(image)
      })
      .filter(Boolean)
  }

  image() {
    return this.images()[0]
  }

  text() {
    return ''
  }

  json(format = 'lg') {
    const json = structuredClone(this.#data)
    if (format === 'xl') {
      return json
    }
    delete json.wiki
    return json
  }

  wikitext() {
    return this.#data.wiki || ''
  }

  coordinates() {
    // loop through i18n latitude and longitude properties
    for (let i = 0; i < latLngs.length; i += 1) {
      let a = latLngs[i]
      const latText = this.get(a[0])?.text.trim()
      const lonText = this.get(a[1])?.text.trim()
      if (!latText || !lonText) {
        continue
      }
      const lat = Number(latText)
      const lon = Number(lonText)
      if (typeof lat === 'number' && typeof lon === 'number' && Number.isFinite(lat) && Number.isFinite(lon)) {
        return { template: 'infobox/lat-long', lat, lon, wiki: this.wikitext() }
      }
    }
    const coordinates = dmsCoordinates(this)
    return coordinates ? { ...coordinates, wiki: this.wikitext() } : null
  }
}

export default Infobox
