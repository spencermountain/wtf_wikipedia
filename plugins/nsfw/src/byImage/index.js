import hashes from './mapping.js'
import hash, { normalize } from './hash.js'

const bad = new Set(hashes.split(' '))

// look for any known obscene images from wikipedia's
// https://en.wikipedia.org/wiki/MediaWiki:Bad_image_list
const byImage = function (doc) {
  const images = doc.images()
  const found = []
  for (let i = 0; i < images.length; i++) {
    const img = images[i]
    let file = img.file()
    file = normalize(file.replace(/^[^:]*:/, ''))
    if (bad.has(hash(file))) {
      found.push({ reason: 'Obscenity', name: file, data: img.json() })
    }
  }
  return found
}

export default byImage
