const i18n = require('../_data/i18n')
const Image = require('./Image')
const parseTemplate = require('../template/_parsers/parse')
const parseSentence = require('../04-sentence').fromText
const nested_find = require('./nested_find')
//regexes:
const isFile = new RegExp('(' + i18n.images.join('|') + '):', 'i')
let fileNames = `(${i18n.images.join('|')})`
const file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'iu')

//style directives for Wikipedia:Extended_image_syntax
const imgLayouts = {
  thumb: true,
  thumbnail: true,
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
const oneImage = function (img, doc) {
  let m = img.match(file_reg)
  if (m === null || !m[2]) {
    return null
  }
  let file = `${m[1]}:${m[2] || ''}`
  file = file.trim()
  //titlecase it
  let title = file.charAt(0).toUpperCase() + file.substring(1)
  //spaces to underscores
  title = title.replace(/ /g, '_')
  if (title) {
    let obj = {
      file: file,
      lang: doc._lang,
      domain: doc._domain,
    }
    //try to grab other metadata, too
    img = img.replace(/^\[\[/, '')
    img = img.replace(/\]\]$/, '')

    //https://en.wikipedia.org/wiki/Wikipedia:Extended_image_syntax
    // - [[File:Name|Type|Border|Location|Alignment|Size|link=Link|alt=Alt|lang=Langtag|Caption]]
    let imgData = parseTemplate(img)
    let arr = imgData.list || []
    //parse-out alt text, if explicitly given
    if (imgData.alt) {
      obj.alt = imgData.alt
    }
    //remove 'thumb' and things
    arr = arr.filter((str) => imgLayouts.hasOwnProperty(str) === false)
    if (arr[arr.length - 1]) {
      obj.caption = parseSentence(arr[arr.length - 1])
    }
    return new Image(obj)
  }
  return null
}

const parseImages = function (paragraph, doc) {
  let wiki = paragraph.wiki
  //parse+remove scary '[[ [[]] ]]' stuff
  let matches = nested_find(wiki)
  matches.forEach(function (s) {
    if (isFile.test(s) === true) {
      paragraph.images = paragraph.images || []
      let img = oneImage(s, doc)
      if (img) {
        paragraph.images.push(img)
      }
      wiki = wiki.replace(s, '')
    }
  })
  paragraph.wiki = wiki
}
module.exports = parseImages
