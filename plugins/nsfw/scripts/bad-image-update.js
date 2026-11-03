import wtf from 'wtf_wikipedia'
import fs from 'node:fs'
import hash, { normalize } from '../src/byImage/hash.js'

const url = 'https://en.wikipedia.org/wiki/MediaWiki:Bad_image_list'
const output = new URL('../src/byImage/mapping.js', import.meta.url)

wtf.fetch(url).then((doc) => {
  const images = []
  doc
    .lists()[0]
    .json()
    .forEach((item) => {
      let file = item.text.match(/\[\[[^[\]]*\]\]/)[0]
      file = file.replace('[[:File:', '')
      file = file.replace(']]', '')
      if (file) {
        images.push(file)
      }
    })
  const hashes = [...new Set(images.map((file) => hash(normalize(file))))]
  const out = `// 32-bit hashes of normalized filenames from Wikipedia MediaWiki:Bad_image_list
export default '${hashes.join(' ')}'
`
  fs.writeFileSync(output, out)
})
