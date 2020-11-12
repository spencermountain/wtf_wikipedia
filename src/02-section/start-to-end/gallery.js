const Section = require('../Section')

const parseSentence = require('../../04-sentence/').fromText
const Image = require('../../image/Image')
//okay, <gallery> is a xml-tag, with newline-separated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
//- not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
/**
 *
 * @private
 * @param {string} catcher
 * @param {Document} doc
 * @param {Section} section
 */
const parseGallery = function (catcher, doc, section) {
  catcher.text = catcher.text.replace(/<gallery([^>]*?)>([\s\S]+?)<\/gallery>/g, (_, attrs, inside) => {
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
module.exports = parseGallery
