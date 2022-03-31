import setDefaults from '../_lib/setDefaults.js'

const defaults = {
  caption: true,
  alt: true,
  links: true,
  thumb: true,
  url: true,
}
//
const toJson = function (img, options) {
  options = setDefaults(options, defaults)
  let json = {
    file: img.file(),
  }
  if (options.thumb !== false) {
    json.thumb = img.thumbnail()
  }
  if (options.url !== false) {
    json.url = img.url()
  }
  //add captions
  if (options.caption !== false && img.data.caption) {
    json.caption = img.caption()
    if (options.links !== false && img.data.caption.links()) {
      json.links = img.links()
    }
  }
  if (options.alt !== false && img.data.alt) {
    json.alt = img.alt()
  }
  return json
}
export default toJson
