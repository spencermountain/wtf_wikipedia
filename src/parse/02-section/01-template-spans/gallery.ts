import makeResult from '../../templates/result.ts'
import defaults from '../../../_lib/defaults.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'
import parseImgString from '../../03-paragraph/02-images/parse.ts'
import { defaultWorld } from '../../../world/index.ts'

//stop at the next opening tag, so that repeated unclosed tags don't each scan to the end of the page
const galleryReg = /<gallery((?:(?!<gallery)[^>])*)>((?:(?!<gallery).)*?)<\/gallery>/gs

//okay, <gallery> is a xml-tag, with newline-separated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
//- not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
const parseGallery = function (section: SectionData, opts: DocInfo = defaults) {
  section.remaining = section.remaining.replace(galleryReg, (wiki, _attrs, inside) => {
    let lines = inside.split(/\n/g)
    lines = lines.filter((str: string) => str && str.trim() !== '')

    //parse the line, which has an image and sometimes a caption
    lines = lines
      .map((str: string) => {
        str = str.trim()
        // Gallery filenames may omit the image namespace.
        if (!defaultWorld._cached.fileNamespaceReg.test(str)) {
          str = `File:${str}`
        }
        return parseImgString(`[[${str}]]`, opts)
      })
      .filter(Boolean)

    //add it to our templates list
    if (lines.length > 0) {
      section.templates.push(makeResult(wiki, 'gallery', { pos: section.title, images: lines }, '', opts))
    }

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}
export default parseGallery
