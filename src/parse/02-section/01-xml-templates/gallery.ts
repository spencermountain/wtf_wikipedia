import type { SectionData } from '../../../types/index.ts'
import parseImgString from '../../03-paragraph/02-images/parse-image.ts'

//okay, <gallery> is a xml-tag, with newline-separated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
//- not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
const parseGallery = function (section: SectionData) {
  section.remaining = section.remaining.replace(/<gallery([^>]*)>(.+)<\/gallery>/gs, (_, _attrs, inside) => {
    let lines = inside.split(/\n/g)
    lines = lines.filter((str: string) => str && str.trim() !== '')

    //parse the line, which has an image and sometimes a caption
    lines = lines.map((str: string) => {
      let arr = str.split(/\|/)
      const file = arr[0].trim()
      return parseImgString(file)
    })

    //add it to our templates list
    if (lines.length > 0) {
      section.templates.push({
        template: 'gallery',
        data: {
          pos: section.title,
          images: lines,
        },
      })
    }

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}
export default parseGallery
