import Collection from '../collection/Collection.js'
import toJson from './toJson.ts'
import Image from '../image/Image.ts'
import { isArray } from '../../parse/_lib/helpers.ts'
import Sentence from '../04-sentence/Sentence.ts'
import latLngs from '../../_data/lat-lngs.ts'
import dmsCoordinates from './_lib.ts'
import type { InfoxboxData } from '../../types/index.ts'

const normalize = (str = '') => {
  str = str.toLowerCase()
  str = str.replace(/[-_]/g, ' ')
  return str.trim()
}

//a formal key-value data table about a topic
class Infobox {
  #data: InfoxboxData
  #wiki: string

  constructor(obj: InfoxboxData, wiki: string) {
    this.#data = obj.data
    this.#wiki = wiki
  }

  type() {
    return this.#data.type
  }

  template() {
    return this.type()
  }

  links(selector?) {
    const items = Object.values(this.#data).flatMap((sentence: Sentence) => sentence.links())
    return Collection.from(items).select(selector)
  }

  image() {
    const s =
      this.#data.image ||
      this.#data.image2 ||
      this.#data.logo ||
      this.#data.image_skyline ||
      this.#data.image_flag ||
      this.#data.image_file ||
      this.#data['画像']
    if (!s) {
      return null
    }
    let obj = s.json()
    let file = obj.text
    // Keep the filename when localized image markup parses as a labeled link.
    if (s.wikitext().trim().startsWith('[[')) {
      file = s.wikitext()
    }
    obj.file = file
    obj.text = ''
    obj.caption = this.#data.caption
    // obj.domain = this.domain // add domain information for image
    return new Image(obj)
  }

  // TODO: Preserve this legacy singular alias until its return shape is reviewed.
  images() {
    return this.image()
  }

  // TODO: Mixed scalar/array lookup results are outside the collection API for now.
  get(keys?) {
    let allKeys = Object.keys(this.#data)
    if (typeof keys === 'string') {
      let key = normalize(keys)
      for (let i = 0; i < allKeys.length; i += 1) {
        let tmp = normalize(allKeys[i])
        if (key === tmp) {
          return this.#data[allKeys[i]]
        }
      }
      return new Sentence()
    }
    if (isArray(keys)) {
      // support array-input
      keys = keys.map(normalize)
      return keys.map((k) => {
        for (let i = 0; i < allKeys.length; i += 1) {
          let tmp = normalize(allKeys[i])
          if (k === tmp) {
            return this.#data[allKeys[i]]
          }
        }
        return new Sentence()
      })
    }
    return new Sentence()
  }

  text() {
    return ''
  }

  json(options?) {
    options ||= {}
    return toJson(this, options)
  }

  wikitext() {
    return this.#wiki || ''
  }

  keyValue() {
    return Object.fromEntries(
      Object.keys(this.#data)
        .filter((k) => this.#data[k])
        .map((k) => [k, this.#data[k].text()])
    )
  }

  // TODO: Plain coordinate data remains outside the collection API.
  coordinates() {
    // loop through i18n latitude and longitude properties
    for (let i = 0; i < latLngs.length; i += 1) {
      let a = latLngs[i]
      let lat = this.get(a[0])?.json()?.number
      let lon = this.get(a[1])?.json()?.number
      if (typeof lat === 'number' && typeof lon === 'number' && Number.isFinite(lat) && Number.isFinite(lon)) {
        return { template: 'infobox/lat-long', lat, lon }
      }
    }
    return dmsCoordinates(this)
  }
}

export default Infobox
