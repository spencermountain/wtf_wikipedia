import Links from '../../03-paragraph/link/Links.ts'
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
    return Links.from(this.getAll(Object.keys(this.#data.data)).flatMap((block) => block.links()))
  }

  get(input: string) {
    return this.getAll([input])[0]
  }
  getFirst(choices: string[]) {
    for (let i = 0; i < choices.length; i += 1) {
      const block = this.get(choices[i])
      if (block) {
        return block
      }
    }
    return undefined
  }
  getAll(choices: string[]) {
    const values = choices.flatMap((key) => {
      if (typeof key !== 'string') {
        return []
      }
      const value = this.#data.data[normalizeKey(key)]
      return value ?? []
    })
    return Blocks.from(values.map((value) => new Block(value)))
  }

  images() {
    const properties = imgProperties.filter((key) => this.get(key))
    const images = properties
      .map((key) => {
        const item = this.get(key)
        const caption = this.get(key === 'image2' ? 'caption2' : 'caption')
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
      const latText = this.get(a[0])?.text().trim()
      const lonText = this.get(a[1])?.text().trim()
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
