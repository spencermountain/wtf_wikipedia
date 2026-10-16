import { images } from '../../../_data/i18n/index.ts'
import parseTemplate from '../../templates/parse/toJSON/index.ts'
import nested_find from './nested_find.ts'
import type { ParagraphData, ImageData } from '../../../types/index.ts'
import normalizeFile from './normalize.ts'
//regexes:
const isFile = new RegExp('(' + images.join('|') + '):', 'i')
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
const parseImgString = function (img: string) {
  let m = img.match(file_reg)
  if (m === null || !m[2]) {
    return null
  }
  if (linkToFile.test(img)) {
    return null
  }
  let file = `${m[1]}:${m[2] || ''}`
  if (file) {
    // clean up the file name a bit
    file = normalizeFile(file)

    let obj: ImageData = {
      file: file,
      wiki: img,
    }
    //try to grab other metadata, too
    img = img.replace(/^\[\[/, '')
    img = img.replace(/\]\]$/, '')

    //https://en.wikipedia.org/wiki/Wikipedia:Extended_image_syntax
    //- [[File:Name|Type|Border|Location|Alignment|Size|link=Link|alt=Alt|lang=Langtag|Caption]]
    let imgData: any = parseTemplate(img, [], 'raw')
    let arr = imgData.list || []
    //parse-out alt text, if explicitly given
    if (imgData.alt) {
      obj.alt = imgData.alt.text()
    }
    // Layout and size options may follow the caption.
    arr = arr.filter((str) => {
      let text = str.text().trim()
      return !Object.hasOwn(imgLayouts, text) && !/^(?:\d+(?:x\d+)?|x\d+)px$/.test(text)
    })
    if (arr.at(-1)) {
      obj.caption = arr.at(-1)
    }
    return obj
  }
  return null
}

const parseImages = function (paragraph: ParagraphData) {
  let wiki = paragraph.remaining
  //parse+remove scary '[[ [[]] ]]' stuff
  let matches = nested_find(wiki)
  matches.forEach(function (s) {
    if (isFile.test(s) === true) {
      paragraph.images ||= []
      let img = parseImgString(s)
      if (img) {
        paragraph.images.push(img)
        wiki = wiki.replace(s, '')
      }
    }
  })
  paragraph.remaining = wiki
  return paragraph
}

export { parseImgString }

export default parseImages
