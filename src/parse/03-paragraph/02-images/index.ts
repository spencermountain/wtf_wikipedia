import defaults from '../../../_lib/defaults.ts'
import nested_find from './nested_find.ts'
import parseImgString from './parse-image.ts'
import { images } from '../../../_data/i18n/index.ts'
import type { DocInfo, ParagraphData } from '../../../types/index.ts'

const isFile = new RegExp('(' + images.join('|') + '):', 'i')

const parseImages = function (paragraph: ParagraphData, opts: DocInfo = defaults) {
  let wiki = paragraph.remaining
  //parse+remove scary '[[ [[]] ]]' stuff
  let matches = nested_find(wiki)
  matches.forEach(function (s) {
    if (isFile.test(s) === true) {
      paragraph.images ||= []
      let img = parseImgString(s, opts)
      if (img) {
        paragraph.images.push(img)
        wiki = wiki.replace(s, '')
      }
    }
  })
  paragraph.remaining = wiki
  return paragraph
}

export default parseImages
