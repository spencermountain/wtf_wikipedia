import { images } from '../../../_data/i18n/index.ts'
import parseTemplate from '../../templates/parse/toJSON/index.ts'
import normalizeFile from './normalize.ts'
import parseBlock from '../../block/index.ts'
import type { ImageData } from '../../../types/index.ts'

//regexes:
let fileNames = `(${images.join('|')})`
const file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'iu')
const linkToFile = /^\[\[:/

//style directives for Wikipedia:Extended_image_syntax
const imgLayouts = {
  thumb: true,
  thumbnail: true,
  frame: true,
  framed: true,
  frameless: true,
  border: true,
  right: true,
  left: true,
  center: true,
  top: true,
  bottom: true,
  none: true,
  upright: true,
  baseline: true,
  middle: true,
  sub: true,
  super: true,
}

//images are usually [[image:my_pic.jpg]]
const parseImgString = function (wiki: string) {
  let m = wiki.match(file_reg)
  if (m === null || !m[2]) {
    return null
  }
  if (linkToFile.test(wiki)) {
    return null
  }
  let file = `${m[1]}:${m[2] || ''}`
  if (file) {
    // clean up the file name a bit
    file = normalizeFile(file)

    let img: ImageData = {
      file: file,
      wiki: wiki,
    }
    //try to grab other metadata, too
    wiki = wiki.replace(/^\[\[/, '')
    wiki = wiki.replace(/\]\]$/, '')

    // use the template parser to parse the image string
    //https://en.wikipedia.org/wiki/Wikipedia:Extended_image_syntax
    //- [[File:Name|Type|Border|Location|Alignment|Size|link=Link|alt=Alt|lang=Langtag|Caption]]
    let parsed = parseTemplate(wiki, [], 'raw')
    let arr = parsed.list || []
    //parse-out alt text, if explicitly given
    if (parsed.alt) {
      img.alt = parsed.alt.text
    }
    // Layout and size options may follow the caption.
    arr = arr.filter((item) => {
      let text = item.text.trim()
      return !Object.hasOwn(imgLayouts, text) && !/^(?:\d+(?:x\d+)?|x\d+)px$/.test(text)
    })
    // last one is caption
    if (arr.at(-1)) {
      img.caption = arr.at(-1)
    }
    return img
  }
  return null
}
export default parseImgString
