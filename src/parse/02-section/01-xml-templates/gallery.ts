import parseSentence from '../../sentences/index.ts'
import type { SectionData, ImageData } from '../../../types/index.ts'
import { parseImgString } from '../../03-paragraph/02-images/index.ts'

//okay, <gallery> is a xml-tag, with newline-separated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
//- not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
const parseGallery = function (section: SectionData) {
  section.remaining = section.remaining.replace(/<gallery([^>]*)>(.+)<\/gallery>/gs, (_, _attrs, inside) => {
    let images = inside.split(/\n/g)
    images = images.filter((str) => str && str.trim() !== '')

    //parse the line, which has an image and sometimes a caption
    images = images.map((str) => {
      let arr = str.split(/\|/)
      const file = arr[0].trim()
      let img: ImageData = parseImgString(file)
      let caption = arr.slice(1).join('|')
      if (caption !== '') {
        img.caption = parseSentence(caption)
      }
      return img
    })

    //add it to our templates list
    if (images.length > 0) {
      section.templates.push({
        template: 'gallery',
        images: images,
        pos: section.title,
      })
    }

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}
export default parseGallery
