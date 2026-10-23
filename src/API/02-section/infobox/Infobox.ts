import Images from '../../03-paragraph/image/Images.ts'
import Block from '../../Block/Block.ts'
import Blocks from '../../Block/Blocks.ts'
import { infoboxType } from '../../../parse/templates/parse/infobox.ts'
import Image from '../../03-paragraph/image/Image.ts'
import parseImage from '../../../parse/03-paragraph/02-images/parse.ts'
import defaults from '../../../_lib/defaults.ts'
import latLngs from '../../../_data/lat-lngs.ts'
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
    return this.getAll(Object.keys(this.#data.data)).flatMap((block) => block.links())
  }

  get(input: string) {
    if (typeof input === 'string') {
      const key = normalizeKey(input)
      const value = this.#data.data[key]
      if (Array.isArray(value)) {
        return Blocks.from(value.map((item) => new Block(item)))
      }
      return value === undefined ? undefined : new Block(value)
    }
    return null
  }
  getFirst(choices: string[]) {
    const key = choices.find((choice) => this.get(choice))
    return key === undefined ? undefined : this.get(key)
  }
  getAll(choices: string[]) {
    const blocks = choices.flatMap((key) => {
      const value = this.get(key)
      if (!value) {
        return []
      }
      return Array.isArray(value) ? value : [value]
    })
    return Blocks.from(blocks)
  }

  images() {
    const properties = imgProperties.filter((key) => this.get(key))
    const images = properties
      .map((key) => {
        const item = this.getAll([key])[0]
        const caption = this.getAll([key === 'image2' ? 'caption2' : 'caption'])[0]
        const image = parseImage(item?.wikitext() || '', this.#info)
        if (!image) {
          return null
        }
        // An explicit infobox caption takes precedence over embedded markup.
        if (caption) {
          image.caption = caption.json('xl')
        }
        return new Image(image)
      })
      .filter(Boolean)
    return Images.from(images)
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
      const latText = this.getAll([a[0]])[0]?.text().trim()
      const lonText = this.getAll([a[1]])[0]?.text().trim()
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
