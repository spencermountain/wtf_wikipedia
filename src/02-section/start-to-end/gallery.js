const parseSentence = require('../../04-sentence/').fromText
const Image = require('../../image/Image')
//okay, <gallery> is a xml-tag, with newline-separated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
// - not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
const parseGallery = function (section, doc) {
  let wiki = section.wiki
  wiki = wiki.replace(/<gallery([^>]*?)>([\s\S]+?)<\/gallery>/g, (_, attrs, inside) => {
    let images = inside.split(/\n/g)
    images = images.filter((str) => str && str.trim() !== '')
    //parse the line, which has an image and sometimes a caption
    images = images.map((str) => {
      let arr = str.split(/\|/)
      let obj = {
        file: arr[0].trim(),
        lang: doc._lang,
        domain: doc._domain,
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
      section.templates.push({
        template: 'gallery',
        images: images,
        pos: section.title,
      })
    }
    return ''
  })
  section.wiki = wiki
}
module.exports = parseGallery
