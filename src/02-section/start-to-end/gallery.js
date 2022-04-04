import { fromText as parseSentence } from '../../04-sentence/index.js'
import Image from '../../image/Image.js'
//okay, <gallery> is a xml-tag, with newline-separated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
//- not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
/**
 *
 * @private
 * @param {object} catcher
 * @param {object} doc
 * @param {object} section
 */
const parseGallery = function (catcher, doc, section) {
  catcher.text = catcher.text.replace(/<gallery([^>]*)>([\s\S]+)<\/gallery>/g, (_, _attrs, inside) => {
    let images = inside.split(/\n/g)
    images = images.filter((str) => str && str.trim() !== '')

    //parse the line, which has an image and sometimes a caption
    images = images.map((str) => {
      let arr = str.split(/\|/)
      let obj = {
        file: arr[0].trim(),
        lang: doc.lang(),
        domain: doc.domain(),
      }
      let img = new Image(obj).json()
      let caption = arr.slice(1).join('|')
      if (caption !== '') {
        img.caption = parseSentence(caption)
      }
      return img
    })

    //add it to our templates list
    if (images.length > 0) {
      catcher.templates.push({
        template: 'gallery',
        images: images,
        pos: section.title,
      })
    }

    //return empty string to remove the template from the wiki text
    return ''
  })
}
export default parseGallery
